import { generateStreamToken, getPublicChannels } from "../config/stream.js";

export const getStreamToken = async(req,res)=>{
    try{
        const token = await generateStreamToken(req.auth().userId);
        
        res.status(200).json({token});
    }catch(error){
        console.log("error generating stream token",error)
        res.status(500).json({
            message:"Failed to generate stream token"
        })
    }
}

export const getPublicChannelsController = async (req, res) => {
  try {
    const channels = await getPublicChannels();
    const sanitized = channels.map((channel) => ({
      id: channel.id,
      name: channel.data?.name || channel.id,
      member_count: channel.member_count,
      last_message_at: channel.last_message_at,
    }));

    res.status(200).json({ channels: sanitized });
  } catch (error) {
    console.error("error fetching public channels", error);
    res.status(500).json({ message: "Failed to fetch public channels" });
  }
};