import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Use automatic JSX runtime for production optimizations
      jsxRuntime: 'automatic',
    })
  ],
  base: '/',
  build: {
    // Optimize for production using default esbuild minifier
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large dependencies into their own chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore'],
        },
      },
    },
  },
})