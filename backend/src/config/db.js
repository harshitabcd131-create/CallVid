import mongoose, { createConnection, modelNames } from "mongoose"
import { ENV } from "./env.js"

export const connectDb=  async()=>{

    try{
        const conn= await mongoose.connect(ENV.MONGO_URI);
        console.log("mongoDB connected successfully",conn.connection.host) 
    }
    catch(error){
        console.log("mongoDB not connected ",error)
        process.exit(1)//Status code 1 indicates error and status code 0 indicates success

    }
}