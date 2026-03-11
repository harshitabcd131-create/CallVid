
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

export class ChannelNotFoundError extends Error {}
export class ChannelNotPublicError extends Error {}
export class ChannelJoinForbiddenError extends Error {}

export const getPublicChannels = async ({ limit = 20, offset = 0 } = {}) => {
  const response = await streamClient.queryChannels(
    { visibility: "public", discoverable: true },
    { last_message_at: -1 },
    { limit, offset }
  );
  return response;
};

export const addUsersToPublicChannels = async (newUserId) => {
  try {
    const publicChannels = await streamClient.queryChannels(
      { visibility: "public", discoverable: true },
      { last_message_at: -1 },
      { limit: 100 }
    );
    for (const channel of publicChannels) {
      await channel.addMembers([newUserId]);
    }
  } catch (error) {
    console.error("error adding user to public channels", error);
    throw error;
  }
};

export const getChannelById = async (channelId) => {
  const channel = streamClient.channel("messaging", channelId);
  try {
    await channel.query({ watch: false, state: false });
    return channel;
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("does not exist")) {
      throw new ChannelNotFoundError();
    }
    throw err;
  }
};

export const addUserToChannel = async (channelId, userId) => {
  const channel = await getChannelById(channelId);
  const visibility = channel.data?.visibility;

  if (visibility !== "public") {
    throw new ChannelNotPublicError();
  }

  try {
    await channel.addMembers([userId]);
    return channel;
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (err?.status === 403 || msg.includes("not allowed") || msg.includes("forbidden")) {
      throw new ChannelJoinForbiddenError(err?.message || "Forbidden");
    }
    throw err;
  }
};

