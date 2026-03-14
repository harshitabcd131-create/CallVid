import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useUser } from "@clerk/clerk-react"
import toast from "react-hot-toast"

import "@stream-io/video-react-sdk/dist/css/styles.css";


import { generateToken } from "../lib/api"

import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,

} from "@stream-io/video-react-sdk";



const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {

  const { id: callId } = useParams();
  const { user, isLoaded } = useUser()

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: generateToken,
    enabled: !!user
  })

  useEffect(() => {
    let videoClient = null;
    let callInstance = null;

    const initCall = async () => {
      if (!tokenData?.token || !user || !callId) return
      
      try {
        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl
            
          },
          token: tokenData.token
        })
        
        callInstance = videoClient.call("default", callId)
        await callInstance.join({ create: true })

        setClient(videoClient)
        setCall(callInstance)

      } catch (error) {
        console.error("Error init call:", error)
        toast.error("Cannot connect to the call")
      }finally{
        setIsConnecting(false);
      }
    }

    initCall()

    return () => {
      if (callInstance) {
        callInstance.leave().catch(console.error);
      }
      if (videoClient) {
        videoClient.disconnectUser().catch(console.error);
      }
    };
  }, [tokenData,user,callId])
  if(isConnecting || !isLoaded){
    return <div className="h-screen flex justify-center items-center">
      Connecting to Call....
    </div>
  }

  return (
   <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
    <div className="relative w-full max-w-4xl mx-auto">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent/>
          </StreamCall>
        </StreamVideo>
      ):(
        <div className="flex items-center justify-center h-full">
          <p>
            Could not initialize call. Please refresh or try again later
          </p>
        </div>
      )}
    </div>
   </div> 
  ) 
}

const CallContent = () =>{
  const {useCallCallingState} = useCallStateHooks()

  const callingState = useCallCallingState()
  const navigate = useNavigate()

useEffect(() => {
  if (callingState === CallingState.LEFT) {
    window.location.href = "/";
  }
}, [callingState, navigate]);
    return(
       <StreamTheme>
        <SpeakerLayout/>
        <CallControls/>
       </StreamTheme>
    )
}
export default CallPage
