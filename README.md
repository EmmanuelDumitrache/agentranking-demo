# 8004scanner — ERC-8004 AI Agent Discovery & Ranking Platform (Demo)

A lightweight, self-contained discovery, verification, and launchpad platform for **ERC-8004 AI Agents** across Ethereum, Base, and Sepolia. Built for zero-config deployment on **Netlify** or **Vercel**.

## ✨ Key Features

- **Live Agent Discovery & Rankings (`/`, `/hot`, `/new`, `/top`)**
  - Deterministic ranking algorithm combining Reputation Score, 24h Call Volume, and Success Rate.
  - Multi-dimensional filtering by Chain (`Ethereum`, `Sepolia`), Protocol (`MCP`, `A2A`, `OASF`), Trust Method (`On-chain`, `Off-chain`, `Hybrid`), Skills, Domains, X402 payment support, and Watchlist favorites.
- **7-Step ERC-8004 Agent Creator (`/create`)**
  - Interactive wizard to configure Agent Info, MCP/A2A/OASF Endpoints, Capabilities, Trust Mechanisms, and Metadata Storage (Base64 Data URI, IPFS, HTTPS).
  - Includes **1-Click "Prefill Demo Agent"** and **"Launch Agent (Instant Demo)"** so reviewers can test the full end-to-end registration flow without needing a funded testnet wallet.
  - Newly launched agents persist in local state, render their custom profile at `/agent/[id]`, and appear in the main Discovery table.
- **Rich Agent Detail & Telemetry View (`/agent/[id]`)**
  - **Overview**: Statistics summary, EIP-712 Contract State, active service endpoints, on-chain/off-chain metadata, capabilities, timestamps, and recent validator proofs.
  - **Reputation**: Dual-axis 7-day Recharts trend (Reputation Score + Call Volume) and event timeline.
  - **Feedback**: Interactive community review form allowing instant submission of ratings and comments.
  - **Validation**: Cryptographic TEE, Crypto-Economic, and Reputation Consensus attestations.
- **Know Your Agent (`/kya`) & Live Verifier (`/verification`)**
  - Interactive ERC-8004 registration and KYA attestation inspector for any Agent ID (including newly created demo agents).
- **Agent Promotion Flow (`/promote`)**
  - Multi-token promotion flow (`ETH`, `USDC`, `SOL`) with a **"Use Demo Transaction"** generator that verifies via `/api/promotions` and attaches `Featured` or `Hot` badges across the rankings.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling & UI**: Tailwind CSS + Radix UI primitives + Lucide Icons
- **Data Visualization**: Recharts (dual-axis composed charts)
- **State Management**: React Context + Zustand (`localStorage` persistence for created agents, watchlist, feedback, and promotions)
- **Web3 / ERC-8004**: Viem + Wagmi + RainbowKit (with instant wallet-free Demo Mode fallback)

## 🚀 Running Locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🌐 Deploying to Netlify

This project includes a preconfigured [`netlify.toml`](./netlify.toml) and requires **zero external environment variables** to run in demo mode:

1. Push this folder to a GitHub repository (or run `npx netlify-cli deploy --prod`).
2. In Netlify, import the repository—Netlify will automatically detect `npm run build` and `NPM_FLAGS="--legacy-peer-deps"`.
3. Click **Deploy site**.
