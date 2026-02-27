import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";


const app =express();



app.get("/",(req,res)=> {
    res.send("hello worldl")
});


app.listen(ENV.PORT,()=>{
    
    console.log("server is running on port: ",ENV.PORT)
    connectDb()

})

