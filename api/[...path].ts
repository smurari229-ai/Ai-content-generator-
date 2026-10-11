import app from "../server.ts";

// Route all /api/* requests through the existing Express handlers.
// Keep the TypeScript extension explicit so Vercel Node.js ESM resolves the module at runtime.
export default app;
