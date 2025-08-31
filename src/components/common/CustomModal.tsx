import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle } from
"react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


export type ModalType =
"success" |
"confirm" |
"warning" |
"error" |
"info" |
"custom";


export interface CustomModalProps {

  visible: boolean;
  title: string;
  message?: string;


  type?: ModalType;
  color?: string;
  iconName?: keyof typeof Ionicons.glyphMap;


  primaryButton?: {
    text: string;
    onPress: () => void;
    color?: string;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
    color?: string;
  };


  onClose?: () => void;
  dismissable?: boolean;


  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;


  children?: React.ReactNode;
}


export const modalColors = {
  primary: "#B5BE64",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  dark: "#121212",
  light: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#C3C3C3",
  border: "#242424",
  background: "#0B0B0B"
};

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  type = "custom",
  color,
  iconName,
  primaryButton,
  secondaryButton,
  onClose,
  dismissable = true,
  containerStyle,
  titleStyle,
  messageStyle,
  children
}) => {

  const getDefaultsForType = () => {
    switch (type) {
      case "success":
        return {
          color: modalColors.success,
          icon: iconName || "checkmark-circle"
        };
      case "confirm":
        return {
          color: modalColors.warning,
          icon: iconName || "help-circle"
        };
      case "warning":
        return {
          color: modalColors.warning,
          icon: iconName || "alert-circle"
        };
      case "error":
        return {
          color: modalColors.error,
          icon: iconName || "close-circle"
        };
      case "info":
        return {
          color: modalColors.info,
          icon: iconName || "information-circle"
        };
      default:
        return {
          color: color || modalColors.primary,
          icon: iconName || "apps"
        };
    }
  };

  const defaults = getDefaultsForType();
  const modalColor = color || defaults.color;
  const modalIcon = iconName || defaults.icon;


  const handleOverlayPress = () => {
    if (dismissable && onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>

      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              className="bg-[#121212] mx-4 rounded-3xl p-6 border border-[#242424]"
              style={containerStyle}>

              {}
              {modalIcon &&
              <View className="items-center mb-4">
                  <LinearGradient
                  colors={[modalColor + "30", modalColor + "10"]}
                  style={{
                    borderRadius: 50,
                    padding: 12,
                    width: 64,
                    height: 64,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>

                    <Ionicons name={modalIcon} size={28} color={modalColor} />
                  </LinearGradient>
                </View>
              }

              {}
              <Text
                className="text-white text-[22px] text-center font-bold mb-2"
                style={titleStyle}>

                {title}
              </Text>

              {}
              {message &&
              <Text
                className="text-[#C3C3C3] text-center text-[15px] mb-6"
                style={messageStyle}>

                  {message}
                </Text>
              }

              {}
              {children}

              {}
              {(primaryButton || secondaryButton) &&
              <View
                className={`flex-row justify-between ${
                !secondaryButton ? "mt-6" : ""}`
                }>

                  {secondaryButton &&
                <TouchableOpacity
                  className={`flex-1 py-3.5 bg-[#242424] rounded-xl border border-[#333333] ${
                  primaryButton ? "mr-3" : ""}`
                  }
                  onPress={secondaryButton.onPress}>

                      <Text
                    style={{ color: secondaryButton.color || "#C3C3C3" }}
                    className="text-center font-medium">

                        {secondaryButton.text}
                      </Text>
                    </TouchableOpacity>
                }

                  {primaryButton &&
                <TouchableOpacity
                  className={`flex-1 py-3.5 rounded-xl border ${
                  secondaryButton ? "ml-3" : ""}`
                  }
                  style={{
                    backgroundColor:
                    (primaryButton.color || modalColor) + "20",
                    borderColor: primaryButton.color || modalColor
                  }}
                  onPress={primaryButton.onPress}>

                      <Text
                    style={{ color: primaryButton.color || modalColor }}
                    className="text-center font-bold">

                        {primaryButton.text}
                      </Text>
                    </TouchableOpacity>
                }
                </View>
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>);

};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default CustomModal;