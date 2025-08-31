import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform } from
"react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVideoStore } from "@/src/store/videoStore";
import { Ionicons } from "@expo/vector-icons";
import VideoPlayer from "@/src/components/VideoPlayer";
import { VideoMetadataSchema, validateForm } from "@/src/utils/validations";
import CustomModal from "@/src/components/common/CustomModal";

export default function EditScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{videoId: string;}>();
  const { getVideoById, updateVideo } = useVideoStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{name?: string;description?: string;}>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const video = videoId ? getVideoById(videoId) : null;

  useEffect(() => {
    if (video) {
      setName(video.name);
      setDescription(video.description);
    }
  }, [video]);

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0B0B] justify-center items-center">
        <View className="bg-[#121212] rounded-lg p-8 mx-6 items-center border border-[#242424]">
          <View className="bg-[#EF444420] w-16 h-16 rounded-full justify-center items-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-white mb-2 text-center">
            Video Bulunamadı
          </Text>
          <TouchableOpacity
            className="bg-[#B5BE64] px-6 py-3 rounded-lg mt-4"
            onPress={() => router.back()}>

            <Text className="text-[#0B0B0B] font-semibold">Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setErrors({});


      const formData = {
        name: name.trim(),
        description: description.trim()
      };

      const result = validateForm(VideoMetadataSchema, formData);

      if (!result.success) {
        setErrors(result.errors as {name?: string;description?: string;});
        return;
      }


      updateVideo(videoId!, {
        name: result.data!.name,
        description: result.data!.description || ""
      });


      setSuccessModalVisible(true);
    } catch (error) {

      console.error("Edit error:", error);
      setErrors({ name: "Video güncellenirken bir hata oluştu" });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
  name.trim() !== video.name || description.trim() !== video.description;

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0B]">
      {}
      <CustomModal
        visible={successModalVisible}
        type="success"
        title="Başarılı"
        message="Video bilgileri başarıyla güncellendi"
        primaryButton={{
          text: "Tamam",
          onPress: () => {
            setSuccessModalVisible(false);
            router.back();
          }
        }} />


      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}>

        {}
        <View className="flex-row items-center justify-between px-2 py-4 bg-[#0B0B0B]">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-white">Video Düzenle</Text>

          <View className="w-6" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {}
          <View className="mx-2 mt-4 relative">
            <VideoPlayer
              videoUri={video.videoUri}
              thumbnailUri={video.thumbnailUri}
              aspectRatio={16 / 9}
              showControls={true}
              className="rounded-2xl overflow-hidden" />


            {}
          </View>

          {}
          <View className="mx-2 mt-4 flex-row items-center">
            <View className="bg-[#B5BE6420] w-6 h-6 rounded-full justify-center items-center mr-3">
              <Ionicons name="information-circle" size={16} color="#B5BE64" />
            </View>
            <Text className="text-[#C3C3C3] text-sm flex-1">
              Sadece açıklama ve video ismi düzenlenebilir.
            </Text>
          </View>

          {}
          <View className="mx-2 mt-4">
            <Text className="text-white font-semibold text-base mb-3">
              Video Adı
            </Text>
            <View className="bg-[#121212] rounded-lg border border-[#242424] p-4">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Video adını girin..."
                placeholderTextColor="#C3C3C3"
                className={`text-white text-[15px] ${
                errors.name ? "text-[#EF4444]" : ""}`
                }
                maxLength={50} />

            </View>
            {errors.name &&
            <Text className="text-[#EF4444] text-sm mt-2">{errors.name}</Text>
            }
            <Text className="text-[#C3C3C3] text-xs mt-2">
              {name.length}/50 karakter
            </Text>
          </View>

          {}
          <View className="mx-2 mt-4">
            <Text className="text-white font-semibold text-base mb-3">
              Açıklama
            </Text>
            <View className="bg-[#121212] rounded-lg border border-[#242424] p-4">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Video hakkında açıklama yazın..."
                placeholderTextColor="#C3C3C3"
                multiline
                numberOfLines={1}
                className={`text-white text-[15px] ${
                errors.description ? "text-[#EF4444]" : ""}`
                }
                maxLength={200} />

            </View>
            {errors.description &&
            <Text className="text-[#EF4444] text-sm mt-2">
                {errors.description}
              </Text>
            }
            <Text className="text-[#C3C3C3] text-xs mt-2">
              {description.length}/200 karakter
            </Text>
          </View>

          {}
          <View className="mx-2 mt-4 mb-6 flex-row justify-between">
            <View className="flex-1 mr-1.5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-[#121212] border border-[#242424] py-3 rounded-lg">

                <Text className="text-white font-bold text-sm text-center">
                  İptal
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-1 ml-1.5">
              <TouchableOpacity
                onPress={handleSave}
                disabled={!hasChanges || isLoading}
                className={`py-3 rounded-lg ${
                hasChanges && !isLoading ?
                "bg-[#121212] border border-[#B5BE64]" :
                "bg-[#242424] border border-[#242424]"}`
                }>

                <Text
                  className={`font-bold text-sm text-center ${
                  hasChanges && !isLoading ?
                  "text-[#B5BE64]" :
                  "text-[#C3C3C3]"}`
                  }>

                  {isLoading ? "Kaydediliyor..." : "Tamamla"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}