

import './App.css'
import React from 'react'
import {
  http,
  createConfig,
  WagmiProvider,
  useConnect,
  useAccount,
  useBalance,
  useDisconnect,
  useSendTransaction,
} from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { parseEther } from 'viem'

// ✅ Setup
const queryClient = new QueryClient()
const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
})

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div style={styles.app}>
          <h1 style={styles.heading}>🚀 Ethereum Wallet DApp</h1>
          <WalletOptions />
          <Account />
          <SendTransaction />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// ✅ Wallet Connection
function WalletOptions() {
  const { connectors, connect } = useConnect()

  return (
    <div style={styles.card}>
      <h2 style={styles.subHeading}>Connect Wallet</h2>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          style={styles.button}
        >
          Connect with {connector.name}
        </button>
      ))}
    </div>
  )
}

// ✅ Account Info
function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const balance = useBalance({ address })

  return (
    <div style={styles.card}>
      <h2 style={styles.subHeading}>Account Info</h2>
      {address && (
        <div style={styles.infoText}>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance.data?.formatted} ETH</p>
        </div>
      )}
      <button onClick={disconnect} style={{ ...styles.button, backgroundColor: '#e74c3c' }}>
        Disconnect
      </button>
    </div>
  )
}

// ✅ Send Transaction
function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction({
    mutation: {
      onError: (error) => {
        alert("Transaction error: " + error.message)
      },
    },
  })

  const sendTx = () => {
    const to = document.getElementById('to').value.trim()
    const value = document.getElementById('value').value.trim()

    if (!to || !value) {
      alert("Please fill in both address and value.")
      return
    }

    try {
      sendTransaction({ to, value: parseEther(value) })
    } catch (error) {
      console.error("Transaction error:", error)
    }
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.subHeading}>Send ETH</h2>
      <input id="to" placeholder="Recipient Address" style={styles.input} />
      <input id="value" placeholder="Amount in ETH" style={styles.input} />
      <button onClick={sendTx} style={styles.button}>
        Send
      </button>
      {hash && (
        <div style={styles.txHash}>
          <strong>Tx Hash:</strong> {hash}
        </div>
      )}
    </div>
  )
}


export default App

// ✅ Inline Styles
const styles = {
  app: {
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#121212',
    color: '#f0f0f0',
    minHeight: '100vh',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  },
  heading: {
    fontSize: '2rem',
    color: '#ffa500',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#ffa500',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '25px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    backgroundColor: '#ffa500',
    color: '#000',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #555',
    backgroundColor: '#2c2c2c',
    color: '#fff',
  },
  infoText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  txHash: {
    wordBreak: 'break-word',
    backgroundColor: '#2a2a2a',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
}
