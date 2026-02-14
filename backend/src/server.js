import express from "express";
import { ENV } from "./config/env.js";


const app =express();



app.get("/",(req,res)=> {
    res.send("hello worldl")
});

console.log("mongo uri:",ENV.MONGO_URI)

app.listen(ENV.PORT,()=>{
    console.log("server is running on port: ",ENV.PORT)
})

