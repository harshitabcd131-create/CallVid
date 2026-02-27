import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
     email:{
        type:String,
        required:true,
        unique:true,
     },
     name:{
        type:String,
        required:true
     },
     image:{
        type:String,
        required:true,
     },
     clerkId:{
        type:String,
        required:true,
        unique:true,
     }
},{timestamps:true}
)

export const User=mongoose.model("User",userSchema);