import * as Sentry from "@sentry/node" 
import { ENV } from "./src/config/env.js";


Sentry.init({
    dsn: ENV.SENTRY_DSN, // Fixed typo: SENTRY_DSN
    tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring. Adjust in production!
    profilesSampleRate: 1.0, // Capture 100% of profiles for performance monitoring. Adjust in production!
    environment: ENV.NODE_ENV || "development",
    // Only include local variables in non-production environments
    includeLocalVariables: ENV.NODE_ENV !== "production",
    // Only send PII if explicitly opted in via env var
    sendDefaultPii: Boolean(process.env.ENABLE_SENTRY_PII === "true"),
});