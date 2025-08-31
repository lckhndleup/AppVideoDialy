import React, { useState } from "react";
import { View, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ThumbnailImageProps {
  thumbnailUri?: string;
  fallbackIcon?: string;
  width: number;
  height: number;
  className?: string;
  showDuration?: boolean;
  duration?: number;
}

export default function ThumbnailImage({
  thumbnailUri,
  fallbackIcon = "videocam",
  width,
  height,
  className = "",
  showDuration = false,
  duration = 0
}: ThumbnailImageProps) {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}s`;
  };

  if (!thumbnailUri || imageError) {
    return (
      <View
        className={`bg-gray-200 justify-center items-center ${className}`}
        style={{ width, height }}>

        <Ionicons
          name={fallbackIcon as any}
          size={width * 0.3}
          color="#6B7280" />

        {showDuration && duration > 0 &&
        <View className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded">
            <Text className="text-white text-xs font-semibold">
              {formatDuration(duration)}
            </Text>
          </View>
        }
      </View>);

  }

  return (
    <View className={`relative ${className}`} style={{ width, height }}>
      <Image
        source={{ uri: thumbnailUri }}
        style={{ width, height }}
        className="rounded-lg"
        onError={() => setImageError(true)}
        resizeMode="cover" />


      {}
      <View className="absolute inset-0 justify-center items-center">
        <View className="bg-black/50 rounded-full p-2">
          <Ionicons name="play" size={width * 0.2} color="white" />
        </View>
      </View>

      {}
      {showDuration && duration > 0 &&
      <View className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded">
          <Text className="text-white text-xs font-semibold">
            {formatDuration(duration)}
          </Text>
        </View>
      }
    </View>);

}