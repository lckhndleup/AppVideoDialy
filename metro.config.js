const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("json");
config.resolver.sourceExts.push("css");
config.watchFolders = [__dirname];

module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
});
