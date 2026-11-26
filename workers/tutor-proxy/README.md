# PyVerse AI Tutor Cloudflare Worker Proxy

Rate-limited serverless proxy for PyVerse AI Tutor so `GEMINI_API_KEY` stays secret on Cloudflare Workers instead of the browser.

## Deploy

```bash
cd workers/tutor-proxy
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

Then set `VITE_TUTOR_PROXY_URL` to your deployed Worker URL (for example `https://pyverse-tutor-proxy.your-subdomain.workers.dev`) in your build environment / GitHub Actions variables.
