
// context/Web3Modal.tsx

'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// Your WalletConnect Cloud project ID
export const projectId = process.env.WALLETCONNECT_API || '';

// 2. Set chains
const testnet = {
  chainId: 1,
  name: 'Mode-testnet',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.explorer.mode.network/',
  rpcUrl: 'https://sepolia.mode.network/'
}

// 3. Create a metadata object
const metadata = {
  name: 'swap?Conditional',
  description: 'Swap?Conditional',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})
// @ts-ignore//
export function Web3Modal({ children }) {
  return children
}