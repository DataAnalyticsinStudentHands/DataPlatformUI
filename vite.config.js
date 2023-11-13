import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls } }), vuetify()],
  base: '/platform/',
  build: {
    outDir: "build"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
