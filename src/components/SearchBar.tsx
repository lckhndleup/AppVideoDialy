import React, { useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Animated } from
"react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  placeholder?: string;
  showSearchResults?: boolean;
  searchStats?: {
    total: number;
    totalDuration: number;
  } | null;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  isSearching = false,
  placeholder = "Videoları ara...",
  showSearchResults = false,
  searchStats
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSearchResults ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [showSearchResults, fadeAnim]);

  const handleClear = () => {
    onClear();
    Keyboard.dismiss();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View className="px-4 pb-4">
      {}
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
        <TouchableOpacity onPress={focusInput}>
          <Ionicons name="search" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          className="flex-1 ml-3 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()} />


        {}
        {isSearching ?
        <View className="ml-3">
            <Ionicons name="hourglass-outline" size={20} color="#6B7280" />
          </View> :
        value.length > 0 ?
        <TouchableOpacity onPress={handleClear} className="ml-3 p-1">
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity> :
        null}
      </View>

      {}
      {searchStats &&
      <Animated.View style={{ opacity: fadeAnim }} className="mt-3">
          <View className="flex-row items-center justify-between bg-blue-50 px-4 py-3 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={16} color="#3B82F6" />
              <Text className="ml-2 text-blue-700 text-sm font-medium">
                {searchStats.total} video bulundu
              </Text>
            </View>

            <Text className="text-blue-600 text-xs">
              {searchStats.totalDuration.toFixed(1)}s toplam
            </Text>
          </View>
        </Animated.View>
      }
    </View>);

}