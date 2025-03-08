"use client";
import { getServer } from "@/actions/user";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";
import { serverStore } from "@/hooks/zusthook.js";
import Image from "next/image";

const ServerSideBar = () => {
    const { onsetServer, serverProfile } = serverStore();
    const router = useRouter();
    const params = useParams();
    const [server, setServer] = useState(null);
    const serverId = useMemo(() => params.serverId, [params?.serverId]);
    const channelId = useMemo(() => params.channelId, [params?.channelId]);

    console.log(serverProfile);

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await getServer(serverId);
                if (res.success) {
                    console.log(res.server);
                    onsetServer(res.server);
                    setServer(res.server);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (serverId) {
            initiatePage();
        }
    }, [serverId]);

    return (
        <div className="w-[300px] h-screen bg-gray-50 text-indigo-500 flex flex-col">
            {server ? (
                <>
                    {/* Server Header */}
                    <div className="px-2 pl-4 h-16 bg-gray-100 flex justify-between space-x-2 border-b border-gray-100 shadow">
                        <div className="flex">
                            <div className="w-14 h-14 rounded-full bg-white flex my-auto">
                                {server?.imageUrl ? (
                                    <img
                                        src={server.imageUrl}
                                        alt="Server Icon"
                                        className="my-auto w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="text-3xl w-full h-full flex items-center justify-center">
                                        {`${server.name.slice(0, 1).toUpperCase()}`}
                                    </div>
                                )}
                            </div>
                            <span className="font-bold text-indigo-500 my-auto ml-2">
                                {server.name}
                            </span>
                        </div>
                        <div className="flex">
                            <IoSettingsSharp
                                size={22}
                                className="inline text-indigo-500 transition-all duration-500 hover:rotate-90 my-auto cursor-pointer mx-1"
                                onClick={() => router.push(`/setting/server/${serverId}`)}
                            />
                        </div>
                    </div>

                    <div className="p-2 flex-1 overflow-y-auto scrollbar-none">
                        {server &&
                            server.categories.map((category) => {
                                return (
                                    <SidebarSection
                                        key={category.id}
                                        category={category}
                                        channelId={channelId}
                                        serverId={serverId}
                                    />
                                );
                            })}
                    </div>

                    {/* Footer */}
                    <div className="p-1 space-x-2 border-t border-indigo-200 bg-gray-200 shadow">
                        <div className="hover:bg-gray-50 flex items-center p-2 py-1 rounded cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                G
                            </div>
                            <div className="flex-1 ml-2">
                                <h3 className="text-sm font-bold text-indigo-500">
                                    gunjanpatel
                                </h3>
                                <p className="text-xs text-indigo-400">Idle</p>
                            </div>
                            <div className="flex space-x-2 text-gray-400">
                                <button>
                                    <IoSettingsSharp
                                        size={22}
                                        className="text-indigo-500 transition-all duration-500 hover:rotate-90"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>Loading</div>
            )}
        </div>
    );
};

const SidebarItem = ({ channel, channelId, serverId, isSelected, isVisible }) => {
    const router = useRouter();

    return (
        <div
            className={`transition-all duration-500 ease-in-out ${!isSelected && isVisible ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"} ${isSelected && "opacity-100 max-h-screen"}`}
            onClick={() => router.push(`/server/${serverId}/channel/${channel.id}`)}
        >
            <div className={`flex items-center rounded-md justify-between cursor-pointer px-2 py-[5px] mb-[2px] ${channelId === channel.id ? "bg-gray-300" : "hover:bg-gray-200"} group`}>
                <div className="flex items-center space-x-1">
                    {channel.type === "TEXT" && <FaHashtag />}
                    {channel.type === "VOICE" && <HiSpeakerWave />}
                    <span className="text-sm">{channel.name}</span>
                </div>
                <div>
                    <IoSettingsSharp size={15} className={`hover:rotate-90 transition-all duration-500 opacity-0 group-hover:opacity-100 ${isSelected && "opacity-100"}`} />
                </div>
            </div>
        </div>
    );
};

const SidebarSection = ({ category, channelId, serverId }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-[1px]">
            {/* Section Header */}
            <div
                className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-gray-200 rounded-md mb-[1px] group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex-1">
                    <span className="text-sm cursor-pointer pr-1">
                        <IoIosArrowForward
                            className={`transition-transform duration-300 my-auto ${isOpen ? "rotate-90" : ""} inline`}
                        />
                    </span>
                    <span className="text-sm font-semibold uppercase">{category.name}</span>
                </span>
                <span className="flex">
                    <FaPlus className="my-auto mr-0 transition-all duration-300 ease-out group-hover:mr-[3px]" size={15} />
                    <IoSettingsSharp className="my-auto hover:rotate-90 transition-all duration-500 group-hover:opacity-100 max-w-0 group-hover:max-w-8" size={16} onClick={() => router.push(`/setting/category/${category.id}`)}  />
                </span>
            </div>

            {/* Channel List (Smooth collapse/expand) */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden flex flex-col`}
            >
                {category?.channels.map((channel) => (
                    <SidebarItem
                        key={channel.id}
                        channel={channel}
                        channelId={channelId}
                        serverId={serverId}
                        isSelected={channel.id === channelId}
                        isVisible={isOpen} // Keep selected visible
                    />
                ))}
            </div>
        </div>
    );
};



export default ServerSideBar;