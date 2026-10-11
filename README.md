# AI Monetization & Task Planner

A Hindi-first React application for exploring monetization ideas, building step-by-step roadmaps, generating AI-assisted short-form content, and optionally syncing tasks with Google Tasks.

## Current capabilities

- Browse monetization ideas and filter by category.
- Create and save personal roadmaps in browser storage.
- Generate content plans and video-scene drafts using Gemini when an API key is configured.
- Use deterministic fallback templates when the AI service is unavailable; fallback output is not a guarantee of factual accuracy or earnings.
- Connect Google Tasks using Google Identity Services. Configure the authorized JavaScript origin and OAuth consent settings in Google Cloud before using this integration.

## Requirements

- Node.js 22 or newer
- A Gemini API key for live AI generation (the app can render its non-AI UI without one)

## Local development

```sh
npm install
npm run dev
```

Open the local URL printed by Vite/Express (the server currently listens on port 3000).

## Production build

```sh
npm run lint
npm run build
npm start
```

The production server serves the built Vite assets and the API from the same Express process.

## Environment

Set `GEMINI_API_KEY` in the server environment. Never prefix this secret with `VITE_`, commit it to Git, or expose it to browser code. Google Tasks uses the client ID configured in `src/services/googleTasksService.ts`; that ID is public client configuration, but OAuth consent and authorized origins still need to be configured in Google Cloud.

## Important limitations

- Content generation is AI-assisted and can fall back to templates when the API is unavailable.
- Suggested earning ranges and timelines are illustrative, not verified forecasts or guarantees.
- Google Tasks integration requires user authorization and correct OAuth configuration.
- This project does not automatically publish to social platforms or guarantee income.

## Verification

GitHub Actions runs TypeScript checking and a production build on pull requests and pushes to the main branch or fix branches.
