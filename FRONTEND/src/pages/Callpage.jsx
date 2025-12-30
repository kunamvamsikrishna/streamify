import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useauth.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const isInitializing = useRef(false);
  const currentCallRef = useRef(null);
  const currentClientRef = useRef(null);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializing.current) {
      return;
    }
    
    if (client && call) {
      return;
    }

    let isMounted = true;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) {
        if (tokenData && !tokenData.token) {
          setIsConnecting(false);
        }
        return;
      }

      if (!isMounted || isInitializing.current) {
        return;
      }

      isInitializing.current = true;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullname,
          image: authUser.profilepic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        currentCallRef.current = callInstance;
        currentClientRef.current = videoClient;

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        if (isMounted) {
          setClient(videoClient);
          setCall(callInstance);
          setIsConnecting(false);
        } else {
          // Component unmounted, clean up
          await callInstance.leave().catch(console.error);
          videoClient.disconnectUser().catch(console.error);
        }
      } catch (error) {
        console.error("Error joining call:", error);
        if (isMounted) {
          toast.error("Could not join the call. Please try again.");
          setIsConnecting(false);
        }
      } finally {
        if (isMounted) {
          isInitializing.current = false;
        }
      }
    };

    initCall();

    // Cleanup function - only runs on unmount or when key dependencies change
    return () => {
      isMounted = false;
      if (currentCallRef.current) {
        currentCallRef.current.leave().catch(console.error);
        currentCallRef.current = null;
      }
      if (currentClientRef.current) {
        currentClientRef.current.disconnectUser().catch(console.error);
        currentClientRef.current = null;
      }
      isInitializing.current = false;
    };
  }, [tokenData?.token, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;