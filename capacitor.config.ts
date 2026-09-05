import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.laliga.matches',
  appName: 'LaLiga Partidos',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
