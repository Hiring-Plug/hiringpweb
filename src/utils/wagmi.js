import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  bsc,
} from 'wagmi/chains';

import { http } from 'wagmi';

// Replace with a valid WalletConnect Project ID for production
const ENV_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const projectId = ENV_PROJECT_ID || 'c53925c22730d49169fb793cf786d50b'; 

console.log("Wagmi/RainbowKit initializing with Project ID:", projectId ? "Present" : "MISSING");
if (!projectId) {
  console.warn("WalletConnect Project ID is missing. MetaMask/WalletConnect may not function correctly.");
}

export const config = getDefaultConfig({
  appName: 'Hiring Plug',
  projectId: projectId,
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
  ssr: false,
  // Set to true if using Next.js, false for Vite/CRA
});
