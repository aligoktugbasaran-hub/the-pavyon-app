import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.thepavyon.app",
  appName: "The Pavyon",
  webDir: "out",
  server: {
    androidScheme: "https",
    // Production'da bu satır yorumlanmalı — sadece yerel test için açılır
    // url: "http://192.168.1.98:3000",
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0a0011",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "Dark",
      backgroundColor: "#0a0011",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: "automatic",
  },
};
export default config;
