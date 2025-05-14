/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Pages from 'vite-plugin-pages'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  },
  plugins: [
    vue(),
    legacy(),
    Pages({
      pagesDir: [
        {dir: './src/views', baseRoute: ''},
      ],
      extensions: ['vue'],
      syncIndex: true,
      replaceSquareBrackets: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
