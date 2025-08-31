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





export const VideoItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Video adı gereklidir"),
  description: z.string(),
  videoUri: z.string(),
  thumbnailUri: z.string().optional(),
  duration: z.number().positive("Süre pozitif bir değer olmalıdır"),
  createdAt: z.date(),
  updatedAt: z.date().optional()
});




export const SearchQuerySchema = z.object({
  query: z.string().trim().min(1, "Arama sorgusu en az 1 karakter olmalıdır")
});




export const ProcessVideoParamsSchema = z.object({
  videoUri: z.string(),
  cropData: CropDataSchema,
  metadata: VideoMetadataSchema
});


export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;
export type CropData = z.infer<typeof CropDataSchema>;
export type VideoItem = z.infer<typeof VideoItemSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ProcessVideoParams = z.infer<typeof ProcessVideoParamsSchema>;







export const validateForm = <T extends z.ZodType,>(schema: T, data: unknown) => {
  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") || "undefined";
        errors[path] = issue.message;
      });

      return {
        success: false,
        errors,
        data: null
      };
    }

    return {
      success: true,
      errors: {},
      data: result.data
    };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      success: false,
      errors: { general: "Doğrulama hatası oluştu" },
      data: null
    };
  }
};