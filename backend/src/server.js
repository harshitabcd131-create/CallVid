import "../instrument.mjs";//importing this file will initialize sentry for error monitoring and performance monitoring
import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";   
import chatRoutes from "./routes/chat.route.js";

import * as Sentry from "@sentry/node"


const app =express();

app.use(express.json())//middleware to parse json data in request body

app.use(clerkMiddleware())//req auth will be available in the request object

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

