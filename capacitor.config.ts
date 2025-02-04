import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crypto.mining',
  appName: 'Crypto-mining-mobile',
  webDir: 'dist',
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
