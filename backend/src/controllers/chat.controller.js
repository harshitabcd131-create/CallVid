import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = async(req,res)=>{
    try{
        const Token = await generateStreamToken(req.auth().userId);
        
        res.status(200).json({Token});
    }catch(error){
        console.log("error generating stream token",error)
        res.status(500).json({
            message:"Failed to generate stream token"
        })
    }
}