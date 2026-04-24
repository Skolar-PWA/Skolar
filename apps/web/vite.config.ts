import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/v1/students') ||
              url.pathname.startsWith('/api/v1/classes') ||
              url.pathname.startsWith('/api/v1/staff'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ep-entity-cache',
              expiration: { maxAgeSeconds: 86400, maxEntries: 50 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1/attendance'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ep-attendance-cache',
              networkTimeoutSeconds: 4,
              expiration: { maxAgeSeconds: 3600 },
            },
          },
        ],
      },
      manifest: {
        name: 'EduPortal',
        short_name: 'EduPortal',
        description: 'School management for Pakistan',
        theme_color: '#0F172A',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
