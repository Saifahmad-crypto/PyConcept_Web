<div align="center">

# PyVerse — Think. Code. Experiment.

**An Interactive Visual Python Learning Universe for 1st-Year Engineering Students & Beginners.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-E10906?style=for-the-badge)](https://saifahmad-crypto.github.io/PyConcept_Web/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br />

<img src="src/assets/images/hero_pyverse_workspace_1795678622030.webp" alt="PyVerse Workspace" width="880" />

</div>

---

## Live App

**[https://saifahmad-crypto.github.io/PyConcept_Web/](https://saifahmad-crypto.github.io/PyConcept_Web/)** — Runs 100% in your browser with zero Python installation required.

---

## Features

- **15+ Live Simulators (2D & 3D):** Watch Python code drive real-world systems in real time — Traffic Signal, ATM Decision, Smart AC, Multi-Floor Elevator, Cash Counter, Parking Scanner, FizzBuzz, Grade Calculator, and more — toggle between crisp 2D dashboards and interactive 3D scenes.
- **150+ Interactive Quizzes:** B.Tech semester & GATE-style MCQs across Basics, Conditionals, and Loops with difficulty filters (`Easy`, `Medium`, `Hard`), 30s Timed Mode, Mixed Sprints, and Wrong-Answer Review.
- **60+ Lab Coding Challenges:** Hands-on programming problems verified against automated test cases (including boundary & edge cases) with solution insights.
- **30+ Bug Hunt Challenges:** Spot and fix syntax, indentation, off-by-one, wrong operator, `elif` order, `break`/`continue`, and infinite-loop bugs.
- **Mini-Games & Escape Vaults:** Practice logic through interactive mini-games and multi-room Python Code Vault Escape Rooms.
- **Coding Studio & Visual Labs:** Write and run real Python in the browser (Fast Engine + Pyodide), explore variable memory references, step through line-by-line execution, and build live SVG flowcharts.
- **Offline-Ready PWA:** Installable as a Progressive Web App; core lessons, simulators, quizzes, and challenges work offline.
- **Bilingual (English + Hinglish):** Instant **EN / हिंग्लिश** toggle across the landing page and learning workspace.
- **XP, Streaks & Certificates:** Track daily streaks, earn XP, and generate verifiable completion certificates.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling & Motion:** Tailwind CSS v4, Motion (`motion/react`), Lucide Icons
- **3D Visualization:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Python Runtimes:** Custom Fast Execution Engine (AST/trace) + Pyodide (in-browser WebAssembly Python)
- **Offline Support:** `vite-plugin-pwa` (Workbox)
- **AI Tutor Proxy:** Cloudflare Worker (`workers/tutor-proxy`) + `@google/genai`

---

## Local Setup

**Prerequisites:** Node.js (v20+)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Verify all quizzes, challenges & bug hunts
npm run verify:content

# 4. Build for production
npm run build
```

---

## AI Tutor Proxy Setup (`workers/tutor-proxy`)

To keep your `GEMINI_API_KEY` secure on the server side instead of exposing it in the browser, PyVerse uses a lightweight Cloudflare Worker proxy in [`workers/tutor-proxy`](workers/tutor-proxy):

```bash
cd workers/tutor-proxy
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

Then set `VITE_TUTOR_PROXY_URL` to your deployed Worker URL (e.g., `https://pyverse-tutor-proxy.your-subdomain.workers.dev`) in your `.env.local` or GitHub Actions environment variables.

---

## License & Creator

- **License:** [MIT License](LICENSE)
- **Created by:** **Saif Ahmad** — [GitHub](https://github.com/saifahmad-crypto) · [LinkedIn](https://www.linkedin.com/in/saif-ahmad-tech) · [X (@Saif4hmad)](https://x.com/Saif4hmad)
