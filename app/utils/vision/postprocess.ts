import type { DetectionBox } from "../../types/vision.ts";

// Simple fast NMS for YOLO-style outputs
export function nms(
  boxes: DetectionBox[],
  iouThreshold = 0.45,
): DetectionBox[] {
  boxes.sort((a, b) => b.score - a.score);
  const selected: DetectionBox[] = [];
  for (const box of boxes) {
    let keep = true;
    for (const sel of selected) {
      if (iou(box, sel) > iouThreshold) {
        keep = false;
        break;
      }
    }
    if (keep) selected.push(box);
  }
  return selected;
}

export function iou(a: DetectionBox, b: DetectionBox) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union <= 0 ? 0 : inter / union;
}

// Postprocess for YOLOv8: output is [1, N, 85] => [x,y,w,h,obj,80 class probs]
export function postprocessDetections(
  data: Float32Array,
  dims: number[],
  inputSize: number,
  withLabels: boolean,
): DetectionBox[] {
  // YOLO11n output format: [1, 300, 6] where each detection has 6 values
  // Format: [x, y, w, h, confidence, class_id]
  const n = dims[1]; // 300 detections
  const stride = dims[2]; // 6 values per detection
  const boxes: DetectionBox[] = [];

  console.log("🔍 Processing YOLO11n output:", {
    n,
    stride,
    dataLength: data.length,
  });

  // YOLO11n class names (COCO dataset)
  const classNames = [
    "person",
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat",
    "traffic light",
    "fire hydrant",
    "stop sign",
    "parking meter",
    "bench",
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "backpack",
    "umbrella",
    "handbag",
    "tie",
    "suitcase",
    "frisbee",
    "skis",
    "snowboard",
    "sports ball",
    "kite",
    "baseball bat",
    "baseball glove",
    "skateboard",
    "surfboard",
    "tennis racket",
    "bottle",
    "wine glass",
    "cup",
    "fork",
    "knife",
    "spoon",
    "bowl",
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "chair",
    "couch",
    "potted plant",
    "bed",
    "dining table",
    "toilet",
    "tv",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "microwave",
    "oven",
    "toaster",
    "sink",
    "refrigerator",
    "book",
    "clock",
    "vase",
    "scissors",
    "teddy bear",
    "hair drier",
    "toothbrush",
  ];

  for (let i = 0; i < n; i++) {
    const off = i * stride;

    // YOLO11n output format: [x, y, w, h, confidence, class_id]
    const x = data[off + 0]; // x coordinate
    const y = data[off + 1]; // y coordinate
    const w = data[off + 2]; // width
    const h = data[off + 3]; // height
    const confidence = data[off + 4]; // object confidence (0-1)
    const classId = Math.round(data[off + 5]); // class ID (0-79)

    // Check if this detection is valid
    if (confidence < 0.5 || classId < 0 || classId >= 80) continue;

    // Get the class label
    let label: string | undefined = undefined;
    if (withLabels && classId >= 0 && classId < classNames.length) {
      label = classNames[classId];
    } else if (classId >= 0) {
      label = `class_${classId}`;
    }

    console.log("📦 Detection:", {
      label,
      classId,
      confidence: confidence.toFixed(3),
      coords: {
        x: x.toFixed(1),
        y: y.toFixed(1),
        w: w.toFixed(1),
        h: h.toFixed(1),
      },
    });

    boxes.push({
      x: x,
      y: y,
      w: w,
      h: h,
      score: confidence,
      label: label,
    });
  }
  return nms(boxes, 0.45).map((b) => ({ ...b }));
}
