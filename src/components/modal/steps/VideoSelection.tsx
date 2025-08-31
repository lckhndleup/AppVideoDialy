import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import CustomModal from "../../../components/common/CustomModal";

interface VideoSelectionProps {
  onVideoSelected: (uri: string) => void;
  onCancel: () => void;
}

export default function VideoSelection({
  onVideoSelected,
  onCancel
}: VideoSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);


  const [permissionModal, setPermissionModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: ""
  });
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: ""
  });
  const [shortVideoModal, setShortVideoModal] = useState({
    visible: false
  });


  const [guideModal, setGuideModal] = useState({ visible: false });
  const [helpModal, setHelpModal] = useState({ visible: false });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setPermissionModal({
        visible: true,
        title: "İzin Gerekli",
        message: "Video seçmek için galeri erişim izni gerekiyor.",
        type: "gallery"
      });
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    try {
      setIsLoading(true);

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 300
      });

      if (!result.canceled && result.assets[0]) {
        const video = result.assets[0];


        if (video.duration && video.duration < 5000) {

          setShortVideoModal({
            visible: true
          });
          return;
        }

        onVideoSelected(video.uri);
      }
    } catch (error) {
      console.error("Video selection error:", error);
      setErrorModal({
        visible: true,
        title: "Hata",
        message: "Video seçilirken bir hata oluştu"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromFiles = async () => {
    try {
      setIsLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets[0]) {
        const video = result.assets[0];
        onVideoSelected(video.uri);
      }
    } catch (error) {
      console.error("Document picker error:", error);
      setErrorModal({
        visible: true,
        title: "Hata",
        message: "Video seçilirken bir hata oluştu"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordVideo = async () => {
    try {
      setIsLoading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setPermissionModal({
          visible: true,
          title: "İzin Gerekli",
          message: "Video çekmek için kamera erişim izni gerekiyor.",
          type: "camera"
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 300
      });

      if (!result.canceled && result.assets[0]) {
        const video = result.assets[0];

        if (video.duration && video.duration < 5000) {
          setShortVideoModal({
            visible: true
          });
          return;
        }

        onVideoSelected(video.uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setErrorModal({
        visible: true,
        title: "Hata",
        message: "Video çekilirken bir hata oluştu"
      });
    } finally {
      setIsLoading(false);
    }
  };


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

  const SelectionButton = ({
    icon,
    title,
    description,
    onPress,
    color = "#B5BE64"






  }: {icon: string;title: string;description: string;onPress: () => void;color?: string;}) =>
  <TouchableOpacity
    className="bg-[#121212] border border-[#242424] rounded-2xl p-5 mb-4"
    onPress={onPress}
    disabled={isLoading}>

      <View className="flex-row items-center">
        <View
        className="w-12 h-12 rounded-full justify-center items-center mr-4"
        style={{ backgroundColor: `${color}20` }}>

          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white mb-1">{title}</Text>
          <Text className="text-[#C3C3C3] text-[15px]">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C3C3C3" />
      </View>
    </TouchableOpacity>;


  return (
    <ScrollView className="flex-1 px-2 bg-[#0B0B0B]">
      {}
      <View className="flex-row justify-center space-x-6 mb-6 mt-2">
        <TouchableOpacity
          className="bg-[#121212] border border-[#242424] rounded-2xl p-4 flex-1 mr-3 items-center"
          onPress={() => setGuideModal({ visible: true })}>

          <View className="bg-[#B5BE6420] w-12 h-12 rounded-full justify-center items-center mb-2">
            <Ionicons name="information-circle" size={24} color="#B5BE64" />
          </View>
          <Text className="text-white font-medium text-center text-sm">
            Video Seçim Rehberi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#121212] border border-[#242424] rounded-2xl p-4 flex-1 ml-3 items-center"
          onPress={() => setHelpModal({ visible: true })}>

          <View className="bg-[#22C55E20] w-12 h-12 rounded-full justify-center items-center mb-2">
            <Ionicons name="help-circle" size={24} color="#22C55E" />
          </View>
          <Text className="text-white font-medium text-center text-sm">
            Yardım
          </Text>
        </TouchableOpacity>
      </View>

      {}
      <View className="mb-6">
        <Text className="text-xl font-bold text-white mb-4">
          Video nereden seçmek istiyorsunuz?
        </Text>

        <SelectionButton
          icon="images"
          title="Galeriden Seç"
          description="Telefonunuzdaki mevcut videolardan birini seçin"
          onPress={pickFromGallery}
          color="#22C55E" />


        <SelectionButton
          icon="videocam"
          title="Video Çek"
          description="Yeni bir video çekin ve hemen kesin"
          onPress={recordVideo}
          color="#B5BE64" />


        <SelectionButton
          icon="folder"
          title="Dosyalardan Seç"
          description="Dosya yöneticisinden video seçin"
          onPress={pickFromFiles}
          color="#8B5CF6" />

      </View>

      {}
      {isLoading &&
      <View className="bg-[#121212] rounded-2xl p-8 items-center border border-[#242424]">
          <LinearGradient
          colors={["#B5BE6420", "#B5BE6410"]}
          style={{
            borderRadius: 20,
            padding: 12,
            marginBottom: 16
          }}>

            <Ionicons name="hourglass" size={32} color="#B5BE64" />
          </LinearGradient>
          <Text className="text-white text-base font-medium">
            Video seçiliyor...
          </Text>
          <Text className="text-[#C3C3C3] text-sm mt-2 text-center">
            Bu işlem birkaç saniye sürebilir
          </Text>
        </View>
      }

      {}
      <TouchableOpacity
        className="mb-6 bg-[#121212] border border-[#242424] py-3.5 rounded-2xl"
        onPress={onCancel}
        disabled={isLoading}>

        <Text className="text-[#C3C3C3] font-semibold text-center text-[15px]">
          İptal
        </Text>
      </TouchableOpacity>

      {}
      <CustomModal
        visible={guideModal.visible}
        title="Video Seçim Rehberi"
        type="info"
        primaryButton={{
          text: "Anladım",
          onPress: () => setGuideModal({ visible: false })
        }}
        onClose={() => setGuideModal({ visible: false })}>

        <View className="mb-6">
          <Text className="text-[#C3C3C3] text-[15px] leading-5 mb-4">
            Video seçimi yaparken aşağıdaki kurallara dikkat edin:
          </Text>
          <View className="space-y-2">
            <Text className="text-[#C3C3C3] text-[15px] leading-5">
              • Video en az 5 saniye uzunluğunda olmalıdır
            </Text>
            <Text className="text-[#C3C3C3] text-[15px] leading-5">
              • Maksimum 5 dakikalık videolar desteklenir
            </Text>
            <Text className="text-[#C3C3C3] text-[15px] leading-5">
              • MP4, MOV, AVI formatları kabul edilir
            </Text>
          </View>
        </View>
      </CustomModal>

      {}
      <CustomModal
        visible={helpModal.visible}
        title="Yardıma mı ihtiyacınız var?"
        type="success"
        primaryButton={{
          text: "Anladım",
          onPress: () => setHelpModal({ visible: false })
        }}
        onClose={() => setHelpModal({ visible: false })}>

        <View className="mb-6">
          <View className="mb-4">
            <View className="flex-row items-start mb-3">
              <View className="bg-[#B5BE6420] w-8 h-8 rounded-full justify-center items-center mr-3 mt-0.5">
                <Ionicons name="help-circle" size={16} color="#B5BE64" />
              </View>
              <Text className="text-[#C3C3C3] text-[15px] flex-1 leading-5">
                Video seçimi sırasında sorun yaşıyorsanız, telefonunuzun
                ayarlarından uygulama izinlerini kontrol edin.
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="bg-[#22C55E20] w-8 h-8 rounded-full justify-center items-center mr-3 mt-0.5">
                <Ionicons name="shield-checkmark" size={16} color="#22C55E" />
              </View>
              <Text className="text-[#C3C3C3] text-[15px] flex-1 leading-5">
                Videolarınız sadece kırpma işlemi için kullanılır ve
                gizliliğiniz korunur.
              </Text>
            </View>
          </View>
        </View>
      </CustomModal>

      {}
      <CustomModal
        visible={permissionModal.visible}
        title={permissionModal.title}
        message={permissionModal.message}
        type="warning"
        primaryButton={{
          text: "Tamam",
          onPress: () =>
          setPermissionModal((prev) => ({ ...prev, visible: false }))
        }}
        onClose={() =>
        setPermissionModal((prev) => ({ ...prev, visible: false }))
        } />


      {}
      <CustomModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        type="error"
        primaryButton={{
          text: "Tamam",
          onPress: () => setErrorModal((prev) => ({ ...prev, visible: false }))
        }}
        onClose={() => setErrorModal((prev) => ({ ...prev, visible: false }))} />


      {}
      <CustomModal
        visible={shortVideoModal.visible}
        title="Video Çok Kısa"
        message="Video en az 5 saniye uzunluğunda olmalıdır."
        type="warning"
        primaryButton={{
          text: "Tamam",
          onPress: () =>
          setShortVideoModal((prev) => ({ ...prev, visible: false }))
        }}
        onClose={() =>
        setShortVideoModal((prev) => ({ ...prev, visible: false }))
        } />

    </ScrollView>);

}