"use client"
import { useEffect, useState } from "react";
import ChannelHeader from "./ChannelHeader";
import ChatArea from "./ChatArea";
import { useParams } from "next/navigation";
import { getChannel } from "@/actions/user";
import VideoArea from "./VideoArea";
import TempVideoArea from "./TempVideoArea";
import Temp from "./Temp";
// import { LottiePlayer } from "lottie-react";

const ChannelPage = () => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [channelInfo, setChannelInfo] = useState(null);

    useEffect(() => {
        if (!params?.channelId) return; // Prevents running on first undefined render

        const fetchChannel = async () => {
            setLoading(true);
            try {
                const res = await getChannel(params.channelId);
                if (res.success) {
                    console.log(res.channel)
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

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">Loading...</div>            
        )

    }

    console.log(channelInfo.type)
    return (
        <div className="flex flex-col h-screen flex-1">
            {/* Header */}
            <ChannelHeader channel={channelInfo || { name: "Loading...", description: "" }} />

            {/* Main Chat Section */}
            {
                channelInfo?.type == "TEXT" ? (
                    <div className="flex-1 flex">
                        <ChatArea />
                        {/* Sidebar (Optional) */}
                        <div className="w-64 bg-indigo-500">reserved</div>
                    </div>
                ) : (
                    <div className="flex-1 flex">
                        {/* <VideoArea
                            roomName={channelInfo.id}
                            userId={"1452"}
                            role={"waitforit"}
                        /> */}
                        {/* <TempVideoArea
                        roomName={channelInfo.id}
                        userId={"1452"}
                        role={"waitforit"}
                        /> */}
                        <Temp
                        roomName={channelInfo.id}
                        userId={"1452"}
                        />
                        {/* <ChatArea /> */}
                        {/* Sidebar (Optio2nal) */}
                        {/* <div className="w-64 bg-indigo-500">reserved</div> */}
                    </div>
                )
            }

        </div>
    );
};

export default ChannelPage;
