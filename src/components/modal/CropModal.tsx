import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert } from
"react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CropModalStep } from "@/src/types";
import { useVideoProcessing } from "@/src/hooks/useVideoProcessing";
import { LinearGradient } from "expo-linear-gradient";


import VideoSelection from "./steps/VideoSelection";
import VideoCropping from "./steps/VideoCropping";
import MetadataForm from "./steps/MetadataForm";

const { height } = Dimensions.get("window");

interface CropModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
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
  success: "#22C55E"
};

export default function CropModal({
  visible,
  onClose,
  onComplete
}: CropModalProps) {
  const [currentStep, setCurrentStep] = useState<CropModalStep>("select");
  const [selectedVideoUri, setSelectedVideoUri] = useState<string>();
  const [cropData, setCropData] = useState<any>();

  const { processVideo, isProcessing, error, reset } = useVideoProcessing();

  const handleClose = () => {
    if (isProcessing) {
      Alert.alert(
        "Video İşleniyor",
        "Video işlenirken modal kapatılamaz. Lütfen bekleyiniz.",
        [{ text: "Tamam" }]
      );
      return;
    }

    setCurrentStep("select");
    setSelectedVideoUri(undefined);
    setCropData(undefined);
    reset();
    onClose();
  };

  const handleVideoSelected = (uri: string) => {
    setSelectedVideoUri(uri);
    setCurrentStep("crop");
  };

  const handleCropComplete = (data: any) => {
    setCropData(data);
    setCurrentStep("metadata");
  };

  const handleMetadataComplete = async (metadata: any) => {
    if (!selectedVideoUri || !cropData) {
      Alert.alert("Hata", "Video veya kesim bilgileri eksik");
      return;
    }

    try {
      console.log("Starting video processing with metadata:", metadata);

      const result = await processVideo({
        videoUri: selectedVideoUri,
        cropData,
        metadata
      });

      if (result.success) {
        Alert.alert("Başarılı! 🎬", "Video kaydedildi!", [
        {
          text: "Tamam",
          onPress: () => {
            handleClose();
            onComplete();
          }
        }]
        );
      } else {
        throw new Error(result.error || "Video işleme başarısız");
      }
    } catch (error) {
      console.error("Processing error:", error);
      Alert.alert(
        "Hata",
        `Video işlenirken hata oluştu: ${
        error instanceof Error ? error.message : "Bilinmeyen hata"}`

      );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "select":
        return "Video Seç";
      case "crop":
        return "Video Kes";
      case "metadata":
        return "Bilgileri Ekle";
      default:
        return "";
    }
  };

  const renderStep = () => {
    if (isProcessing) {
      return (
        <View className="flex-1 justify-center items-center px-6 bg-[#0B0B0B]">
          <View className="bg-[#121212] rounded-2xl p-8 items-center border border-[#242424] w-full max-w-sm">
            <LinearGradient
              colors={[colors.mainRose + "30", colors.mainRose + "10"]}
              style={{
                borderRadius: 50,
                padding: 20,
                marginBottom: 20,
                width: 80,
                height: 80,
                justifyContent: "center",
                alignItems: "center"
              }}>

              <Ionicons name="hourglass" size={32} color={colors.mainRose} />
            </LinearGradient>
            <Text className="text-xl font-bold text-white mb-2 text-center">
              Video İşleniyor
            </Text>
            <Text className="text-[#888888] text-center leading-relaxed text-[15px]">
              Videonuz kesiliyor ve kaydediliyor. Bu işlem birkaç saniye
              sürebilir.
            </Text>
            <View className="mt-6 w-full">
              <View className="bg-[#242424] rounded-full h-2">
                <View className="bg-[#B5BE64] h-2 rounded-full w-3/4 animate-pulse" />
              </View>
            </View>
          </View>
        </View>);

    }

    switch (currentStep) {
      case "select":
        return (
          <VideoSelection
            onVideoSelected={handleVideoSelected}
            onCancel={handleClose} />);


      case "crop":
        return (
          <VideoCropping
            videoUri={selectedVideoUri!}
            onCropComplete={handleCropComplete}
            onBack={() => setCurrentStep("select")} />);


      case "metadata":
        return (
          <MetadataForm
            onComplete={handleMetadataComplete}
            onBack={() => setCurrentStep("crop")} />);


      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>

      <SafeAreaView className="flex-1 bg-[#0B0B0B]">
        {!isProcessing &&
        <>
            {}
            <View className="flex-row items-center justify-between px-2 py-4 bg-[#0B0B0B]">
              <TouchableOpacity
              onPress={
              currentStep === "select" ?
              handleClose :
              () => {
                if (currentStep === "crop") setCurrentStep("select");
                if (currentStep === "metadata") setCurrentStep("crop");
              }
              }
              className="p-1">

                <Ionicons
                name={currentStep === "select" ? "close" : "arrow-back"}
                size={24}
                color="#FFFFFF" />

              </TouchableOpacity>

              <Text className="text-lg font-bold text-white">
                {getStepTitle()}
              </Text>

              <View className="w-6" />
            </View>

            {}
            <View className="flex-row items-center mx-2 my-4 bg-[#121212] p-4 rounded-2xl border border-[#242424]">
              {(["select", "crop", "metadata"] as CropModalStep[]).map(
              (step, index) =>
              <React.Fragment key={step}>
                    {}
                    <View className="items-center justify-center">
                      <View
                    className={`w-8 h-8 rounded-full justify-center items-center ${
                    currentStep === step ?
                    "bg-[#B5BE64]" :
                    index <
                    (
                    [
                    "select",
                    "crop",
                    "metadata"] as
                    CropModalStep[]).
                    indexOf(currentStep) ?
                    "bg-[#22C55E]" :
                    "bg-[#404040]"}`
                    }>

                        <Text
                      className={`text-sm font-bold ${
                      currentStep === step ||
                      index <
                      (
                      [
                      "select",
                      "crop",
                      "metadata"] as
                      CropModalStep[]).
                      indexOf(currentStep) ?
                      "text-[#0B0B0B]" :
                      "text-[#888888]"}`
                      }>

                          {index + 1}
                        </Text>
                      </View>
                    </View>

                    {}
                    {index < 2 &&
                <View
                  className={`flex-1 h-1 mx-2 ${
                  index <
                  (
                  ["select", "crop", "metadata"] as CropModalStep[]).
                  indexOf(currentStep) ?
                  "bg-[#22C55E]" :
                  "bg-[#404040]"}`
                  } />

                }
                  </React.Fragment>

            )}
            </View>
          </>
        }

        {}
        <View className="flex-1 bg-[#0B0B0B]">{renderStep()}</View>
      </SafeAreaView>
    </Modal>);

}