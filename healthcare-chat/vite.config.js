import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          kendo: ['@progress/kendo-react-buttons', '@progress/kendo-react-dateinputs', '@progress/kendo-react-dropdowns', '@progress/kendo-react-inputs', '@progress/kendo-react-intl', '@progress/kendo-react-layouts', '@progress/kendo-react-popup', '@progress/kendo-react-progressbars', '@progress/kendo-react-dateinputs', '@progress/kendo-react-grid', '@progress/kendo-react-notification', '@progress/kendo-react-dialogs']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
