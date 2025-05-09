"use client";

import { toast } from "@/hooks/use-toast";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { fetchMessagesTrial, sendMessage } from "@/actions/channel-message.js";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { checkChannelViewPermission } from "@/actions/user";
import { webSocketServer } from "@/server";

// import { getUserProfile } from "@/actions/user";

const ChatArea = () => {
  const params = useParams();
  const channelId = useMemo(() => params.channelId || "", [params]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const messagesRef = useRef(null);
  const socketRef = useRef(null);
  
//   const [user, setUser] = useState(null);
//   const messagesRef = useRef(null);
//   const socketRef = useRef(null);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch user profile
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await getUserProfile();
//         if (response.success) {
//           setUser(response.user);
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to load user profile",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

  useEffect(() => {
    if (!channelId) return;
    fetchInitialMessages();
  }, [channelId]);

  const fetchInitialMessages = async () => {
    setLoading(true);
    const res = await fetchMessagesTrial(params.serverId, channelId, localStorage.getItem(channelId));
    if (res.success) {
      // Ensure messages are sorted chronologically (oldest first)
      const sortedMessages = res.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
      setCursor(res.cursor);
      if (res.token) {
        localStorage.setItem(channelId, res.token[channelId]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const initiateToken = async () => {
      try {
        const res = await checkChannelViewPermission(channelId, localStorage.getItem(channelId));
        if (res.success && res.token) {
          localStorage.setItem(channelId, res.token[channelId]);
          connectSocket(res.token[channelId]);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch a valid token",
        });
      }
    };

    const connectSocket = (token) => {
      if (!channelId || socketRef.current) return;

      socketRef.current = io(`${webSocketServer}/channel`, {
        query: { channelId, token },
      });

      socketRef.current.on("message", (message) => {
        console.log(message, "socket");
        // Append new message to the end
        setMessages((prev) => [...prev, message]);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected. Reconnecting...");
        initiateToken();
      });

      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    };

    initiateToken();
  }, [channelId]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const handleScroll = async () => {
    if (!messagesRef.current || !cursor) return;

    if (messagesRef.current.scrollTop === 0) {
      const res = await fetchMessagesTrial(params.serverId, channelId, cursor, localStorage.getItem(channelId));
      if (res.success) {
        // Prepend older messages to maintain chronological order
        const sortedNewMessages = res.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages((prev) => [...sortedNewMessages, ...prev]);
        setCursor(res.cursor);
        if (res.token) {
          localStorage.setItem(channelId, res.token[channelId]);
        }
        // Maintain scroll position after loading older messages
        const previousHeight = messagesRef.current.scrollHeight;
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight - previousHeight;
      }
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) {
      return toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
    }

    try {
      const content = chatInput;
      setChatInput("");
      const res = await sendMessage(params.serverId, params.channelId, content, localStorage.getItem(channelId));
      if (res.success) {
        if (res.token) {
          localStorage.setItem(channelId, res.token[channelId]);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white flex-1">
      {/* Chat Messages Section */}
      <div
        ref={messagesRef}
        onScroll={handleScroll}
        className="h-0 flex-grow overflow-y-auto p-4 scrollbar-none shadow-inner shadow-indigo-50"
      >
        {cursor && <div className="text-center text-gray-400">Loading...</div>}
        {messages.map((item, i) => (
          <MessageDialogOther key={i} item={item} />
        ))}
      </div>

      {/* Chat Input Section */}
      <div className="bg-white p-3 shadow-indigo-500 border-t border-indigo-300">
        <div className="flex items-center bg-white rounded-md px-2 py-2 shadow border border-indigo-200">
          <AiFillPlusCircle className="text-indigo-500 mr-2 ml-1 cursor-pointer" size={25} />
          <input
            className="flex-1 bg-transparent text-indigo-500 placeholder:text-indigo-400 outline-none resize-none"
            placeholder="Enter your message # | general"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <BsEmojiSmileFill className="text-indigo-500 mx-2 cursor-pointer" size={20} />
          <span className="text-indigo-500">|</span>
          <IoSend className="text-indigo-500 mx-2 cursor-pointer" size={20} onClick={handleChatSend} />
        </div>
      </div>
    </div>
  );
};

const MessageDialogOther = ({ item}) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatTimestamp(item.timestamp);

  return (
    <div className="flex mb-2">
      {/* Avatar section */}
      <div className="w-12 h-12 mr-2">
        { item.serverProfile ? (
          <img
            src={item.serverProfile?.imageUrl || "./OIP.jpg"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center">
          <div className="font-bold text-indigo-600">{item.serverProfile.name || "Unknown User"}</div>
          <div className="text-xs text-gray-400 ml-2">{formattedDate}</div>
          <div className="text-xs text-gray-400 ml-1">{formattedTime}</div>
        </div>
        <div className="text-justify text-gray-700">{item.content}</div>
      </div>
    </div>
  );
};

export default ChatArea;