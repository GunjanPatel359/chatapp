"use client"
import { BsPlus, BsGearFill } from "react-icons/bs";
import { FaFire } from "react-icons/fa";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllUserJoinedServer } from "@/actions/user";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SideBar = () => {
    const pathname=usePathname()
    const params=useParams()
    const [active,setActive]=useState()
    const [server,setServer]=useState([])

    useEffect(()=>{
        const activeFetchPage=()=>{
            if(pathname.includes("/home")){
                return setActive("home")
            }
            setActive(params?.serverId)
        }
        activeFetchPage()
    },[pathname])

    useEffect(()=>{
        const initiatePage=async()=>{
            try {
                const userJoinedServer = await getAllUserJoinedServer();
                setServer(userJoinedServer.joinedServer)
            } catch (error) {
                console.log(error)
            }
        }
        initiatePage()
    },[])

    return (
        <div
            className="h-screen w-20 flex flex-col
      bg-white shadow-lg justify-between"
        >
            <div>
                <SideBarIcon icon={<FaFire size="28" />} text="Home" active={active=="home"} />
                <Divider />
            </div>
            <div className="flex-1 overflow-y-scroll scrollbar-none my-1">
                {server.length > 0 &&
                    server.map((item, i) => {
                        return (
                            <SideBarServerIcon
                                icon={item.server?.imageUrl}
                                text={item.server.name}
                                key={i}
                                active={active==item.server.id}
                                itemId={item.server.id}
                            />
                        );
                    })}
            </div>
            <div>
                <Divider />
                <SideBarIcon icon={<BsPlus size="32" />} text="Create server" active={false} />
                <SideBarIcon icon={<BsGearFill size="22" />} text="Settings" active={active=="setting"} />
            </div>
        </div>
    );
};

const SideBarServerIcon = ({ icon, text = "tooltip 💡",active,itemId }) => {
    const router=useRouter()
    return (
    <div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div 
                    className={`relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto transition-all duration-300 ease-linear cursor-pointer shadow-lg group hover:rounded-2xl ${active?"bg-indigo-600 text-white rounded-xl":"border border-dashed border-indigo-500 hover:bg-indigo-600 text-indigo-500 hover:text-white hover:rounded-2xl rounded-3xl bg-white"}`}
                    onClick={()=>router.push(`/server/${itemId}`)}
                    >
                        <div className={`absolute -translate-x-10 w-2 rounded bg-indigo-500 transition-all ${active?"h-10":"h-4 group-hover:h-8"}`} />
                        {icon ? (
                            <Image />
                        ) : (
                            <div className="flex items-center">
                                <p className="text-center text-4xl -translate-y-1 py-auto">{`${(text.slice(0, 1)).toLowerCase()}`}</p>
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={13}>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
    )
};

const SideBarIcon = ({ icon, text = "tooltip 💡",active }) => {
    const router=useRouter()
    return (
    <div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto transition-all duration-300 ease-linear cursor-pointer shadow-lg group hover:rounded-2xl
                     ${active?"bg-indigo-600 text-white rounded-xl":"border border-dashed border-indigo-500 hover:bg-indigo-600 text-indigo-500 hover:text-white hover:rounded-2xl rounded-3xl bg-white"} `}
                    onClick={()=>router.push("/home")}
                    >
                        <div className={`absolute -translate-x-10 w-2 rounded bg-indigo-500 transition-all ${active?"h-10":"h-4 group-hover:h-8"}`} />
                        {icon}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={13}>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
    )
};

const Divider = () => (
    <hr
        className="bg-indigo-500
    border border-indigo-500 rounded-full
    mx-4"
    />
);

export default SideBar;
