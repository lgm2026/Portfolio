import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.dbmb.qrhype",
  appName: "QRHype",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
