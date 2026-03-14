import "../instrument.mjs";//importing this file will initialize sentry for error monitoring and performance monitoring
import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";   
import chatRoutes from "./routes/chat.route.js";
import cors from "cors";
import * as Sentry from "@sentry/node"


const app =express();

app.use(express.json()); // middleware to parse json data in request body

// CORS setup
// - We allow the configured CLIENT_URL (production frontend)
// - We also allow localhost for local dev
// - We support Vercel preview deployments (which use dynamic subdomains)
const normalizeOrigin = (origin) => origin?.replace(/\/+$/, "");
const allowedOrigins = [
  normalizeOrigin(ENV.CLIENT_URL),
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (e.g., Postman, server-to-server)
      if (!origin) return callback(null, true);

      const normalized = normalizeOrigin(origin);

      // allow configured origins
      if (allowedOrigins.includes(normalized)) return callback(null, true);

      // allow Vercel preview domains (dynamic subdomains)
      if (normalized?.endsWith(".vercel.app")) return callback(null, true);

      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
); // enable CORS for frontend (with credentials)

app.use(clerkMiddleware()); // req auth will be available in the request object

if (process.env.NODE_ENV !== "production") {
    app.get("/debug-sentry", (req, res) => {
        throw new Error("Sentry error test");
    });
}

app.get("/",(req,res)=> {
    res.send("hello worldl")
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/chat",chatRoutes);

Sentry.setupExpressErrorHandler(app);



const startServer=async()=>{
    try{
        await connectDb();
        if(ENV.NODE_ENV!=="production"){
            app.listen(ENV.PORT,()=>{
                console.log(`server is running on port ${ENV.PORT}`)
            });
        }
    } catch(error){
        console.error("error starting the server",error);
        process.exit(1);//Status code 1 indicates error and status code 0 indicates success
    }    
};

startServer();

export default app;

