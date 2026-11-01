# TRANSIT SENSE | AI-Powered Indian Urban Traffic Intelligence Platform

An enterprise-grade Intelligent Transportation System (ITS) architected for Indian metropolitan traffic corridors. Built to MoRTH Integrated Command & Control Center (ICCC) specifications, powered by **NVIDIA TensorRT YOLOv11** and **ByteTrack Multi-Object Tracking (MOT)**.

---

## 1. Aesthetic Design System
- **Primary Canvas / Background**: `#FFFFFF` (Crisp, clean pure white — strictly no dark themes).
- **Primary Aesthetic Accent**: `#8B0000` (Deep Royal Crimson Red for critical alerts and core branding).
- **Secondary Aesthetic Accent**: `#D4AF37` (Warm Metallic Gold for badges, accents, and borders).
- **Typography**: `#1A1A1A` (Primary text) and `#555555` (Secondary captions) with Google Fonts `Plus Jakarta Sans`, `Inter`, and `JetBrains Mono`.
- **3D Depth & Visuals**: Subtle CSS 3D card tilt effects (`transform-style: preserve-3d`) and ambient Three.js 3D floating sensor node particles.

---

## 2. Monorepo File Structure (Vibe Coding Friendly)

```text
transit-sense/
├── index.html                  # Self-contained production UI with Leaflet, Chart.js, Three.js
├── .env.example                # Safe environment variable template with zero exposed secrets
├── .gitignore                  # Prevents committing .env, node_modules, keys, and weights
├── README.md                   # Setup guide, deployment steps, & architecture specs
├── docker-compose.yml          # Container configuration for API, Redis, PostGIS, & ML Engine
│
├── apps/
│   ├── web/                    # Frontend (React / Tailwind / Three.js / Leaflet)
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── videos/         # Real traffic CCTV video loops
│   │   ├── src/
│   │   │   ├── components/     # Header, StreamCanvas, MapHub, ViolationsFeed
│   │   │   ├── hooks/          # useTrafficStream, useLeafletMap
│   │   │   └── utils/          # exportGeoJSON, exportCSV
│   │   └── package.json
│   │
│   └── api/                    # Hardened Backend Proxy & ML Inference Gateway
│       ├── src/
│       │   ├── config/         # env.js (Validated via Zod / dotenv)
│       │   ├── middleware/     # rateLimiter.js, authGuard.js, corsConfig.js
│       │   ├── routes/         # telemetry.js, streams.js, export.js
│       │   └── index.js        # Server entry point with Helmet CSP
│       └── package.json
│
└── ml_engine/                  # Inference Pipeline
    ├── models/                 # TensorRT YOLOv11 & ByteTrack weights
    ├── inference_proxy.py      # Stream processor with RTSP credential masking
    └── requirements.txt
```

---

## 3. Production Security & DevSecOps Hardening

1. **Zero Hardcoded Keys & Secret Guardrails**:
   - Zero plain-text credentials or API keys stored in client code or Git.
   - Comprehensive `.gitignore` blocks `.env`, `.env.*`, `*.pem`, `*.key`, and model checkpoints.
2. **Rate Limiting & Anti-DDoS Protection**:
   - IP-based sliding-window rate limiting via Redis (`express-rate-limit`) enforces max 100 requests/minute per client IP.
3. **Strict CORS Whitelist**:
   - Cross-Origin Resource Sharing restricted strictly to trusted domains (`https://transitsense.gov.in`). Wildcards (`*`) are disallowed.
4. **RTSP Stream Sanitization**:
   - Camera login credentials and private IPs are stripped on the backend. The frontend receives TLS-encrypted proxy endpoints (`rtsps://gateway.transitsense.gov.in:443/hls/...`).
5. **Input Sanitization & Injection Prevention**:
   - Indian vehicle registration plates validated against strict regex (`^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$`).
   - CSV export fields stripped of formula injection prefixes (`=`, `+`, `-`, `@`).

---

## 4. Quick Start & Local Run

### Option A: Open the Self-Contained Frontend UI
Open `index.html` directly in any modern browser, or run via Vite:
```bash
npm run dev
```
Navigate to `http://localhost:5173/`.

### Option B: Run Full Production Stack with Docker Compose
```bash
cp .env.example .env
# Edit .env with your deployment passwords
docker-compose up --build -d
```
The hardened API gateway starts on port `8080` with PostGIS on `5432` and Redis on `6379`.
