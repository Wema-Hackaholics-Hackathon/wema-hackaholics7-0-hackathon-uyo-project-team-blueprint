# Traka — Smarter bookkeeping for Nigeria's micro-SMEs

## Team Members

- [Abasiofon Sendan](https://github.com/abasiofon-sendan)
- [Covenant Monday](https://github.com/covenantmondei)
- [Idighekere Udo](https://github.com/Idighekere)
- [Unwana Edet](https://github.com/lightnonstop)
- [Joshua Udom](https://github.com/udomjosh04-uj)

---

## 🚀 Live Demo

- **Live Application:** [Link to your deployed Vercel/Netlify/Render URL]
- **Backend API:** [Link to your live backend API endpoint URL, if separate]
- **Recorded Demo:** [Link to your recorded demo explaining how your solution works using Loom].

---

## 🎯 The Problem

What is stopping people from fully participating in the formal financial system, and how can your solution solve or remove that barrier?

## ✨ Our Solution

We are building a cash‑friendly, ledger‑first rail that turns everyday informal sales into a trusted digital record — without forcing people to stop using cash.
Key idea:

- People keep taking cash the way they do today.
- Each day’s sales (cash + transfers) are logged in a simple self‑service flow (app).
- That system builds a business ledger for each person: total sales, customers, frequency, patterns.
- Over time, this ledger becomes a “financial CV” that banks and lenders can trust.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** FastAPI, SQLAlchemy
- **Database:** SQLite (local dev)
- **State & Data:** TanStack Query, TanStack Router
- **Animation:** Motion (Framer Motion)
- **AI/APIs:** Google Gemini (product image extraction), Groq (voice assistant)
- **PWA:** vite-plugin-pwa
- **Deployment:** Vercel (frontend), Railway (backend)

---

## ⚙️ How to Set Up and Run Locally

_Briefly explain the steps to get your project running on a local machine._

### Frontend

1. Navigate to the **frontend** directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (the project uses `bun`):
   ```bash
   bun install
   ```
3. Create a `.env.local` file with the API base URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```

### Backend

1. Navigate to the **backend** directory:
   ```bash
   cd backend
   ```
2. Install dependencies with `uv` (a `uv.lock` is provided):
   ```bash
   uv sync
   ```
3. Create a `.env` file in `backend/` with your API keys. The voice assistant requires a Groq key:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```
   (Add a Gemini key if you use the product image extraction feature.)
4. Run the API with Uvicorn:
   ```bash
   uv run uvicorn main:app --reload --port 8000
   ```

The frontend expects the backend at `http://localhost:8000` by default (set `VITE_API_URL` to match your backend if different).
