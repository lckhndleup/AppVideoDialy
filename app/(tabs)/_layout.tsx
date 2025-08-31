import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useVideoStore } from "@/src/store/videoStore";

export default function TabLayout() {
  const { loadVideos } = useVideoStore();

  useEffect(() => {

    loadVideos().catch(console.error);
  }, [loadVideos]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 0,
          display: "none"
        }
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: "Video Günlüğüm",
          tabBarIcon: ({ color, size }) =>
          <Ionicons name="videocam" size={size} color={color} />

        }} />

    </Tabs>);

}