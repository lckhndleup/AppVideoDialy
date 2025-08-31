import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform } from
"react-native";
import { Ionicons } from "@expo/vector-icons";
import { VideoMetadata } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { VideoMetadataSchema, validateForm } from "@/src/utils/validations";
import CustomModal from "@/src/components/common/CustomModal";

interface MetadataFormProps {
  onComplete: (metadata: VideoMetadata) => void;
  onBack: () => void;
}


const colors = {
  mainRose: "#B5BE64",
  mainRoseSD: "#B5BE4680",
  textPrimary: "#FFFFFF",
  textSecondary: "#C3C3C3",
  bg: "#0B0B0B",
  card: "#121212",
  divider: "#242424",
  danger: "#EF4444",
  success: "#22C55E",
  purple: "#8B5CF6"
};

export default function MetadataForm({
  onComplete,
  onBack
}: MetadataFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{name?: string;description?: string;}>(
    {}
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateAndSubmit = async () => {
    try {
      setIsProcessing(true);
      setErrors({});


      const formData = {
        name: name.trim(),
        description: description.trim()
      };

      const result = validateForm(VideoMetadataSchema, formData);

      if (!result.success) {
        setErrors(result.errors as {name?: string;description?: string;});
        setIsProcessing(false);
        return;
      }


      const validatedData = {
        name: result.data!.name,
        description: result.data!.description || ""
      };


      onComplete(validatedData);
    } catch (error) {
      console.error("Form validation error:", error);
      setErrorMessage("Form doğrulanırken bir hata oluştu");
      setErrorModalVisible(true);
      setIsProcessing(false);
    }
  };

  const generateSuggestions = () => {
    const currentDate = new Date();
    const timeString = currentDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const dateString = currentDate.toLocaleDateString("tr-TR");

    return [
    `Video ${timeString}`,
    `Günlük ${dateString}`,
    `Anı ${timeString}`,
    "Özel Anım",
    "Günün Videosu"];

  };

  const suggestions = generateSuggestions();

  const SuggestionChip = ({
    text,
    onPress



  }: {text: string;onPress: () => void;}) =>
  <TouchableOpacity
    className="bg-[#B5BE6420] border border-[#B5BE6480] rounded-full px-4 py-2 mr-2 mb-2"
    onPress={onPress}>

      <Text className="text-[#B5BE64] text-sm font-medium">{text}</Text>
    </TouchableOpacity>;


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0B0B0B]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        {}
        <View className="bg-[#121212] rounded-2xl p-4 mb-6 mt-4 border border-[#242424]">
          <View className="flex-row items-start">
            <View className="bg-[#22C55E20] w-8 h-8 rounded-full justify-center items-center">
              <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold mb-1 text-base">
                Video Hazırlandı!
              </Text>
              <Text className="text-[#C3C3C3] text-[15px]">
                5 saniyelik video segmentiniz seçildi. Şimdi video hakkında
                bilgi ekleyin.
              </Text>
            </View>
          </View>
        </View>

        {}
        <View className="mb-6">
          <Text className="text-base font-semibold text-white mb-2">
            Video Adı *
          </Text>
          <View className="bg-[#121212] rounded-xl border border-[#242424] overflow-hidden">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Videonuza bir isim verin..."
              placeholderTextColor="#C3C3C3"
              className="p-4 text-white text-[15px]"
              maxLength={50}
              returnKeyType="next"
              autoCapitalize="sentences" />

          </View>

          {errors.name &&
          <View className="flex-row items-center mt-2">
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-[#EF4444] text-sm ml-1">{errors.name}</Text>
            </View>
          }

          <View className="flex-row justify-between mt-2">
            <Text className="text-[#C3C3C3] text-xs">Video adı zorunludur</Text>
            <Text
              className={`text-xs ${
              name.length > 45 ? "text-[#EF4444]" : "text-[#C3C3C3]"}`
              }>

              {name.length}/50
            </Text>
          </View>

          {}
          {name.length === 0 &&
          <View className="mt-4">
              <Text className="text-[#C3C3C3] font-medium mb-3 text-sm">
                Önerilen isimler:
              </Text>
              <View className="flex-row flex-wrap">
                {suggestions.map((suggestion, index) =>
              <SuggestionChip
                key={index}
                text={suggestion}
                onPress={() => setName(suggestion)} />

              )}
              </View>
            </View>
          }
        </View>

        {}
        <View className="mb-6">
          <Text className="text-base font-semibold text-white mb-2">
            Açıklama
            <Text className="text-[#C3C3C3] font-normal text-sm">
              {" "}
              (İsteğe bağlı)
            </Text>
          </Text>
          <View className="bg-[#121212] rounded-xl border border-[#242424] overflow-hidden">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Bu video hakkında kısa bir açıklama yazabilirsiniz..."
              placeholderTextColor="#C3C3C3"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="p-4 text-white text-[15px] min-h-[100px]"
              maxLength={200}
              returnKeyType="done"
              autoCapitalize="sentences" />

          </View>

          {errors.description &&
          <View className="flex-row items-center mt-2">
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-[#EF4444] text-sm ml-1">
                {errors.description}
              </Text>
            </View>
          }

          <Text
            className={`text-xs mt-2 text-right ${
            description.length > 180 ? "text-[#EF4444]" : "text-[#C3C3C3]"}`
            }>

            {description.length}/200
          </Text>
        </View>

        {}
        <View className="bg-[#121212] rounded-2xl p-4 mb-6 border border-[#242424]">
          <View className="flex-row items-start">
            <View className="bg-[#B5BE6420] w-8 h-8 rounded-full justify-center items-center">
              <Ionicons name="bulb" size={16} color={colors.mainRose} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold mb-2 text-base">
                İpuçları
              </Text>
              <Text className="text-[#C3C3C3] text-[15px] leading-5">
                • Açıklayıcı ve kısa isimler tercih edin{"\n"}• Video içeriği
                hakkında not düşebilirsiniz{"\n"}• Tarih ve saat otomatik olarak
                kaydedilir{"\n"}• Bu bilgileri daha sonra düzenleyebilirsiniz
              </Text>
            </View>
          </View>
        </View>

        {}
        <View className="bg-[#121212] rounded-2xl p-4 mb-8 border border-[#242424]">
          <Text className="text-white font-semibold mb-3 text-base">
            Önizleme
          </Text>
          <View className="bg-[#0B0B0B] rounded-xl p-4 border border-[#242424]">
            <View className="flex-row items-center mb-2">
              <View className="bg-[#B5BE6420] w-6 h-6 rounded-full justify-center items-center">
                <Ionicons name="videocam" size={12} color={colors.mainRose} />
              </View>
              <Text
                className="ml-2 text-white font-semibold flex-1"
                numberOfLines={1}>

                {name || "Video adı"}
              </Text>
            </View>

            {description &&
            <Text
              className="text-[#C3C3C3] text-sm leading-5"
              numberOfLines={3}>

                {description}
              </Text>
            }

            <Text className="text-[#C3C3C3] text-xs mt-2">
              5.0s • {new Date().toLocaleDateString("tr-TR")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {}
      <View className="px-2 pb-4 bg-[#0B0B0B] border-t border-[#242424]">
        <View className="flex-row space-x-3 mt-4">
          <TouchableOpacity
            className="flex-1 py-3.5 bg-[#121212] rounded-xl border border-[#242424]"
            onPress={onBack}
            disabled={isProcessing}>

            <Text className="text-center font-semibold text-[#C3C3C3]">
              Geri
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3.5 rounded-xl border ${
            name.trim().length > 0 && !isProcessing ?
            "bg-[#121212] border-[#B5BE64]" :
            "bg-[#242424] border-[#242424]"}`
            }
            onPress={validateAndSubmit}
            disabled={name.trim().length === 0 || isProcessing}>

            <View className="flex-row justify-center items-center">
              {isProcessing &&
              <Ionicons name="hourglass" size={16} color={colors.mainRose} />
              }
              <Text
                className={`font-semibold ml-1 ${
                name.trim().length > 0 && !isProcessing ?
                "text-[#B5BE64]" :
                "text-[#C3C3C3]"}`
                }>

                {isProcessing ? "İşleniyor..." : "Video Kaydet (Demo)"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {}
      <CustomModal
        visible={errorModalVisible}
        type="error"
        title="Hata"
        message={errorMessage}
        iconName="close-circle"
        color={colors.danger}
        primaryButton={{
          text: "Tamam",
          onPress: () => setErrorModalVisible(false)
        }} />

    </KeyboardAvoidingView>);

}