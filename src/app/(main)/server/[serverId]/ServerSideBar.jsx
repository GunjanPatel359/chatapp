"use client"
import { getServer } from "@/actions/user";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FaHashtag } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";

const ServerSideBar = () => {
    const router=useRouter()
    const params = useParams()
    const [server, setServer] = useState(null)
    const serverId=useMemo(()=>params.serverId,[params?.serverId])
    const channelId=useMemo(()=>params.channelId,[params?.channelId])

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await getServer(serverId)
                if (res.success) {
                    setServer(res.server)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (serverId) {
            initiatePage()
        }
    }, [serverId])

    return (
        <div className="w-[300px] h-screen bg-gray-50 text-indigo-500 flex flex-col">
            {server ? (
                <>
                    {/* Server Header */}
                    <div className="p-2 pl-4 h-12 bg-gray-100 flex justify-between space-x-2 border-b border-gray-100 shadow">
                    {/* <img src="https://via.placeholder.com/40" alt="Server Icon" className="w-10 h-10 rounded-full"/> */}
                    <div className="flex">
                        <div className="w-8 h-8 rounded-full bg-white">
                            {server?.imageUrl? (
                                <div>
                                    <Image src={server.imageUrl} alt="Server Icon" className="w-8 h-8" />
                                </div>
                            ):(
                                <div className="text-3xl text-center translate-y-[-4px]">
                                    {`${(server.name).slice(0,1).toLowerCase()}`}
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-indigo-500 my-auto ml-2">{server.name}</span>
                    </div>
                        <div className="flex">
                            <IoSettingsSharp size={22} className="inline text-indigo-500 transition-all duration-500 hover:rotate-90 my-auto cursor-pointer mx-1" onClick={()=>router.push(`/setting/server/${serverId}`)} />
                        </div>
                    </div>

                    <div className="p-2 flex-1 overflow-y-auto scrollbar-none">
                            {server && server.categories.map((category) => {
                                return (
                                    <SidebarSection key={category.id} category={category} channelId={channelId} serverId={serverId} />
                                )
                            })}
                    </div>

                    {/* Footer */}
                    <div className="p-1 space-x-2 border-t border-indigo-200 bg-gray-200 shadow">
                        <div className="hover:bg-gray-50 flex items-center p-2 py-1 rounded cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                G
                            </div>
                            <div className="flex-1 ml-2">
                                <h3 className="text-sm font-bold text-indigo-500">gunjanpatel</h3>
                                <p className="text-xs text-indigo-400">Idle</p>
                            </div>
                            <div className="flex space-x-2 text-gray-400">
                                <button>
                                    <IoSettingsSharp size={22} className="text-indigo-500 transition-all duration-500 hover:rotate-90" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
                ) : (
                <div>
                    Loading
                </div>
            )
            }
        </div>
    );
};

const SidebarItem = ({channel,channelId,serverId}) => {
    const router=useRouter()
    return (
    <div className={`flex items-center justify-between p-2 py-1 rounded-md cursor-pointer ${channelId==channel.id?"bg-gray-300":"hover:bg-gray-200"}`} onClick={()=>router.push(`/server/${serverId}/channel/${channel.id}`)}>
        <div className="flex items-center space-x-1">
            {channel.type=="TEXT" && <FaHashtag />}
            {channel.type=="VOICE" && <HiSpeakerWave />}
            <span className="text-sm">{channel.name}</span>
        </div>
    </div>
)}

const SidebarSection = ({ category,channelId,serverId }) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="mb-[2px]">
            <div
                className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-gray-200 rounded-md mb-[1px]"
            >
                <span onClick={() => setIsOpen(!isOpen)} className="flex-1">
                    <span className="text-sm cursor-pointer pr-1">
                        <IoIosArrowForward className={`transition-all my-auto ${isOpen ? "rotate-90" : ""} inline`} />
                    </span>
                    <span className="text-sm font-semibold uppercase">{category.name}</span>
                </span>
                <span>
                    <FaPlus className="my-auto" size={15} />
                </span>
            </div>
            <div className={`${isOpen?"h-full opacity-100":"h-0 overflow-hidden opacity-0"} transition-all duration-500`}>
            {category?.channels &&
                (
                    <div className="flex flex-col space-y-[2px]">
                        {category.channels.map((channel,id) => {
                            return (
                                <SidebarItem key={id} channel={channel} channelId={channelId} serverId={serverId} />
                            )
                        })}
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default ServerSideBar;
