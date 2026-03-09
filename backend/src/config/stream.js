
import { StreamChat } from "stream-chat"
import { ENV } from "./env.js";

const streamClient =  StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData);
        console.log("Stream user upserted successfully", userData.name);
        return userData;
    } catch (error) {
        console.error("error upserting stream user", error); // Fixed typo
        throw error;
    }
};

export const deleteStreamUser = async (userId) => {
    try {
        await streamClient.deleteUser(userId);
        console.log("Stream user deleted successfully", userId);
    } catch (error) {
        console.error("error deleting stream user", error);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.error("error generating stream token", error);
        return null;
    }
};

export const getPublicChannels = async ({ limit = 20, offset = 0 } = {}) => {
  const response = await streamClient.queryChannels(
    { visibility: "public", discoverable: true },
    { last_message_at: -1 },
    { limit, offset }
  );
  return response;
};

export const addUsersToPublicChannels = async (newUserId) => {
  const publicChannels = await streamClient.queryChannels({ discoverable: true });
  for (const channel of publicChannels) {
    await channel.addMembers([newUserId]);
  }
};

export const addUserToChannel = async (channelId, userId) => {
  const channel = streamClient.channel("messaging", channelId);
  await channel.addMembers([userId]);
  return channel;
};

