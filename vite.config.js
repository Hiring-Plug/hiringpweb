import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Accommodate large Web3 vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          web3: ['wagmi', 'viem', '@rainbow-me/rainbowkit', '@tanstack/react-query'],
          coinbase: ['@coinbase/wallet-sdk'],
          reown: ['@reown/appkit', '@reown/appkit-controllers'],
        },
      },
    },
  },
})
