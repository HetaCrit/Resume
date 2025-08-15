export type DetectionBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
  label?: string;
};

export type LiveDetection = {
  label: string;
  score: number;
  timestamp: string;
  count: number;
};

export type WorkerInit = {
  type: "init";
  inputSize: number;
};

export type WorkerInfer = {
  type: "infer";
  image: ImageBitmap | unknown;
  inputSize: number;
  showLabels: boolean;
};

export type WorkerRequest = WorkerInit | WorkerInfer;

export type WorkerReady = {
  type: "ready";
  backend: "webgpu" | "wasm";
};

export type WorkerError = {
  type: "error";
  message: string;
};

export type WorkerResult = {
  type: "result";
  boxes: DetectionBox[];
  dimensions: { width: number; height: number };
};

export type WorkerResponse = WorkerReady | WorkerError | WorkerResult;
