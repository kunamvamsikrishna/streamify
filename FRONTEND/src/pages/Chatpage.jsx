import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useauth.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      console.log("🔥 initChat called");
      console.log("authUser:", authUser);
      console.log("tokenData:", tokenData);
      console.log("targetUserId:", targetUserId);
  
      if (!tokenData?.token || !authUser || !targetUserId) {
        console.log("❌ Missing dependency, skipping init");
        setLoading(false);
        return;
      }
  
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        console.log("✅ Stream client created");
  
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilepic,
          },
          tokenData.token
        );
  
        console.log("✅ User connected");
  
        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log("channelId:", channelId);
  
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
  
        await currChannel.watch();
        console.log("✅ Channel watched");
  
        setChatClient(client);
        setChannel(currChannel);
      } catch (err) {
        console.error("❌ initChat error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    initChat();
  }, [tokenData, authUser, targetUserId]);
  

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;