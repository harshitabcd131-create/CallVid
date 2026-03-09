import { UserButton } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router'
import { useStreamChat } from '../hooks/useStreamChat';
import { axiosInstance } from '../lib/axios';
import PageLoader from '../components/PageLoader';
import CreateChannelModal from '../components/CreateChannelModal';
import "../styles/stream-chat-theme.css"
import CustomChannelPreview from '../components/CustomChannelPreview';
import UsersList from '../components/UsersList';
import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import { HashIcon, PlusIcon, UsersIcon } from 'lucide-react';


const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, isLoading, error } = useStreamChat();
  const userId = chatClient?.user?.id;

  const {
    data: publicChannels = [],
    isLoading: isLoadingPublicChannels,
    refetch: refetchPublicChannels,
  } = useQuery(
    ["publicChannels"],
    async () => {
      const response = await axiosInstance.get("/api/chat/public-channels");
      return response.data.channels || [];
    },
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );

  const [joiningChannelId, setJoiningChannelId] = useState(null);

  const handleJoinChannel = async (channelId) => {
    if (!chatClient || !userId) return;
    setJoiningChannelId(channelId);

    try {
      const channel = chatClient.channel("messaging", channelId);
      await channel.addMembers([userId]);
      await channel.watch();
      setActiveChannel(channel);
      setSearchParams({ channel: channelId });
      refetchPublicChannels();
    } catch (err) {
      console.error("Error joining public channel", err);
    } finally {
      setJoiningChannelId(null);
    }
  };

  //set the active channel based on the url search params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);

      }
    }
  }, [chatClient, searchParams]);
  //todo handle this with better component 
  if (error) return <p>Something went wrong...</p>;
  if (isLoading || !chatClient || !chatClient.user?.id) return <PageLoader />;

  return (
    <div className='chat-wrapper'>
      <Chat client={chatClient}>
        <div className='chat-container'>
          {/* left side bar */}
          <div className='str-chatz__channel-list'>
            <div className='team-channel-list'>
              {/* HEADER */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="Logo" className="brand-logo" />
                  <span className="brand-name">Slap</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>
              {/* CHANNEL LIST */}
              <div className='team-channel-list__content'>
                <div className="create-channel-section">
                  <button onClick={() => setIsCreateModalOpen(true)} className='create-channel-btn'>
                    <PlusIcon className='size-4' />
                    <span>Create Channel</span>
                  </button>
                </div>

                <div className="public-channels-section">
                  <div className="section-header">
                    <div className="section-title">
                      <HashIcon className="size-4" />
                      <span>Discover</span>
                    </div>
                  </div>

                  {isLoadingPublicChannels ? (
                    <div className="loading-message">Loading public channels...</div>
                  ) : publicChannels.length === 0 ? (
                    <div className="empty-message">No public channels found</div>
                  ) : (
                    <div className="channels-list">
                      {publicChannels.map((channel) => (
                        <div key={channel.id} className="public-channel-row">
                          <div className="public-channel-info">
                            <span className="public-channel-name">{channel.name}</span>
                            {channel.member_count != null && (
                              <span className="public-channel-meta">{channel.member_count} members</span>
                            )}
                          </div>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleJoinChannel(channel.id)}
                            disabled={joiningChannelId === channel.id}
                          >
                            {joiningChannelId === channel.id ? "Joining…" : "Join"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CHANNEL LIST */}

                <ChannelList
                  filters={{ members: { $in: [userId] } }}
                  options={{ state: true, watch: true }}
                  Preview={({ channel }) => (
                    <CustomChannelPreview
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={(channel) => setSearchParams({ channel: channel.id })}
                    />
                  )}
                  List={({ children, loading, error }) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="size-4" />
                          <span>Channels</span>
                        </div>
                      </div>
                      {/* add better components instead of plane text */}
                      {loading && <div className="loading-message">Loading channels...</div>}
                      {error && <div className="error-message">Error loading channels</div>}


                      <div className="channels-list">{children}</div>

                      <div className="section-header direct-messages">
                        <div className="section-title">
                          <UsersIcon className='size-4' />
                          <span>Direct Messages</span>
                        </div>
                      </div>
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER */}
          <div className="chat-main">
            <Channel channel={activeChannel}>
              <Window>
                {/* <CustomChannelHeader/> */}
                <MessageList />
                <MessageInput />

              </Window>

              <Thread />
            </Channel>
          </div>
        </div>
        {isCreateModalOpen && (<CreateChannelModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />)}
      </Chat>
    </div>
  )
}

export default HomePage

