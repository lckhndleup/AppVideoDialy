import React, { useEffect, useRef } from "react";
import { View, Text, StatusBar, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const { width, height } = Dimensions.get("window");
  const animationSize = Math.min(width, height) * 0.6;

  return (
    <View className="flex-1 bg-[#0B0B0B] justify-center items-center">
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0B" />

      <View
        style={{
          width: animationSize,
          height: animationSize,
          alignItems: "center",
          justifyContent: "center"
        }}>

        <LottieView
          ref={lottieRef}
          source={require("../../assets/splash/2wUkdXfOKw.json")}
          style={{ width: "50%", height: "50%" }}
          autoPlay
          loop={false} />

      </View>

      {}
      <LinearGradient
        colors={["transparent", "#B5BE64", "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="h-[1px] w-60 mt-8 opacity-60" />

    </View>);

}