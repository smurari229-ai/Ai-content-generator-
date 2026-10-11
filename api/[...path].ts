import { createRequire } from "node:module";
import type { Express } from "express";

// The build script bundles the server as dist/server.cjs. Vercel must include
// that artifact in this function; importing server.ts directly is not reliable
// because the source file is not copied into the serverless runtime by default.
const require = createRequire(import.meta.url);
const serverModule = require("../dist/server.cjs") as { default?: Express } & Express;
const app = (serverModule.default ?? serverModule) as Express;

export default app;
