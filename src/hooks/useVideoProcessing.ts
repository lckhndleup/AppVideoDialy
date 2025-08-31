import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processVideo, ProcessVideoParams } from "@/src/services/videoService";
import { useVideoStore } from "@/src/store/videoStore";

export const useVideoProcessing = () => {
  const queryClient = useQueryClient();
  const { addVideo } = useVideoStore();

  const mutation = useMutation({
    mutationFn: processVideo,
    onSuccess: (result) => {
      if (result.success && result.videoItem) {

        addVideo(result.videoItem);


        queryClient.invalidateQueries({ queryKey: ["videos"] });

        console.log("Video added to store successfully");
      }
    },
    onError: (error) => {
      console.error("Video processing mutation error:", error);
    }
  });

  return {
    processVideo: mutation.mutateAsync,
    isProcessing: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset
  };
};