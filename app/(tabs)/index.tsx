import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
  TextInput } from
"react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoStore } from "@/src/store/videoStore";
import { VideoItem } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CropModal from "@/src/components/modal/CropModal";
import ThumbnailImage from "@/src/components/ThumbnailImage";
import { useSearch } from "@/src/hooks/useSearch";
import { LinearGradient } from "expo-linear-gradient";
import CustomModal from "@/src/components/common/CustomModal";
import { deleteVideoFiles } from "@/src/services/videoService";

const { width } = Dimensions.get("window");


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

type TabType = "videos" | "add";

export default function HomeScreen() {
  const { videos, isLoading } = useVideoStore();
  const router = useRouter();
  const [isCropModalVisible, setCropModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("videos");


  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<VideoItem | null>(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const {
    query,
    setQuery,
    isSearching,
    showSearchResults,
    displayData,
    searchStats,
    clearSearch
  } = useSearch();

  const handleVideoPress = (videoId: string) => {
    router.push({
      pathname: "/details",
      params: { videoId }
    });
  };

  const handleAddVideo = () => {
    setCropModalVisible(true);
  };

  const handleCropComplete = () => {
    console.log("Video processing completed successfully!");
  };


  const handleDeleteRequest = (video: VideoItem) => {
    setVideoToDelete(video);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      const { deleteVideo } = useVideoStore.getState();


      await deleteVideo(videoToDelete.id);


      await deleteVideoFiles(videoToDelete);


      setDeleteModalVisible(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error("Video silme hatası:", error);
      setErrorMessage("Video silinirken bir sorun oluştu.");
      setErrorModalVisible(true);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setVideoToDelete(null);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    clearSearch();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [clearSearch]);

  const renderTabBar = () =>
  <View className="bg-[#0B0B0B]">
      <View className="px-2 pt-5">
        <Text className="text-[28px] font-extrabold text-white mb-4 tracking-tight">
          Video Günlüğüm
        </Text>

        <View className="flex-row bg-[#121212] rounded-[14px] p-1 mb-4 border border-[#242424]">
          <TouchableOpacity
          className={`flex-1 py-3.5 rounded-[10px] items-center flex-row justify-center ${
          activeTab === "videos" ? "bg-[#B5BE64]" : "bg-transparent"}`
          }
          onPress={() => setActiveTab("videos")}>

            <Ionicons
            name="videocam"
            size={20}
            color={activeTab === "videos" ? colors.bg : colors.textSecondary}
            style={{ marginRight: 8 }} />

            <Text
            className={`text-base ${
            activeTab === "videos" ?
            "text-[#0B0B0B] font-bold" :
            "text-[#C3C3C3] font-medium"}`
            }>

              Videolarım
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          className={`flex-1 py-3.5 rounded-[10px] items-center flex-row justify-center ${
          activeTab === "add" ? "bg-[#B5BE64]" : "bg-transparent"}`
          }
          onPress={() => setActiveTab("add")}>

            <Ionicons
            name="add-circle"
            size={20}
            color={activeTab === "add" ? colors.bg : colors.textSecondary}
            style={{ marginRight: 8 }} />

            <Text
            className={`text-base ${
            activeTab === "add" ?
            "text-[#0B0B0B] font-bold" :
            "text-[#C3C3C3] font-medium"}`
            }>

              Video Ekle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>;


  const renderVideoItem = ({
    item,
    index



  }: {item: VideoItem;index: number;}) =>
  <View className="bg-[#121212] mx-2 mb-3 rounded-2xl p-4 border border-[#242424]">
      <View className="flex-row">
        {}
        <TouchableOpacity onPress={() => handleVideoPress(item.id)}>
          <View className="relative">
            <ThumbnailImage
            thumbnailUri={item.thumbnailUri}
            width={90}
            height={90}
            className="rounded-xl"
            showDuration={false}
            duration={item.duration} />

          </View>
        </TouchableOpacity>

        {}
        <TouchableOpacity
        className="flex-1 ml-3.5 justify-between"
        onPress={() => handleVideoPress(item.id)}>

          <View>
            <View className="flex-row justify-between items-start mb-1.5">
              <Text
              className="text-lg font-bold text-white flex-1 mr-2 leading-6"
              numberOfLines={2}>

                {item.name}
              </Text>
              <View className="bg-black/60 px-2 py-1 rounded-[10px] min-w-9 items-center">
                <Text className="text-white text-xs font-bold">
                  {item.duration.toFixed(1)}s
                </Text>
              </View>
            </View>

            <Text
            className="text-[#C3C3C3] text-[15px] leading-5 mb-2"
            numberOfLines={2}>

              {item.description || "Açıklama eklenmemiş"}
            </Text>
          </View>

          {}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary} />

              <Text className="text-[#C3C3C3] text-xs ml-1 font-medium mr-3">
                {new Date(item.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short"
              })}
              </Text>

              {item.updatedAt &&
            <View className="flex-row items-center mr-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mr-1.5" />
                  <Text className="text-[#22C55E] text-xs font-medium">
                    Düzenlendi
                  </Text>
                </View>
            }
            </View>

            {}
            <TouchableOpacity
            onPress={() => handleDeleteRequest(item)}
            className="bg-[#0B0B0B80] w-8 h-8 rounded-full justify-center items-center">

              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </View>;


  const renderEmptyState = () => {
    if (showSearchResults) {
      return (
        <View className="flex-1 justify-center items-center px-6 py-12">
          <View className="bg-[#121212] rounded-3xl p-6 mb-5 border border-[#242424]">
            <Ionicons name="search" size={48} color={colors.mainRose} />
          </View>
          <Text className="text-[22px] font-bold text-white mb-2 text-center">
            Sonuç bulunamadı
          </Text>
          <Text className="text-[#C3C3C3] text-center text-[15px] leading-[22px] mb-6">
            "{query}" araması için hiç video bulunamadı. Farklı kelimeler
            deneyin.
          </Text>
          <TouchableOpacity
            className="bg-[#B5BE64] px-5 py-3 rounded-xl"
            onPress={clearSearch}>

            <Text className="text-[#0B0B0B] font-semibold text-[15px]">
              Aramayı Temizle
            </Text>
          </TouchableOpacity>
        </View>);

    }

    return (
      <View className="flex-1 justify-center items-center px-6 py-12">
        <LinearGradient
          colors={[colors.mainRose + "20", colors.mainRose + "10"]}
          style={{
            borderRadius: 24,
            padding: 24,
            marginBottom: 20
          }}>

          <Ionicons name="videocam-outline" size={48} color={colors.mainRose} />
        </LinearGradient>
        <Text className="text-2xl font-bold text-white mb-2 text-center">
          Henüz video yok
        </Text>
        <Text className="text-[#C3C3C3] text-center text-[15px] leading-[22px] mb-6">
          İlk video günlüğünüzü oluşturmak için video ekleyin ve anılarınızı
          kaydetmeye başlayın
        </Text>
        <View className="flex-row items-center bg-[#121212] px-3.5 py-2.5 rounded-xl border border-[#242424]">
          <Ionicons name="bulb" size={16} color={colors.mainRose} />
          <Text className="text-[#B5BE64] text-[13px] ml-1.5 font-medium">
            5 saniyelik kısa videolar oluşturabilirsiniz
          </Text>
        </View>
      </View>);

  };

  const renderVideoAddTab = () =>
  <View className="flex-1 justify-center items-center px-4">
      <LinearGradient
      colors={[colors.mainRose + "20", colors.mainRose + "10"]}
      style={{
        borderRadius: 24,
        padding: 24,
        marginBottom: 20
      }}>

        <Ionicons name="add-circle" size={48} color={colors.mainRose} />
      </LinearGradient>
      <Text className="text-[26px] font-bold text-white mb-2 text-center">
        Video Ekle
      </Text>
      <Text className="text-[#C3C3C3] text-center text-base leading-[22px] mb-6">
        Yeni bir video günlüğü oluşturmak için aşağıdaki butona dokunun
      </Text>

      <TouchableOpacity
      className="bg-[#B5BE64] px-6 py-3.5 rounded-2xl flex-row items-center"
      onPress={handleAddVideo}>

        <Ionicons
        name="videocam"
        size={20}
        color={colors.bg}
        style={{ marginRight: 8 }} />

        <Text className="text-[#0B0B0B] font-bold text-[17px]">Video Çek</Text>
      </TouchableOpacity>
    </View>;


  const renderSearchBar = () =>
  <View className="bg-[#0B0B0B] px-2 pb-4">
      <View className="bg-[#121212] rounded-[14px] px-4 py-1 border border-[#242424] flex-row items-center">
        <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={{ marginRight: 12 }} />

        <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Videoları ara..."
        placeholderTextColor={colors.textSecondary}
        className="flex-1 bg-transparent text-white text-base py-3.5" />

        {query.length > 0 &&
      <TouchableOpacity onPress={clearSearch} className="ml-2">
            <Ionicons
          name="close-circle"
          size={20}
          color={colors.textSecondary} />

          </TouchableOpacity>
      }
      </View>

      {showSearchResults &&
    <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-[#C3C3C3] text-sm">
            "{query}" için {displayData.length} sonuç
          </Text>
          <TouchableOpacity onPress={clearSearch}>
            <Text className="text-[#B5BE64] text-sm font-semibold">
              Temizle
            </Text>
          </TouchableOpacity>
        </View>
    }
    </View>;


  if (isLoading && videos.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0B0B] justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <Ionicons name="hourglass" size={40} color={colors.mainRose} />
        <Text className="text-[#C3C3C3] mt-4 font-medium text-[17px]">
          Videolar yükleniyor...
        </Text>
      </SafeAreaView>);

  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0B]">
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {renderTabBar()}

      {activeTab === "videos" &&
      <>
          {renderSearchBar()}
          <FlatList
          data={displayData}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.mainRose}
            colors={[colors.mainRose]}
            progressBackgroundColor={colors.card} />

          }
          keyboardShouldPersistTaps="handled" />

        </>
      }

      {activeTab === "add" && renderVideoAddTab()}

      {}
      <CropModal
        visible={isCropModalVisible}
        onClose={() => setCropModalVisible(false)}
        onComplete={handleCropComplete} />


      {}
      <CustomModal
        visible={isDeleteModalVisible}
        type="confirm"
        title="Videoyu Sil"
        message={`"${
        videoToDelete?.name || ""}" videosunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
        }
        iconName="trash"
        color={colors.danger}
        primaryButton={{
          text: "Evet, Sil",
          onPress: handleConfirmDelete,
          color: colors.danger
        }}
        secondaryButton={{
          text: "Vazgeç",
          onPress: handleCancelDelete
        }} />


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

    </SafeAreaView>);

}