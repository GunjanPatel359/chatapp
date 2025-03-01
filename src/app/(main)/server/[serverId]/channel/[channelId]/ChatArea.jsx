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

import {webSocketServer} from "@/server"

const ChatArea = () => {
  const params = useParams();
  const channelId = useMemo(() => params.channelId || "", [params]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!channelId) return;
    fetchInitialMessages();
  }, [channelId]);

  const fetchInitialMessages = async () => {
    setLoading(true);
    const res = await fetchMessagesTrial(channelId);
    if (res.success) {
      setMessages(res.messages);
      setCursor(res.cursor);
    }
    setLoading(false);
  };

  useEffect(() => {
    const initiateToken = async () => {
      try {
        const res = await checkChannelViewPermission(channelId, localStorage.getItem(channelId));
  
        if (res.success && res.token) {
          localStorage.setItem(channelId, res.token); // Update token every time
          connectSocket(res.token); // Connect WebSocket with new token
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
        query: { channelId, token }, // Always send the latest token
      });
  
      socketRef.current.on("message", (message) => {
        console.log(message);
        setMessages((prev) => [...prev, message]);
      });
  
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected. Reconnecting...");
        initiateToken(); // Get new token before reconnecting
      });
  
      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    };
  
    initiateToken(); // Always fetch the latest token before connecting
  
  }, [channelId]);
  

  const handleScroll = async () => {
    if (!messagesRef.current || !cursor) return;

    if (messagesRef.current.scrollTop === 0) {
      const res = await fetchMessagesTrial(channelId, cursor);
      if (res.success) {
        setMessages((prev) => [...res.messages, ...prev]);
        setCursor(res.cursor);
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
      const res = await sendMessage(params.serverId, params.channelId, chatInput,localStorage.getItem(channelId));
      if (res.success) {
        setChatInput("");
        console.log(res)
        if(res.token){
          localStorage.setItem(channelId,res.token[channelId])
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
        {cursor&&<div className="text-center text-gray-400">Loading...</div>}
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

const MessageDialogOther = ({ item }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatTimestamp(item.timestamp);

  return (
    <div className="flex mb-2">
      <div className="rounded-full bg-red-300 w-12 h-12"></div>
      <div className="flex flex-col ml-2 flex-1">
        <div className="flex">
          <div className="font-bold">Krushnaraj</div>
          <div className="text-xs my-auto ml-2">{formattedDate}</div>
          <div className="text-xs my-auto ml-1">{formattedTime}</div>
        </div>
        <div className="text-justify">{item.content}</div>
      </div>
    </div>
  );
};

export default ChatArea;
