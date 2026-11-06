# 🏛️ VELTRON // Bespoke Royal Luxury Autonomous Financial Ecosystem
> *Beyond Finance. A New Sovereign Era.*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-C6A477?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini%20App%20(TMA)-26A5E4?style=for-the-badge&logo=telegram)](https://telegram.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![OWASP Top 10](https://img.shields.io/badge/OWASP-Top%2010%20Verified-00E599?style=for-the-badge)](https://owasp.org/)

---

## 👑 About VELTRON

**VELTRON** is an ultra-exclusive, institutional-grade FinTech & Wealth Intelligence Platform. Engineered with an Italian High-Horology and Milanese Private Banking aesthetic, VELTRON unifies:

- 🏛️ **Bespoke Royal Luxury Experience:** Italian Elegance visual identity utilizing Espresso Noir (`#120A08`), Antique Gold (`#C6A477`), Deep Burgundy (`#54252D`), Warm Ivory (`#FAF7F1`), and Cormorant Garamond typography.
- 📱 **Telegram Mini App (TMA):** Native in-app financial terminal with haptic feedback, real-time live quotes, and paper trading simulations inside Telegram.
- 🤖 **Autonomous AI Financial Copilot:** Real-time quantitative risk assessment, algorithmic coaching, and portfolio optimization powered by Google Gemini.
- 💼 **$100,000 Paper Trading Simulator:** Virtual quantitative execution engine with order book depth, stop-loss triggers, and position performance tracking.
- 🗄️ **Supabase Cloud Backend:** Managed PostgreSQL database with Supavisor transaction connection pooling, Row-Level Security (RLS), and real-time subscriptions.
- 🛡️ **Zero-Trust Cybersecurity Hub:** SOC Operations Hub, tamper-evident SHA-256 audit ledger, AES-256-GCM envelope encryption, and PCI-DSS zero-storage compliance.

---

## 🏛️ 1. Platform Modules & Route Directory

VELTRON comprises 18 fully integrated functional modules with Bespoke Royal Luxury aesthetics:

| Route | Module Name | Capabilities & Core Architecture |
|---|---|---|
| **`/`** | **Landing Page** | Neoclassical architecture, 3D WebGL horology journey, live ticker stream, bespoke feature matrix. |
| **`/tma`** | **Telegram Mini App** | Full-screen sovereign terminal inside Telegram with native tabs, haptics, and instant live trading. |
| **`/login`** | **Private Banking Gate** | Argon2id verification, Google OAuth 2.0, Telegram authentication, and brute-force mitigation. |
| **`/register`** | **Client Onboarding** | Milanese wealth account creation with Zod validation, entropy scoring, and automated portfolio provisioning. |
| **`/dashboard`** | **Wealth Dashboard** | High-net-worth portfolio overview, asset allocation, monthly cashflows, and balance privacy controls. |
| **`/portfolio`** | **Portfolio Hub** | Comprehensive multi-asset holdings table, real-time NAV charts, and performance telemetry. |
| **`/trading`** | **Paper Trading Simulator** | $100,000 virtual balance trading terminal with market/limit order books and P&L analytics. |
| **`/terminal`** | **Institutional Terminal** | High-density quantitative financial trading interface for institutional professionals. |
| **`/markets`** | **Market Intelligence** | Multi-asset quotes (BTC, ETH, Spot Gold XAU, NVDA, TSLA, Forex, CBU exchange rates). |
| **`/wallet`** | **Horological Vault Wallet** | High-yield vaults, crypto custody accounts, and card tokenization. |
| **`/transactions`** | **Ledger & Statements** | Double-entry financial records with status filtering, search, and CSV/PDF export. |
| **`/ai-assistant`** | **AI Financial Copilot** | Algorithmic wealth advisor powered by Google Gemini for strategy suggestions and portfolio audit. |
| **`/ai-coach`** | **Executive AI Coach** | Tailored institutional investment guidance and psychological risk discipline coach. |
| **`/education`** | **Academy of Finance** | Interactive courses (Horology, Macroeconomics, Quantitative Trading) with XP rewards. |
| **`/news`** | **Global Financial News** | Curated institutional financial dispatches with strict source attributions. |
| **`/settings`** | **Security & Profile Settings** | 2FA management, Telegram alerts webhook, multi-currency switcher, and active sessions. |
| **`/admin`** | **Governance & SOC Hub** | Central Security Operations Center, real-time SIEM telemetry, and SHA-256 audit ledger. |

---

## 🗄️ 2. Supabase Cloud Backend Integration

VELTRON is natively configured for **Supabase Managed PostgreSQL**:

1. **Database Schema:** Located at [`supabase/schema.sql`](./supabase/schema.sql) — 1,200+ lines of production-grade DDL defining all tables, enums, foreign keys, and indexes.
2. **Connection Pooling:** Configured with Prisma ORM using Supavisor (Port 6543) for serverless queries and direct connections (Port 5432) for migrations:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
3. **Supabase Client SDK:**
   - Browser client: `src/lib/supabase/client.ts`
   - Server admin client: `src/lib/supabase/server.ts`

For setup instructions, see the [Supabase Guide](./supabase/README.md).

---

## 🤖 3. Official Telegram Bot (`@VeltronAI_Bot`)

The Telegram Bot engine (`scripts/telegram-bot-runner.ts`) operates autonomously with:
- **Telegram Mini App (TMA):** Telegram launches `/tma` directly inside the app with full WebApp SDK integration.
- **Persistent Bottom Keyboard & Menu Button:** Quick-access trading, portfolio, academy quizzes, and AI prompt.
- **In-Bot Virtual Trading:** Simulated BUY/SELL orders with receipt generation.
- **Financial Academy Quizzes:** Interactive financial trivia with XP progression.

---

## 🚀 4. Quick Start & Local Development

### Prerequisites:
- Node.js 20+ (LTS)
- Supabase PostgreSQL account or local PostgreSQL
- Telegram Bot Token from `@BotFather`

### Installation:
```bash
# 1. Clone the repository
git clone https://github.com/shomuhammad-dev-cyber/VELTRON.git
cd VELTRON

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Add your Supabase and Telegram Bot credentials in .env.local

# 4. Initialize Database
npm run postinstall
npm run prisma:migrate

# 5. Start Development Server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the VELTRON Sovereign Terminal.

---

## 🔒 5. Cybersecurity & Compliance Standards

- **Zero SAD Storage:** Full PCI-DSS compliance. Never stores CVV, PIN, or raw payment keys.
- **Argon2id Key Derivation:** High-memory cryptographic hashing with unique random salts.
- **Row-Level Security (RLS):** Database-enforced isolation per tenant.
- **Automated SOC Audits:** Tamper-evident cryptographic ledger chained with SHA-256 blocks.

---

## 🏛️ License
All rights reserved © 2026 VELTRON Technologies Inc. Proprietary & Confidential.
