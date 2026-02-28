
import { StreamChat } from "stream-chat"
import { ENV } from "./env.js";

const streamClient =  StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export const upsertStreamUser = async (userData)=>{
    try{
         await streamClient.upsertUser(userData)
         console.log("Stream user upserted successfully",userData.name)
         return userData
    }catch(error){
        console.error("error upserting  stream usrer",error)
    }
    
};

export const deleteStreamUser = async (userId)=>{
    try{
        await streamClient.deleteUser(userId);
        console.log("Stream user deleted successfully",userId)

    }catch(error){
        console.error("error deleting stream user",error)
    }
};

export const generateStreamToken =(userId)=>{
    try{
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);

    }catch(error){
        console.log("error generating stream token",error);
        return null;
    }
}


