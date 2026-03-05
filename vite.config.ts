import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "prompt",

      includeAssets: [
        "favicon.png",
        "icon-192.png",
        "icon-512.png",
        "splash.png"
      ],

      manifest: {
        name: "Cotix",
        short_name: "Cotix",
        description: "Cotix - Presupuestos técnicos rápidos",

        theme_color: "#1d4ed8",
        background_color: "#1d4ed8",

        display: "standalone",
        start_url: "/",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document",

            handler: "NetworkFirst",

            options: {
              cacheName: "html-cache"
            }
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",

            handler: "StaleWhileRevalidate",

            options: {
              cacheName: "assets-cache"
            }
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "image",

            handler: "CacheFirst",

            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 60
              }
            }
          }
        ]
      }
    })
  ]
});