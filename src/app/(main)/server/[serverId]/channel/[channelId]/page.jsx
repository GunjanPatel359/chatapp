"use client"
import { useEffect, useState } from "react";
import ChannelHeader from "./ChannelHeader";
import ChatArea from "./ChatArea";
import { useParams } from "next/navigation";
import { getChannel } from "@/actions/user";
import VideoArea from "./VideoArea";
import TempVideoArea from "./TempVideoArea";
import Temp from "./Temp";

// ChannelPage component to display a channel with chat or video
const ChannelPage = () => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [channelInfo, setChannelInfo] = useState(null);

    // Fetch channel data when channelId changes
    useEffect(() => {
        if (!params?.channelId) return; // Prevents running on first undefined render

        const fetchChannel = async () => {
            setLoading(true);
            try {
                const res = await getChannel(params.channelId);
                if (res.success) {
                    console.log(res.channel);
                    setChannelInfo(res.channel);
                }
            } catch (error) {
                console.error("Error fetching channel:", error);
            } finally {
                setLoading(false); // Ensures loading state updates even on error
            }
        };

        fetchChannel();
    }, [params?.channelId]); // Runs when channelId changes

    // Dummy data for the sidebar items (bots list)
    const sidebarItems = [
        { name: 'Arcane', online: true },
        { name: 'Birthday Bot', online: true },
        { name: 'Dank Memer', online: true },
        { name: 'Dyno', online: true },
        { name: 'Mudae', online: true },
        { name: 'Pingcord', online: true },
        { name: 'ProBot', online: true },
    ];

    // Loading state with a spinner
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    {/* Spinner */}
                    <div
                        className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"
                    ></div>
                    <span className="text-indigo-400 text-lg">Loading...</span>
                </div>
            </div>            
        );
    }

    console.log(channelInfo.type);

    return (
        <div className="flex flex-col h-screen flex-1">
            {/* Header */}
            <ChannelHeader channel={channelInfo || { name: "Loading...", description: "" }} />

            {/* Main Chat Section */}
            {channelInfo?.type === "TEXT" ? (
                <div className="flex-1 flex overflow-hidden">
                    <ChatArea />
                    {/* Sidebar with scrollable content */}
                    <div className="w-64 bg-white text-indigo-400 p-4 flex flex-col">
                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full p-2 rounded bg-gray-100 text-indigo-400 placeholder-indigo-200 focus:outline-none"
                            />
                        </div>

                        {/* Sidebar Items - Scrollable with smooth behavior */}
                        <div className="flex-1 space-y-2 overflow-y-auto scroll-smooth">
                            {sidebarItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-2 rounded hover:bg-indigo-100"
                                >
                                    {/* Icon/Avatar Placeholder */}
                                    <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
                                        {item.online && (
                                            <div className="absolute w-4 h-4 rounded-full border-2 border-white bottom-0 right-0" />
                                        )}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-1">
                                            <span className="font-semibold">{item.name}</span>
                                            {item.special && (
                                                <span className="text-yellow-400">👑</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex">
                    <Temp
                        roomName={channelInfo.id}
                        userId={"1452"}
                    />
                </div>
            )}
        </div>
    );
};

export default ChannelPage; 