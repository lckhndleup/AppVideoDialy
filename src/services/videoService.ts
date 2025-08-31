import * as FileSystem from "expo-file-system";
import { VideoItem, CropData, VideoMetadata } from "@/src/types";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as MediaLibrary from "expo-media-library";
import {
  ProcessVideoParamsSchema,
  validateForm } from
"@/src/utils/validations";

export interface ProcessVideoParams {
  videoUri: string;
  cropData: CropData;
  metadata: VideoMetadata;
}

export interface ProcessVideoResult {
  success: boolean;
  videoItem?: VideoItem;
  error?: string;
}


export const processVideo = async ({
  videoUri,
  cropData,
  metadata
}: ProcessVideoParams): Promise<ProcessVideoResult> => {
  try {

    const validation = validateForm(ProcessVideoParamsSchema, {
      videoUri,
      cropData,
      metadata
    });

    if (!validation.success) {
      return {
        success: false,
        error: Object.values(validation.errors).join(", ")
      };
    }

    console.log("Starting video processing...", {
      videoUri: videoUri.substring(0, 50) + "...",
      cropData,
      metadata
    });


    const timestamp = Date.now();
    const outputFileName = `cropped_video_${timestamp}.mp4`;



    const outputPath = `${FileSystem.documentDirectory}${outputFileName}`;

    console.log("Copying video file...");
    await FileSystem.copyAsync({
      from: videoUri,
      to: outputPath
    });


    console.log("Generating thumbnail...");
    const thumbnailFileName = `thumb_${timestamp}.jpg`;
    const thumbnailPath = `${FileSystem.documentDirectory}${thumbnailFileName}`;

    let thumbnailUri: string | undefined;
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(outputPath, {
        time: cropData.startTime * 1000,
        quality: 0.7
      });


      await FileSystem.copyAsync({
        from: uri,
        to: thumbnailPath
      });

      thumbnailUri = thumbnailPath;
    } catch (thumbnailError) {
      console.warn("Thumbnail generation failed:", thumbnailError);

    }


    const fileInfo = await FileSystem.getInfoAsync(outputPath);
    if (!fileInfo.exists) {
      throw new Error("Output video file was not created");
    }


    const videoItem: VideoItem = {
      id: `video_${timestamp}`,
      name: metadata.name,
      description: metadata.description || "",
      videoUri: outputPath,
      thumbnailUri,
      duration: cropData.duration,
      createdAt: new Date(),
      cropInfo: {
        startTime: cropData.startTime,
        endTime: cropData.endTime,
        duration: cropData.duration
      }
    };

    console.log("Video processing completed successfully");


    console.log(
      "🎬 DEMO MODE: Video was copied instead of trimmed. In production, use FFmpeg for actual video trimming."
    );

    return {
      success: true,
      videoItem
    };
  } catch (error) {
    console.error("Video processing error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

export const deleteVideoFiles = async (videoItem: VideoItem) => {
  try {

    if (videoItem.videoUri) {
      const videoInfo = await FileSystem.getInfoAsync(videoItem.videoUri);
      if (videoInfo.exists) {
        await FileSystem.deleteAsync(videoItem.videoUri);
        console.log("Deleted video file:", videoItem.videoUri);
      }
    }


    if (videoItem.thumbnailUri) {
      const thumbInfo = await FileSystem.getInfoAsync(videoItem.thumbnailUri);
      if (thumbInfo.exists) {
        await FileSystem.deleteAsync(videoItem.thumbnailUri);
        console.log("Deleted thumbnail file:", videoItem.thumbnailUri);
      }
    }
  } catch (error) {
    console.error("Error deleting video files:", error);
  }
};


export const trimVideoWithFFmpeg = async (params: ProcessVideoParams) => {

  console.log("FFmpeg trimming not implemented yet");
  throw new Error("FFmpeg trimming not implemented yet");
};