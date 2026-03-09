import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { generateToken } from "../lib/api";
import * as Sentry from "@sentry/react";
export const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

//this hook is used to connect the user to stream chat api
//so that the user can see each others messages, send messages to eachother and get real time updates
//it also handles the disconnection when the user leaves the page 

export const useStreamChat = () => {
    const { user } = useUser();
    const [chatClient, setChatClient] = useState(null);

    //fetch stream token using react-query

    const { data: tokenData, isLoading, error } = useQuery({
            queryKey: ["streamToken"],
            queryFn: generateToken,
            enabled: !!user?.id,//this will take the object and convert it to boolean 
        })
     //init stream chat client    
     useEffect(()=>{
       
       let localClient = null;
       const initChat = async()=>{
        if(!tokenData?.token || !user ) return;

        try{
           localClient = StreamChat.getInstance(STREAM_API_KEY);
           await localClient.connectUser({
             id: user.id,
             name: user.fullName,
             image: user.imageUrl
           }, tokenData.token);
           setChatClient(localClient);
        } catch(error){
           Sentry.captureException(error,{
            tags:{component:"useStreamChat"},
            extra:{
                context:"Stream_chat_connection",
                userId:user?.id,
                streamApiKey:STREAM_API_KEY ? "present" : "missing"

            }

          })
        }

       }

       initChat();
       //cleanup function to disconnect the chat client when the component unmounts or when the user changes
       return()=>{if (localClient) localClient.disconnectUser()}
       
     },[tokenData,user])

     return{chatClient, isLoading, error}
}
