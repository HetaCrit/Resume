// deno-lint-ignore-file
// @ts-nocheck
// yolo.worker.ts
import type { WorkerRequest, WorkerResponse } from "../types/vision.ts";
import { postprocessDetections } from "../utils/vision/postprocess.ts";

let ort: any = null;
let session: any = null;
let backend: "webgpu" | "wasm" = "wasm";
let inputSize = 640;
let isProcessing = false; // Track if we're currently processing a frame
let latestFrameId = 0; // Track frame order to prevent processing old frames

async function initOrt() {
  if (ort) return ort;
  const m = await import("https://esm.sh/onnxruntime-web@1.19.0");
  // Ensure WASM assets resolve when WebGPU is unavailable
  try {
    if (m?.env?.wasm) {
      m.env.wasm.wasmPaths =
        "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/";
    }
  } catch (_) {
    // no-op
  }
  ort = m;
  return m;
}

async function initSession() {
  const m = await initOrt();
  console.log("Initializing ONNX session...");

  // Try WebGPU first
  try {
    console.log("Fetching model file...");
    const response = await fetch("/models/yolo11n.onnx");
    console.log("Model response status:", response.status);
    const bytes = await response.arrayBuffer();
    console.log("Model file size:", bytes.byteLength, "bytes");

    console.log("Creating session with WebGPU...");
    session = await m.InferenceSession.create(new Uint8Array(bytes), {
      executionProviders: ["webgpu", "wasm"],
    });
    backend = typeof (self as any).navigator?.gpu !== "undefined"
      ? "webgpu"
      : "wasm";
    console.log("Session created successfully with backend:", backend);
  } catch (e) {
    console.log("WebGPU failed, trying WASM only:", e);
    try {
      const bytes = await (await fetch("/models/yolo11n.onnx")).arrayBuffer();
      console.log("Creating session with WASM only...");
      session = await m.InferenceSession.create(new Uint8Array(bytes), {
        executionProviders: ["wasm"],
      });
      backend = "wasm";
      console.log("Session created successfully with WASM backend");
    } catch (e2) {
      console.error("Failed to create session:", e2);
      throw e2;
    }
  }
}

(self as any).onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  const data = ev.data;
  if (data.type === "init") {
    inputSize = data.inputSize ?? 640;
    await initSession();
    const resp: WorkerResponse = { type: "ready", backend };
    (self as any).postMessage(resp);
    return;
  }
  if (data.type === "stop") {
    // Stop any ongoing inference
    console.log("🛑 Worker received stop message, halting inference");
    return;
  }
  if (data.type === "infer") {
    try {
      if (!session || !ort) await initSession();

      // Frame buffering: only process if we're not already processing and this is a newer frame
      const frameId = Date.now();
      if (isProcessing || frameId < latestFrameId) {
        console.log("⏭️ Skipping frame - already processing or frame too old");
        return;
      }

      isProcessing = true;
      latestFrameId = frameId;

      const imageBitmap = data.image as ImageBitmap;

      // Preprocess: resize and normalize to [1,3,input,input]
      const Offscreen = (self as any).OffscreenCanvas;
      const off = new Offscreen(inputSize, inputSize);
      const ctx = off.getContext("2d")!;
      ctx.drawImage(imageBitmap, 0, 0, inputSize, inputSize);
      const img = ctx.getImageData(0, 0, inputSize, inputSize);
      const { input, width, height } = toTensor(img);

      const feeds: Record<string, any> = {};
      const inputName = session!.inputNames[0];
      feeds[inputName] = input;

      const results = await session!.run(feeds);
      const outputName = session!.outputNames[0];
      const output = results[outputName];

      // Debug: Show raw model output to understand coordinate format
      // Only log occasionally to reduce performance impact
      if (Math.random() < 0.1) { // Log only 10% of the time
        console.log("🔍 Raw YOLO11n output (first 20 values):", {
          first20: Array.from(output.data.slice(0, 20)),
          dims: output.dims,
          totalLength: output.data.length,
        });
      }

      let boxes = postprocessDetections(
        output.data as Float32Array,
        output.dims!,
        data.inputSize,
        data.showLabels ?? true,
      );

      // Only log when detections change significantly
      if (boxes.length > 0) {
        console.log("🎯 Detected boxes:", boxes.length);
      }

      // No need to scale again - postprocessDetections already scales to inputSize
      // The coordinates are now in the correct scale for the inputSize
      const resp: WorkerResponse = {
        type: "result",
        boxes,
        dimensions: { width: imageBitmap.width, height: imageBitmap.height },
      };
      (self as any).postMessage(resp);

      // Reset processing flag to allow next frame
      isProcessing = false;
    } catch (e: any) {
      const resp: WorkerResponse = {
        type: "error",
        message: e?.message ?? String(e),
      };
      (self as any).postMessage(resp);

      // Reset processing flag on error too
      isProcessing = false;
    }
  }
};

function toTensor(img: ImageData) {
  const { data, width, height } = img;
  const size = width * height;
  const float = new Float32Array(size * 3); // Changed from Float16Array to Float32Array
  // HWC -> CHW, normalize to 0..1
  for (let i = 0; i < size; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    float[i] = r;
    float[i + size] = g;
    float[i + size * 2] = b;
  }
  const tensor = new (ort as any).Tensor("float32", float, [ // Changed from "float" to "float32"
    1,
    3,
    height,
    width,
  ]);
  return { input: tensor, width, height };
}
