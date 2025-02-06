import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crypto.mining',
  appName: 'Crypto-mining-mobile',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {}
  },
};

export default config;
