<script setup lang="ts">
  import type {
    WorkerRequest,
    WorkerResponse,
    DetectionBox,
    LiveDetection,
  } from "~/types/vision";

  const modelName = "YOLO11n";
  const defaultInput = 640;

  const usingWebGPU = ref(false);
  const fps = ref(0);
  const backend = ref<string>("");
  const showLabels = ref(true);
  const inputSize = ref<number>(defaultInput);
  const isLoading = ref(false);
  const isModelReady = ref(false);
  const showDetections = ref(true);
  const showBoundingBoxes = ref(false); // Toggle for bounding boxes
  const liveDetections = ref<LiveDetection[]>([]);
  const isWebcamActive = ref(false);
  const isProcessing = ref(false);
  const uploadedImage = ref<HTMLImageElement | null>(null);
  const currentImage = ref<HTMLImageElement | null>(null); // Store current image for redrawing
  const lastDetections = ref<DetectionBox[]>([]); // Store last detection results for redrawing

  // Test images for gallery
  const testImages = [
    {
      url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop",
      description: "Cat",
    },
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      description: "Person",
    },
    {
      url: "/images/bus.jpg",
      description: "Bus",
    },
  ];

  const videoEl = ref<HTMLVideoElement | null>(null);
  const canvasEl = ref<HTMLCanvasElement | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);

  let worker: Worker | null = null;
  let rafId: number | null = null;
  let lastFrameTs = 0;

  const hasWebGPU = computed(
    () => typeof (globalThis as any).navigator?.gpu !== "undefined"
  );

  onBeforeUnmount(() => {
    stopStream();
    if (worker) {
      worker.terminate();
      worker = null;
    }
    if (rafId) cancelAnimationFrame(rafId);
  });

  // Signal component ready for testing
  onMounted(() => {
    console.log("YOLOCard component mounted. Ready for testing.");
  });

  // Get color based on confidence score
  const getDetectionColor = (count: number) => {
    if (count >= 3) return "#ef4444"; // Red for many objects
    if (count >= 2) return "#f59e0b"; // Orange for multiple objects
    return "#10b981"; // Green for single objects
  };

  // Consolidate multiple objects with counts
  const consolidateDetections = (detections: DetectionBox[]) => {
    const counts: { [key: string]: number } = {};

    detections.forEach((detection) => {
      const label = detection.label || "unknown";
      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      displayText: count > 1 ? `${label} x${count}` : label,
    }));
  };

  const updateLiveDetections = (detections: DetectionBox[]) => {
    // Store the last detections for redrawing when toggling boxes
    lastDetections.value = detections;

    // Consolidate multiple objects with counts
    const consolidated = consolidateDetections(detections);

    console.log("🎯 Processing detections:", {
      raw: detections.length,
      consolidated: consolidated.length,
      details: consolidated,
    });

    // Update the live detections with consolidated data
    liveDetections.value = consolidated.map((item) => ({
      label: item.label,
      score: 0, // We'll use count instead
      timestamp: new Date().toLocaleTimeString(),
      count: item.count,
    }));

    // Always redraw the image with boxes if they're enabled
    // This ensures boxes show immediately when toggling the checkbox
    if (showBoundingBoxes.value && canvasEl.value) {
      drawDetections(detections, canvasEl.value.width, canvasEl.value.height);
    }
  };

  // Watch for bounding box toggle changes
  watch(showBoundingBoxes, (newValue) => {
    if (newValue && lastDetections.value.length > 0 && canvasEl.value) {
      // If boxes are enabled and we have stored detections, redraw them immediately
      drawDetections(
        lastDetections.value,
        canvasEl.value.width,
        canvasEl.value.height
      );
    } else if (!newValue && canvasEl.value) {
      // If boxes are disabled, redraw the image without boxes
      redrawCurrentImage();
    }
  });

  // Redraw current image (useful for toggling boxes on/off)
  const redrawCurrentImage = () => {
    if (!canvasEl.value) return;

    // Redraw the background image
    if (isWebcamActive.value && videoEl.value?.srcObject) {
      // For webcam, the video frame is continuously drawn
      return;
    } else if (currentImage.value) {
      // For uploaded images, redraw the stored image
      const ctx = canvasEl.value.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          currentImage.value,
          0,
          0,
          canvasEl.value.width,
          canvasEl.value.height
        );
      }
    }
  };

  function ensureWorker() {
    if (worker) return;
    worker = new Worker(new URL("../workers/yolo.worker.ts", import.meta.url), {
      type: "module",
    });
  }

  async function loadModelIfNeeded() {
    if (isModelReady.value) return;
    isLoading.value = true;
    ensureWorker();

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading.value) {
        isLoading.value = false;
        alert(
          "Model loading timed out. The ONNX file might be corrupted or invalid."
        );
      }
    }, 30000); // 30 second timeout

    worker!.postMessage({
      type: "init",
      inputSize: inputSize.value,
    } satisfies WorkerRequest);

    // Clear timeout when model is ready
    worker!.onmessage = (ev: MessageEvent<WorkerResponse>) => {
      if (ev.data.type === "ready") {
        clearTimeout(timeout);
        backend.value = ev.data.backend;
        usingWebGPU.value = ev.data.backend === "webgpu";
        isModelReady.value = true;
        isLoading.value = false;
      } else if (ev.data.type === "result") {
        // Update live detection panel instead of drawing boxes
        updateLiveDetections(ev.data.boxes);
        showDetections.value = true;

        // FPS calc
        const now = performance.now();
        if (lastFrameTs) {
          const dt = (now - lastFrameTs) / 1000;
          fps.value = Math.round(1 / dt);
        }
        lastFrameTs = now;
      } else if (ev.data.type === "error") {
        clearTimeout(timeout);
        console.error(ev.data.message);
        isLoading.value = false;
        // Show user-friendly error
        if (ev.data.message.includes("protobuf parsing failed")) {
          alert(
            "Model failed to load. Please check that the YOLO11n ONNX file is valid."
          );
        } else if (ev.data.message.includes("Failed to load model")) {
          alert(
            "Model failed to load. Please check that the YOLO11n ONNX file is valid."
          );
        } else {
          alert(`Error: ${ev.data.message}`);
        }
      }
    };
  }

  const stopStream = async () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (videoEl.value && videoEl.value.srcObject) {
      const stream = videoEl.value.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoEl.value.srcObject = null;
    }

    // Stop worker inference
    if (worker) {
      worker.postMessage({ type: "stop" });
    }

    // Clear canvas
    if (canvasEl.value) {
      const ctx = canvasEl.value.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
      }
    }

    // Reset state
    isWebcamActive.value = false;
    liveDetections.value = [];
    showDetections.value = false;
    currentImage.value = null; // Clear stored image
    lastDetections.value = []; // Clear stored detections

    console.log("🛑 Webcam stopped, model inference halted, canvas cleared");
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoEl.value) {
        videoEl.value.srcObject = stream;
        videoEl.value.play();
        isWebcamActive.value = true; // Set webcam as active
        loopWebcam();
      }
    } catch (error) {
      console.error("Error starting webcam:", error);
    }
  };

  async function onUseWebcam() {
    if (!isModelReady.value) {
      alert("Please wait for the model to load first.");
      return;
    }

    // If webcam is already active, don't do anything
    if (isWebcamActive.value) {
      return;
    }

    // If we're currently in upload mode, stop any existing processing first
    if (uploadedImage.value) {
      uploadedImage.value = null;
      currentImage.value = null; // Clear stored image
      lastDetections.value = []; // Clear stored detections
      if (canvasEl.value) {
        const ctx = canvasEl.value.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
        }
      }
    }

    startWebcam();
  }

  function loopWebcam() {
    if (!videoEl.value) return;

    // Reset detection panel for new webcam session
    liveDetections.value = [];
    showDetections.value = true;
    lastDetections.value = []; // Clear stored detections

    const v = videoEl.value;
    const c = canvasEl.value!;
    const ctx = c.getContext("2d")!;

    // Significantly reduce frame rate to give AI time to process
    const targetFPS = 2; // Reduced from 5 to 2 FPS for much better AI processing
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;
    let frameCount = 0;

    const render = () => {
      if (!v.videoWidth || !v.videoHeight) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const currentTime = performance.now();

      // Only process frames at target FPS
      if (currentTime - lastFrameTime < frameInterval) {
        rafId = requestAnimationFrame(render);
        return;
      }

      lastFrameTime = currentTime;
      frameCount++;

      // Set canvas size only once, don't clear it each frame
      if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
        c.width = v.videoWidth;
        c.height = v.videoHeight;
      }

      // Always draw the video frame to keep it live
      ctx.drawImage(v, 0, 0, c.width, c.height);

      // Only process every 5th frame to give AI much more time to process
      if (frameCount % 5 === 0) {
        // Create ImageBitmap and transfer it to worker
        createImageBitmap(c).then((bitmap) => {
          worker!.postMessage(
            {
              type: "infer",
              image: bitmap,
              inputSize: inputSize.value,
              showLabels: showLabels.value,
            } satisfies WorkerRequest,
            [bitmap]
          ); // Transfer ownership
        });
      }

      rafId = requestAnimationFrame(render);
    };
    render();
  }

  async function onUploadClick() {
    await loadModelIfNeeded();
    fileInput.value?.click();
  }

  async function onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;

    // If webcam is active, stop it first
    if (isWebcamActive.value) {
      await stopStream();
    }

    // Clear any previously stored image
    currentImage.value = null;
    lastDetections.value = []; // Clear stored detections

    const file = input.files[0];
    await drawFromFile(file);
  }

  async function drawFromFile(file: File) {
    const img = new Image();
    img.onload = () => {
      const c = canvasEl.value!;
      const ctx = c.getContext("2d")!;
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, c.width, c.height);

      // Store the image for redrawing when drawing detections
      currentImage.value = img;
      lastDetections.value = []; // Clear stored detections

      // Reset detection panel for new image
      liveDetections.value = [];
      showDetections.value = true;
      isWebcamActive.value = false; // Ensure webcam state is reset

      // Create ImageBitmap and transfer it to worker
      createImageBitmap(c).then((bitmap) => {
        worker!.postMessage(
          {
            type: "infer",
            image: bitmap,
            inputSize: inputSize.value,
            showLabels: showLabels.value,
          } satisfies WorkerRequest,
          [bitmap]
        ); // Transfer ownership
      });
    };
    img.src = URL.createObjectURL(file);
  }

  function drawDetections(boxes: DetectionBox[], srcW: number, srcH: number) {
    const c = canvasEl.value!;
    const ctx = c.getContext("2d")!;

    // Clear only the detection overlay area, not the entire canvas
    // This prevents old detection boxes from accumulating
    ctx.clearRect(0, 0, c.width, c.height);

    // Redraw the background - either video frame or uploaded image
    if (isWebcamActive.value && videoEl.value?.srcObject) {
      // Redraw the video frame to restore the background
      ctx.drawImage(videoEl.value, 0, 0, c.width, c.height);
    } else if (currentImage.value) {
      // Redraw the uploaded image to restore the background
      ctx.drawImage(currentImage.value, 0, 0, c.width, c.height);
    }

    // Scale coordinates from model output (640x640) to actual canvas dimensions
    const scaleX = c.width / 640;
    const scaleY = c.height / 640;

    console.log("🎨 Drawing detections:", {
      canvasSize: { width: c.width, height: c.height },
      scale: { x: scaleX, y: scaleY },
      boxes: boxes.length,
    });

    // draw overlay boxes
    ctx.strokeStyle = "#00ff00"; // Bright green for better visibility
    ctx.fillStyle = "rgba(0, 255, 0, 0.1)"; // Semi-transparent green fill
    ctx.lineWidth = 4; // Much thicker lines

    for (const b of boxes) {
      // Scale the coordinates to match canvas dimensions
      const scaledX = b.x * scaleX;
      const scaledY = b.y * scaleY;
      const scaledW = b.w * scaleX;
      const scaledH = b.h * scaleY;

      console.log("📦 Box:", {
        original: { x: b.x, y: b.y, w: b.w, h: b.h },
        scaled: { x: scaledX, y: scaledY, w: scaledW, h: scaledH },
        label: b.label,
        score: b.score,
      });

      // Draw filled rectangle with border
      ctx.fillRect(scaledX, scaledY, scaledW, scaledH);
      ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);

      if (showLabels.value && b.label) {
        const text = `${b.label} ${(b.score * 100).toFixed(1)}%`;
        ctx.font = "bold 16px ui-sans-serif, system-ui"; // Bigger, bolder font
        const metrics = ctx.measureText(text);
        const pad = 8;

        // Draw label background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(scaledX, scaledY - 24, metrics.width + pad * 2, 24);

        // Draw label text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, scaledX + pad, scaledY - 6);

        // Reset fill style for next iteration
        ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
      }
    }
  }

  // Load test image from gallery
  const loadTestImage = async (imageData: {
    url: string;
    description: string;
  }) => {
    if (!isModelReady.value) {
      alert("Please wait for the model to load first.");
      return;
    }

    // If webcam is active, stop it first
    if (isWebcamActive.value) {
      await stopStream();
    }

    // Clear any previously stored image
    currentImage.value = null;
    lastDetections.value = []; // Clear stored detections

    // Reset detection panel for new image
    liveDetections.value = [];
    showDetections.value = true;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle CORS for external images
    img.onload = () => {
      if (canvasEl.value) {
        const ctx = canvasEl.value.getContext("2d");
        if (ctx) {
          canvasEl.value.width = img.naturalWidth;
          canvasEl.value.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0, canvasEl.value.width, canvasEl.value.height);

          // Store the image for redrawing when drawing detections
          currentImage.value = img;
          lastDetections.value = []; // Clear stored detections

          // Process the image with YOLO
          createImageBitmap(canvasEl.value).then((bitmap) => {
            if (worker) {
              worker.postMessage(
                {
                  type: "infer",
                  image: bitmap,
                  inputSize: inputSize.value,
                  showLabels: showLabels.value,
                } satisfies WorkerRequest,
                [bitmap]
              );
            }
          });
        }
      }
    };
    img.onerror = () => {
      alert("Failed to load image. Please try another one.");
    };
    img.src = imageData.url;
  };
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-semibold">Interactive Vision Demo (YOLO)</h3>
          <p class="text-xs text-muted-foreground">
            Runs in your browser. No uploads unless you turn on server fallback
            (off by default).
          </p>
        </div>
        <UBadge variant="soft" color="primary">
          {{ modelName }} • {{ inputSize }} • {{ fps.toFixed(0) }} FPS •
          Backend: {{ backend || (hasWebGPU ? "WebGPU" : "WASM") }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex flex-wrap gap-2 items-center">
        <UButton
          v-if="!isWebcamActive"
          label="Use Webcam"
          icon="i-lucide-camera"
          color="primary"
          :disabled="isLoading || !isModelReady"
          @click="onUseWebcam"
        />
        <UButton
          v-else
          label="Stop Webcam"
          icon="i-lucide-video-off"
          color="red"
          :disabled="isLoading"
          @click="stopStream"
        />
        <UButton
          label="Upload Image"
          icon="i-lucide-image"
          color="neutral"
          variant="soft"
          :disabled="isLoading"
          @click="onUploadClick"
        />
        <div class="ms-auto flex items-center gap-3">
          <USelect v-model="inputSize" :items="[640, 512]" size="xs" />
          <UCheckbox v-model="showLabels" label="Show labels" size="xs" />
          <UCheckbox
            v-model="showBoundingBoxes"
            label="Show boxes"
            size="xs"
            :disabled="!isModelReady"
          />
        </div>
      </div>
      <div v-if="!hasWebGPU" class="text-xs text-muted-foreground">
        WebGPU not available. Falling back to WASM for image uploads.
      </div>
      <div
        class="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md"
      >
        <strong>Note:</strong> External image URLs may be blocked by CORS. For
        best results, use the "Upload Image" button with local files.
      </div>

      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin mr-2" />
        <span class="text-sm text-muted-foreground"
          >Loading YOLO11n model...</span
        >
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      />

      <div class="relative w-full" style="aspect-ratio: 16/9">
        <canvas
          ref="canvasEl"
          class="absolute inset-0 w-full h-full rounded-md bg-black/40"
        ></canvas>
        <video ref="videoEl" playsinline class="hidden" />
      </div>

      <!-- Image Gallery for Testing -->
      <div v-if="isModelReady" class="mt-4">
        <UCard>
          <template #header>
            <h4 class="font-semibold">Test Images Gallery</h4>
            <p class="text-xs text-muted-foreground">
              Click any image to test the YOLO model
            </p>
          </template>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              v-for="(image, index) in testImages"
              :key="index"
              class="cursor-pointer group relative overflow-hidden rounded-md border-2 hover:border-primary transition-colors"
              @click="loadTestImage(image)"
            >
              <img
                :src="image.url"
                :alt="image.description"
                class="w-full h-24 object-cover group-hover:scale-105 transition-transform"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"
              ></div>
              <div
                class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center"
              >
                {{ image.description }}
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Live Detection Panel -->
      <div
        v-if="isModelReady && (isWebcamActive || showDetections)"
        class="mt-4"
      >
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold">Live Detections</h4>
                <div v-if="isWebcamActive" class="flex items-center gap-1">
                  <div
                    class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                  ></div>
                  <span class="text-xs text-muted-foreground">Processing</span>
                </div>
              </div>
              <UBadge color="primary" variant="soft">
                {{ liveDetections.length }} objects
              </UBadge>
            </div>
          </template>

          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-if="liveDetections.length === 0"
              class="text-center text-muted-foreground py-4"
            >
              <UIcon name="i-lucide-eye-off" class="mx-auto mb-2 text-2xl" />
              <p>No objects detected</p>
            </div>

            <div
              v-for="(detection, index) in liveDetections"
              :key="`${detection.label}-${index}`"
              class="flex items-center justify-between p-2 bg-default/5 rounded-md border-l-4"
              :style="{ borderLeftColor: getDetectionColor(detection.count) }"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{
                    backgroundColor: getDetectionColor(detection.count),
                  }"
                ></div>
                <div>
                  <div class="font-medium">
                    {{
                      detection.count > 1
                        ? `${detection.label} x${detection.count}`
                        : detection.label || "Unknown"
                    }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    Detected at {{ detection.timestamp }}
                  </div>
                </div>
              </div>
              <div class="text-xs text-muted-foreground">
                {{ detection.timestamp }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
