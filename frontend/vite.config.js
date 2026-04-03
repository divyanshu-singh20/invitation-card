import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // server config for local dev only; not used in production
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});