/**
 * Zero-config PWA for Vite
 * https://github.com/antfu/vite-plugin-pwa
 */
import { VitePWA } from 'vite-plugin-pwa';

export default function pwaPlugin(env: ImportMetaEnv) {
  const { VITE_USE_PWA, VITE_APP_TITLE, VITE_APP_NAME } = env;

  if (VITE_USE_PWA) {
    // vite-plugin-pwa
    const vitePwaPlugin = VitePWA({
      manifest: {
        name: VITE_APP_TITLE,
        short_name: VITE_APP_NAME,
        icons: [
          {
            src: './resource/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './resource/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    });
    return vitePwaPlugin;
  }
  return [];
}
