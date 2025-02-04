import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/tasks': 'http://localhost:5000',
      '/add-task': 'http://localhost:5000',
      '/delete-task': 'http://localhost:5000',
      '/edit-task': 'http://localhost:5000',
    },
  },
})