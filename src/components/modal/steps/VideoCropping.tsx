









































































































































































































































































































































































































































































































































import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  PanResponder } from
"react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { CropData } from "@/src/types";

const { width } = Dimensions.get("window");
const videoHeight = width * (9 / 16);
const contentWidth = width - 16;
const timelineWidth = contentWidth;
const timelineHeight = 60;

interface VideoCroppingProps {
  videoUri: string;
  onCropComplete: (cropData: CropData) => void;
  onBack: () => void;
}

export default function VideoCropping({
  videoUri,
  onCropComplete,
  onBack
}: VideoCroppingProps) {
  const videoRef = useRef<VideoView>(null);
  const player = useVideoPlayer({ uri: videoUri }, (p) => {
    p.loop = false;
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const formatMMSS = (sec: number): string => {
    const total = Math.max(0, Math.floor(sec));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const i = setInterval(() => {
      const loaded =
      player.status !== "idle" &&
      player.status !== "loading" &&
      player.status !== "error";
      setIsLoaded(loaded);
      if (loaded && player.duration && duration === 0) {
        setDuration(player.duration);
      }
    }, 150);
    return () => clearInterval(i);
  }, [player, duration]);

  const maxStartTime = duration > 5 ? duration - 5 : 0;
  const endTime = startTime + 5;
  const isValidTrim =
  duration >= 5 && startTime >= 0 && startTime <= maxStartTime;

  useEffect(() => {
    if (!duration) {
      setError(null);
      return;
    }
    if (duration < 5) {
      setError("Video süresi 5 saniyeden kısa. Kesim yapılamaz.");
      return;
    }
    setError(null);
  }, [duration]);


  const getPositionFromTime = (time: number): number => {
    if (duration === 0) return 0;
    return time / duration * timelineWidth;
  };

  const getTimeFromPosition = (position: number): number => {
    const time = position / timelineWidth * duration;
    return Math.max(0, Math.min(time, maxStartTime));
  };


  const getTickInterval = (duration: number): number => {
    if (duration <= 30) return 1;
    if (duration <= 120) return 5;
    if (duration <= 600) return 10;
    if (duration <= 1800) return 30;
    return 60;
  };


  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const containerX = gestureState.moveX - 32;
      const timelineX = containerX - 16;
      const newPosition = Math.max(0, Math.min(timelineX, timelineWidth));
      const newTime = getTimeFromPosition(newPosition);
      setStartTime(newTime);
    },
    onPanResponderRelease: () => {}
  });

  const handleConfirm = () => {
    if (!isValidTrim) return;
    const crop: CropData = {
      startTime: startTime,
      endTime: endTime,
      duration: 5
    };
    onCropComplete(crop);
  };

  const renderTimeline = () => {
    if (duration === 0) return null;

    const tickInterval = getTickInterval(duration);
    const tickCount = Math.floor(duration / tickInterval);
    const ticks = Array.from(
      { length: tickCount + 1 },
      (_, i) => i * tickInterval
    );

    const startPosition = getPositionFromTime(startTime);
    const endPosition = getPositionFromTime(endTime);

    return (
      <View className="px-2 mt-4">
        <Text className="text-white font-semibold mb-3">Video Timeline</Text>

        {}
        <View
          className="relative bg-[#404040] rounded-lg overflow-hidden"
          style={{
            height: timelineHeight,
            width: timelineWidth
          }}>

          {}
          {ticks.map((tick) => {
            const tickPosition = tick / duration * timelineWidth;
            const isMainTick = tick % (tickInterval * 2) === 0 || tick === 0;

            return (
              <View
                key={tick}
                className="absolute top-0 bottom-0 justify-center"
                style={{
                  left: tickPosition,
                  width: 2
                }}>

                <View
                  className="bg-[#666666] w-0.5 self-center"
                  style={{
                    height: isMainTick ?
                    timelineHeight * 0.6 :
                    timelineHeight * 0.3
                  }} />

                {isMainTick &&
                <Text
                  className="text-[#CCCCCC] text-[10px] absolute self-center"
                  style={{
                    top: timelineHeight + 4,
                    textAlign: "center",
                    fontSize: 9
                  }}>

                    {tick >= 60 ? `${Math.floor(tick / 60)}m` : `${tick}s`}
                  </Text>
                }
              </View>);

          })}

          {}
          <View
            className="absolute top-1 bottom-1 bg-[#B5BE6450] border border-[#B5BE64] rounded-sm"
            style={{
              left: startPosition,
              width: Math.min(
                endPosition - startPosition,
                timelineWidth - startPosition
              )
            }} />


          {}
          <View
            className="absolute top-0 bottom-0 justify-center"
            style={{
              left: Math.max(
                0,
                Math.min(startPosition - 10, timelineWidth - 20)
              )
            }}
            {...panResponder.panHandlers}>

            <View className="bg-[#B5BE64] w-5 h-8 rounded-md justify-center items-center">
              <View className="bg-[#0B0B0B] w-0.5 h-3 rounded-full" />
            </View>
          </View>

          {}
          <View
            className="absolute top-0 bottom-0 justify-center"
            style={{
              left: Math.max(0, Math.min(endPosition - 10, timelineWidth - 20)),
              opacity: endTime <= duration ? 1 : 0.5
            }}>

            <View className="bg-[#EF4444] w-5 h-8 rounded-md justify-center items-center">
              <View className="bg-white w-0.5 h-3 rounded-full" />
            </View>
          </View>
        </View>

        {}
        <View className="flex-row justify-between mt-8">
          <View className="items-center">
            <View className="bg-[#B5BE64] px-2 py-1 rounded-md mb-1">
              <Text className="text-[#0B0B0B] text-xs font-bold">
                {formatMMSS(startTime)}
              </Text>
            </View>
            <Text className="text-[#888888] text-xs">Başlangıç</Text>
          </View>

          <View className="items-center">
            <View className="bg-[#EF4444] px-2 py-1 rounded-md mb-1">
              <Text className="text-white text-xs font-bold">
                {formatMMSS(Math.min(endTime, duration))}
              </Text>
            </View>
            <Text className="text-[#888888] text-xs">Bitiş</Text>
          </View>
        </View>
      </View>);

  };

  const renderTrimInfo = () => {
    if (!isValidTrim) return null;

    return (
      <View className="px-2 mt-4">
        <Text className="text-white font-semibold mb-3">Trim Bilgileri</Text>

        <View className="bg-[#121212] rounded-2xl p-4 border border-[#242424] space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-[#C3C3C3] text-sm">Başlangıç:</Text>
            <Text className="text-[#B5BE64] text-sm font-semibold">
              {formatMMSS(startTime)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-[#C3C3C3] text-sm">Bitiş:</Text>
            <Text className="text-[#EF4444] text-sm font-semibold">
              {formatMMSS(Math.min(endTime, duration))}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-[#C3C3C3] text-sm">Kesim Süresi:</Text>
            <Text className="text-white text-sm font-semibold">
              {Math.min(5, duration - startTime).toFixed(1)}s
            </Text>
          </View>

          {}
          <View className="mt-2 bg-[#0B0B0B] rounded-xl p-3 border border-[#B5BE64]">
            <View className="flex-row items-center">
              <View className="bg-[#B5BE64] w-3 h-3 rounded-full mr-2" />
              <Text className="text-[#B5BE64] text-sm font-semibold">
                {formatMMSS(startTime)} -{" "}
                {formatMMSS(Math.min(endTime, duration))} arası kesilecek
              </Text>
            </View>
          </View>
        </View>
      </View>);

  };

  return (
    <ScrollView className="flex-1 bg-[#0B0B0B] px-2">
      <View
        className="mt-4 relative rounded-2xl overflow-hidden border border-[#242424]"
        style={{ height: videoHeight }}>

        <VideoView
          ref={videoRef}
          style={{ flex: 1, backgroundColor: "#000" }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain" />

      </View>

      {}
      {renderTimeline()}

      {}
      {renderTrimInfo()}

      {}
      <View className="px-2 mt-4 bg-[#121212] rounded-2xl p-4 border border-[#242424]">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#C3C3C3]">Video Süresi:</Text>
          <Text className="text-white font-semibold">
            {duration ? formatMMSS(duration) : "yükleniyor..."}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-[#C3C3C3]">Maksimum Başlangıç:</Text>
          <Text className="text-white font-semibold">
            {duration ? formatMMSS(maxStartTime) : "-"}
          </Text>
        </View>
      </View>

      {}
      {!!error &&
      <View className="px-2 mt-4 bg-[#EF444420] rounded-xl p-3 border border-[#EF4444]">
          <Text className="text-[#EF4444] text-sm">{error}</Text>
        </View>
      }

      {}
      <View className="mb-6 mt-4 px-2 flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 py-3.5 bg-[#121212] rounded-xl border border-[#242424]"
          onPress={onBack}>

          <Text className="text-center font-semibold text-[#C3C3C3]">Geri</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3.5 rounded-xl ${
          isValidTrim ?
          "bg-[#121212] border border-[#B5BE64]" :
          "bg-[#242424] border border-[#242424]"}`
          }
          onPress={handleConfirm}
          disabled={!isValidTrim}>

          <Text
            className={`text-center font-semibold ${
            isValidTrim ? "text-[#B5BE64]" : "text-[#C3C3C3]"}`
            }>

            Devam
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>);

}