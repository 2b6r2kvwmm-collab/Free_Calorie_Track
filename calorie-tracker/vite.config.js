import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import footerInjectionPlugin from './vite-plugin-footer.js'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    host: true, // Listen on all addresses including LAN
    port: 5173,
    allowedHosts: [
      '.ngrok-free.dev', // Allow all ngrok free tier domains
      '.ngrok.io',       // Allow all ngrok paid tier domains (if upgraded)
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks to improve caching and reduce INP
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'barcode-vendor': ['html5-qrcode'],
        }
      }
    }
  },
  plugins: [
    basicSsl(),
    react(),
    footerInjectionPlugin(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectRegister: 'auto',
      manifest: {
        name: 'Free Calorie Track',
        short_name: 'Free Calorie Track',
        description: 'Free calorie and macro tracker with barcode scanning, trends, and offline support',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/blog/],
        // Removed Open Food Facts API caching - search results are dynamic
        // and shouldn't be cached. Service worker was interfering with
        // error responses (503) and causing confusing CORS/network errors.
        runtimeCaching: []
      }
    })
  ]
})
