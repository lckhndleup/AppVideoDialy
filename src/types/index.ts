export * from "../schemas/videoSchemas";


export { VideoItemType as VideoItem } from "../schemas/videoSchemas";

export interface CropData {
  startTime: number;
  endTime: number;
  duration: number;
}

export interface VideoMetadata {
  name: string;
  description: string;
}


export type CropModalStep = "select" | "crop" | "metadata";

export interface CropModalState {
  isVisible: boolean;
  currentStep: CropModalStep;
  selectedVideoUri?: string;
  cropData?: CropData;
  metadata?: VideoMetadata;
}