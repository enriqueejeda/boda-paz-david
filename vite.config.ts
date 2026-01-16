import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: 'terser',
    sourcemap: false,
    cssMinify: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            } else if (id.includes('react')) {
              return 'react-vendor';
            } else if (id.includes('lucide')) {
              return 'lucide';
            } else {
              return 'vendor';
            }
          }
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        arguments: true,
        toplevel: true,
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  server: {
    middlewareMode: false,
  }
})
