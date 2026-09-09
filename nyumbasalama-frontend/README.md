# NyumbaSalama Frontend

Next.js frontend for the NyumbaSalama student accommodation platform.

## Local Development

Set the backend URL in `.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The NyumbaSalama AI widget uses `POST /api/ai/chat`, displays database-backed recommendations, and renders returned OpenStreetMap/OSRM markers and routes.

## Verification

```bash
npm run build
npx tsc --noEmit --incremental false
```
