import * as Sentry from "@sentry/node" 
import { ENV } from "./src/config/env.js";


Sentry.init({
    dsn: ENV.SENTRY_DNS,
    tracesSampleRate: 1.0,// Capture 100% of transactions for performance monitoring. Adjust in production!
    profilesSampleRate: 1.0,// Capture 100% of profiles for performance monitoring. Adjust in production!
    environment: ENV.NODE_ENV || "development",
    includeLocalVariables: true, // Include local variables in Sentry error reports
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});