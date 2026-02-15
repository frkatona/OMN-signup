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
  },
})