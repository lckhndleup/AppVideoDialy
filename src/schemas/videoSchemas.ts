import { z } from "zod";

export const VideoMetadataSchema = z.object({
  name: z.
  string().
  min(1, "Video adı gereklidir").
  max(50, "Video adı 50 karakterden uzun olamaz").
  trim(),
  description: z.
  string().
  max(200, "Açıklama 200 karakterden uzun olamaz").
  trim().
  optional()
});

export const CropDataSchema = z.
object({
  startTime: z.number().min(0, "Başlama zamanı negatif olamaz"),
  endTime: z.number().min(0, "Bitiş zamanı negatif olamaz"),
  duration: z.
  number().
  min(0.1, "Video süresi en az 0.1 saniye olmalıdır").
  max(5, "Video süresi en fazla 5 saniye olabilir")
}).
refine((data) => data.endTime > data.startTime, {
  message: "Bitiş zamanı başlama zamanından büyük olmalıdır",
  path: ["endTime"]
});

export const CropInfoSchema = z.object({
  startTime: z.number().min(0),
  endTime: z.number().min(0),
  duration: z.number().positive()
});

export const VideoItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  videoUri: z.string(),
  thumbnailUri: z.string().optional(),
  duration: z.number().positive(),

  startTime: z.number().min(0).optional(),
  endTime: z.number().min(0).optional(),
  originalDuration: z.number().positive().optional(),
  cropInfo: CropInfoSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional()
});

export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;
export type CropData = z.infer<typeof CropDataSchema>;
export type CropInfo = z.infer<typeof CropInfoSchema>;
export type VideoItemType = z.infer<typeof VideoItemSchema>;