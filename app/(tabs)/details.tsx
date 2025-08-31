import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform } from
"react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVideoStore } from "@/src/store/videoStore";
import { Ionicons } from "@expo/vector-icons";
import VideoPlayer from "@/src/components/VideoPlayer";
import { deleteVideoFiles } from "@/src/services/videoService";
import CustomModal from "@/src/components/common/CustomModal";

export default function DetailsScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{videoId: string;}>();
  const { getVideoById, deleteVideo } = useVideoStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const video = videoId ? getVideoById(videoId) : null;

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0B0B] justify-center items-center">
        <View className="bg-[#121212] rounded-2xl p-8 mx-6 items-center border border-[#242424]">
          <View className="bg-[#EF444420] w-16 h-16 rounded-full justify-center items-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-white mb-2 text-center">
            Video Bulunamadı
          </Text>
          <Text className="text-[#C3C3C3] text-center mb-6">
            Aradığınız video mevcut değil veya silinmiş olabilir.
          </Text>
          <TouchableOpacity
            className="bg-[#B5BE64] px-6 py-3 rounded-lg"
            onPress={() => router.back()}>

            <Text className="text-[#0B0B0B] font-semibold">
              Ana Sayfaya Dön
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const handleEdit = () => {
    router.push({
      pathname: "/edit",
      params: { videoId }
    });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${video.name}\n\n${
        video.description || "Video günlüğümden bir anı"}`,

        url: video.videoUri,
        title: video.name
      });

      if (result.action === Share.sharedAction) {
        console.log("Video shared successfully");
      }
    } catch (error) {
      console.error("Share error:", error);
      setErrorMessage("Paylaşım sırasında bir hata oluştu");
      setErrorModalVisible(true);
    }
  };

  const handleDelete = () => {

    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteModalVisible(false);


      await deleteVideoFiles(video);


      deleteVideo(videoId!);


      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Delete error:", error);
      setIsDeleting(false);

      setErrorMessage("Video silinirken bir hata oluştu");
      setErrorModalVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0B]">
      {}
      <CustomModal
        visible={deleteModalVisible}
        type="confirm"
        title="Videoyu Sil"
        message={`"${
        video?.name || ""}" videosunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
        }
        iconName="trash"
        color="#EF4444"
        primaryButton={{
          text: "Evet, Sil",
          onPress: confirmDelete,
          color: "#EF4444"
        }}
        secondaryButton={{
          text: "Vazgeç",
          onPress: () => setDeleteModalVisible(false)
        }} />


      {}
      <CustomModal
        visible={successModalVisible}
        type="success"
        title="Başarılı"
        message="Video başarıyla silindi."
        iconName="checkmark-circle"
        primaryButton={{
          text: "Tamam",
          onPress: () => {
            setSuccessModalVisible(false);
            router.back();
          }
        }} />


      {}
      <CustomModal
        visible={errorModalVisible}
        type="error"
        title="Hata"
        message={errorMessage}
        iconName="close-circle"
        primaryButton={{
          text: "Tamam",
          onPress: () => setErrorModalVisible(false)
        }} />


      {}
      <View className="flex-row items-center justify-between px-2 py-4 bg-[#0B0B0B]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 z-10">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white absolute left-0 right-0 text-center">
          Video Detayı
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {}
        <View className="mx-2 mt-4 relative">
          <VideoPlayer
            videoUri={video.videoUri}
            thumbnailUri={video.thumbnailUri}
            aspectRatio={16 / 9}
            showControls={true}
            className="rounded-2xl overflow-hidden"
            cropInfo={video.cropInfo} />


          {}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
            <TouchableOpacity
              className="bg-black/40 backdrop-blur p-2.5 rounded-lg items-center justify-center"
              onPress={handleEdit}
              disabled={isDeleting}>

              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-black/40 backdrop-blur p-2.5 rounded-lg items-center justify-center"
              onPress={handleShare}
              disabled={isDeleting}>

              <Ionicons name="share-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {}
        <View className="mx-2 mt-4 bg-[#121212] rounded-2xl border border-[#242424] p-4">
          <Text className="text-xl font-bold text-white mb-2">
            {video.name}
          </Text>
          {video.description &&
          <Text className="text-[#C3C3C3] text-[15px] leading-5">
              {video.description}
            </Text>
          }
          {!video.description &&
          <Text className="text-[#C3C3C3] text-[15px] leading-5">
              Açıklama eklenmemiş
            </Text>
          }
        </View>

        {}
        <View className="mx-2 mt-4 flex-row justify-between">
          {}
          <View className="flex-1 bg-[#121212] rounded-2xl border border-[#242424] p-3 items-center mx-1">
            <View className="bg-[#B5BE6420] w-8 h-8 rounded-full justify-center items-center mb-2">
              <Ionicons name="time" size={16} color="#B5BE64" />
            </View>
            <Text className="text-[#C3C3C3] text-xs font-medium mb-1">
              SÜRE
            </Text>
            <Text className="text-white font-bold text-sm">
              {video.duration.toFixed(1)}s
            </Text>
          </View>

          {}
          <View className="flex-1 bg-[#121212] rounded-2xl border border-[#242424] p-3 items-center mx-1">
            <View className="bg-[#22C55E20] w-8 h-8 rounded-full justify-center items-center mb-2">
              <Ionicons name="calendar" size={16} color="#22C55E" />
            </View>
            <Text className="text-[#C3C3C3] text-xs font-medium mb-1">
              TARİH
            </Text>
            <Text className="text-white font-bold text-sm text-center">
              {new Date(video.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short"
              })}
            </Text>
          </View>

          {}
          <View className="flex-1 bg-[#121212] rounded-2xl border border-[#242424] p-3 items-center mx-1">
            <View className="bg-[#8B5CF620] w-8 h-8 rounded-full justify-center items-center mb-2">
              <Ionicons name="videocam" size={16} color="#8B5CF6" />
            </View>
            <Text className="text-[#C3C3C3] text-xs font-medium mb-1">
              FORMAT
            </Text>
            <Text className="text-white font-bold text-sm">MP4</Text>
          </View>
        </View>

        {}
        <View className="mx-2 mt-4 mb-6">
          <TouchableOpacity
            className={`border rounded-2xl py-3.5 ${
            isDeleting ? " border-[#242424]" : " border-[#EF4444]"}`
            }
            onPress={handleDelete}
            disabled={isDeleting}>

            <View className="flex-row items-center justify-center">
              {isDeleting ?
              <Ionicons name="hourglass" size={18} color="#C3C3C3" /> :

              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              }
              <Text
                className={`font-semibold text-[17px] ml-2 ${
                isDeleting ? "text-[#C3C3C3]" : "text-[#EF4444]"}`
                }>

                {isDeleting ? "Siliniyor..." : "Videoyu Sil"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>);

}