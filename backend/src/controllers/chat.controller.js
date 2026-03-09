import { generateStreamToken, getPublicChannels, addUserToChannel } from "../config/stream.js";

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

export const joinPublicChannel = async (req, res) => {
  try {
    const { channelId } = req.body;
    if (!channelId) {
      return res.status(400).json({ message: "channelId is required" });
    }

    const userId = req.auth().userId;
    await addUserToChannel(channelId, userId);

    res.status(200).json({ message: "Joined channel" });
  } catch (error) {
    console.error("error joining public channel", error);
    res.status(500).json({ message: "Failed to join public channel" });
  }
};