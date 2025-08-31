import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { CropInfo } from "../schemas/videoSchemas";

const { width } = Dimensions.get("window");

interface VideoPlayerProps {
  videoUri: string;
  thumbnailUri?: string;
  aspectRatio?: number;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
  cropInfo?: CropInfo;
}

export default function VideoPlayer({
  videoUri,
  thumbnailUri,
  aspectRatio = 16 / 9,
  showControls = true,
  autoPlay = false,
  loop = false,
  className = "",
  cropInfo
}: VideoPlayerProps) {
  const videoRef = useRef<VideoView>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const initialPlaybackStarted = useRef(false);


  const playerInitialized = useRef(false);


  const player = useVideoPlayer({ uri: videoUri }, (player) => {
    player.loop = loop;




    if (autoPlay) {

      playerInitialized.current = true;
    }
  });


  useEffect(() => {
    if (
    player.status === "readyToPlay" &&
    cropInfo &&
    !initialPlaybackStarted.current)
    {
      console.log(
        "Video hazır, başlangıç konumunu ayarlıyorum:",
        cropInfo.startTime
      );

      setTimeout(() => {
        player.currentTime = cropInfo.startTime;
        initialPlaybackStarted.current = true;


        if (playerInitialized.current) {
          player.play();
        }
      }, 100);
    }
  }, [player.status, cropInfo]);


  useEffect(() => {

    const statusInterval = setInterval(() => {
      const isPlayerReady = player.status === "readyToPlay";

      setIsLoaded(isPlayerReady);
      setIsPlaying(player.playing);

      const currentPosition = player.currentTime * 1000;
      setPosition(currentPosition);

      if (player.duration) {
        setDuration(player.duration * 1000);
      }


      if (cropInfo && isPlayerReady) {

        if (player.currentTime > cropInfo.endTime) {
          if (loop) {
            player.currentTime = cropInfo.startTime;
          } else {
            player.pause();
          }
        }
      }
    }, 100);

    return () => {
      clearInterval(statusInterval);
    };
  }, [player, cropInfo, loop]);

  const handlePlayPause = async () => {
    if (!isLoaded) return;

    try {
      if (isPlaying) {
        player.pause();
      } else {

        if (cropInfo) {

          console.log("Oynatma başlangıcı ayarlanıyor:", cropInfo.startTime);
          player.currentTime = cropInfo.startTime;
        }
        player.play();
      }
    } catch (error) {
      console.error("Play/pause error:", error);
    }
  };

  const handleSeek = async (seekPosition: number) => {
    if (!isLoaded) return;

    try {

      if (cropInfo) {
        const seekSeconds = seekPosition / 1000;

        const limitedSeekPosition = Math.max(
          cropInfo.startTime,
          Math.min(cropInfo.endTime, seekSeconds)
        );
        player.currentTime = limitedSeekPosition;
      } else {
        player.currentTime = seekPosition / 1000;
      }
    } catch (error) {
      console.error("Seek error:", error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const videoHeight = width / aspectRatio;

  return (
    <View className={`relative ${className}`}>
      <VideoView
        ref={videoRef}
        player={player}
        style={{
          width: "100%",
          height: videoHeight,
          backgroundColor: "#000"
        }}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={false} />


      {}
      {!isLoaded &&
      <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <View className="bg-white/10 rounded-full p-3">
            <Ionicons name="hourglass" size={24} color="white" />
          </View>
          <Text className="text-white text-sm mt-2">Video yükleniyor...</Text>
        </View>
      }

      {}
      {showControls && isLoaded &&
      <TouchableOpacity
        className="absolute inset-0"
        activeOpacity={0.9}
        onPress={() => setIsControlsVisible(!isControlsVisible)}>

          {isControlsVisible &&
        <View className="absolute inset-0 bg-black/30">
              {}
              <View className="flex-1 justify-center items-center">
                <TouchableOpacity
              className="bg-black/50 rounded-full p-4"
              onPress={handlePlayPause}>

                  <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="white" />

                </TouchableOpacity>
              </View>

              {}
              <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <View className="flex-row items-center space-x-3">
                  <Text className="text-white text-sm">
                    {cropInfo ?
                formatTime(
                  cropInfo.startTime * 1000 +
                  Math.max(0, position - cropInfo.startTime * 1000)
                ) :
                formatTime(position)}
                  </Text>

                  {}
                  <View className="flex-1 h-2 bg-white/30 rounded-full">
                    <View
                  className="h-2 bg-white rounded-full"
                  style={{
                    width: `${
                    cropInfo && duration > 0 ?
                    Math.max(
                      0,
                      Math.min(
                        100,
                        (player.currentTime - cropInfo.startTime) /
                        cropInfo.duration *
                        100
                      )
                    ) :
                    duration > 0 ?
                    position / duration * 100 :
                    0}%`

                  }} />

                  </View>

                  <Text className="text-white text-sm">
                    {
                cropInfo ?
                formatTime(cropInfo.endTime * 1000) :
                formatTime(duration)
                }
                  </Text>
                </View>
              </View>
            </View>
        }
        </TouchableOpacity>
      }
    </View>);

}