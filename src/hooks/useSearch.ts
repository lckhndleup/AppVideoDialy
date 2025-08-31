import { useState, useEffect, useMemo } from "react";
import { useVideoStore } from "@/src/store/videoStore";
import { VideoItem } from "@/src/types";

export const useSearch = () => {
  const { videos, searchVideos } = useVideoStore();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);


  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {

        const results = await searchVideos(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);

        const localResults = videos.filter(
          (video) =>
          video.name.toLowerCase().includes(query.toLowerCase()) ||
          video.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(localResults);
        setShowSearchResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchVideos, videos]);

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const displayData = showSearchResults ? searchResults : videos;

  const searchStats = useMemo(() => {
    if (!showSearchResults) return null;

    return {
      total: searchResults.length,
      totalDuration: searchResults.reduce(
        (sum, video) => sum + video.duration,
        0
      )
    };
  }, [searchResults, showSearchResults]);

  return {
    query,
    setQuery,
    isSearching,
    searchResults,
    showSearchResults,
    displayData,
    searchStats,
    clearSearch
  };
};