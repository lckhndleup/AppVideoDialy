import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { QueryProvider } from "@/src/providers/QueryProvider";
import { useVideoStore } from "@/src/store/videoStore";
import SplashScreen from "./SplashScreen";
import * as Font from "expo-font";
import { Platform } from "react-native";
import * as SplashScreenExpo from "expo-splash-screen";


SplashScreenExpo.preventAutoHideAsync().catch(() => {

});

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { loadVideos } = useVideoStore();

  useEffect(() => {
    async function prepare() {
      try {

        await SplashScreenExpo.hideAsync();


        await loadVideos();


        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn("App initialization error:", e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, [loadVideos]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!isReady || showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <QueryProvider>
      <StatusBar style="auto" />
      {children}
    </QueryProvider>);

}