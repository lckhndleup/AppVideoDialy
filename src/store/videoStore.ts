import { create } from "zustand";
import { VideoItem } from "../types";
import { videoDatabase } from "../database/videoDatabase";

interface VideoStore {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;


  loadVideos: () => Promise<void>;
  addVideo: (video: VideoItem) => Promise<void>;
  updateVideo: (id: string, updates: Partial<VideoItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getVideoById: (id: string) => VideoItem | undefined;
  searchVideos: (query: string) => Promise<VideoItem[]>;
  clearAllVideos: () => Promise<void>;


  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  isLoading: false,
  error: null,

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  loadVideos: async () => {
    try {
      set({ isLoading: true, error: null });
      const videos = await videoDatabase.getAllVideos();
      set({ videos, isLoading: false });
    } catch (error) {
      console.error("Load videos error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to load videos",
        isLoading: false
      });
    }
  },

  addVideo: async (video: VideoItem) => {
    try {
      set({ isLoading: true, error: null });


      await videoDatabase.insertVideo(video);


      set((state) => ({
        videos: [video, ...state.videos],
        isLoading: false
      }));

      console.log("Video added successfully to store and database");
    } catch (error) {
      console.error("Add video error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to add video",
        isLoading: false
      });
      throw error;
    }
  },

  updateVideo: async (id: string, updates: Partial<VideoItem>) => {
    try {
      set({ isLoading: true, error: null });


      const updatedData = {
        ...updates,
        updatedAt: new Date()
      };


      await videoDatabase.updateVideo(id, updatedData);


      set((state) => ({
        videos: state.videos.map((video) =>
        video.id === id ? { ...video, ...updatedData } : video
        ),
        isLoading: false
      }));

      console.log("Video updated successfully");
    } catch (error) {
      console.error("Update video error:", error);
      set({
        error:
        error instanceof Error ? error.message : "Failed to update video",
        isLoading: false
      });
      throw error;
    }
  },

  deleteVideo: async (id: string) => {
    try {
      set({ isLoading: true, error: null });


      await videoDatabase.deleteVideo(id);


      set((state) => ({
        videos: state.videos.filter((video) => video.id !== id),
        isLoading: false
      }));

      console.log("Video deleted successfully");
    } catch (error) {
      console.error("Delete video error:", error);
      set({
        error:
        error instanceof Error ? error.message : "Failed to delete video",
        isLoading: false
      });
      throw error;
    }
  },

  getVideoById: (id: string) => {
    return get().videos.find((video) => video.id === id);
  },

  searchVideos: async (query: string) => {
    try {
      set({ error: null });
      const results = await videoDatabase.searchVideos(query);
      return results;
    } catch (error) {
      console.error("Search videos error:", error);
      set({
        error: error instanceof Error ? error.message : "Search failed"
      });
      return [];
    }
  },

  clearAllVideos: async () => {
    try {
      set({ isLoading: true, error: null });


      await videoDatabase.clearAllVideos();


      set({ videos: [], isLoading: false });

      console.log("All videos cleared");
    } catch (error) {
      console.error("Clear all videos error:", error);
      set({
        error:
        error instanceof Error ? error.message : "Failed to clear videos",
        isLoading: false
      });
      throw error;
    }
  }
}));