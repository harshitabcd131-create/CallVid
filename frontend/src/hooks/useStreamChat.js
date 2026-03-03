import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
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

    const { data: tokenData, isLoading: tokenLoading, error: tokenError } = useQuery({
            queryKey: ["streamToken"],
            qureyFn: generateToken,
            enabled: !!user?.id,//this will take the object and convert it to boolean 


        })

     //init stream chat client    
     useEffect(()=>{
       const initChat = async()=>{
        if(!tokenData?.token || !user ) return;

        try{
           const client = StreamChat.getInstance(STREAM_API_KEY);
           await client.connectUser({
             id: user.id,
             name: user.fullName,
             image: user.imageUrl
           })
           setChatClient(client)

        }catch(error){
          console.log("error connecting to stream chat",error)
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
       //cleanu function to disconnect the chat client when the component unmounts or when the user changes
       return()=>{if (chatClient) chatClient.disconnectUser()}
       
     },[tokenData,user,chatClient])

     return{chatClient, isLoading: tokenLoading, error: tokenError}
}
