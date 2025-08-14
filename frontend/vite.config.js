import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunk splitting for better performance
        manualChunks: {
          // Vendor chunks - third-party libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Tree shaking for unused code
    minify: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
  },
})
