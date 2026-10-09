import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuracion de Vite para el proyecto React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
