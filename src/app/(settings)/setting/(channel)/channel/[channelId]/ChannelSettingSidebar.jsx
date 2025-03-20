"use client";

import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoInformationCircle } from "react-icons/io5";
import { HiMiniUsers } from "react-icons/hi2";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChannelInfo } from "@/actions/channel";

const CategorySettingSidebar = () => {

    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const channelId = params.channelId;
    const [channel, setChannel] = useState('')
    const active = pathname.split("/").filter(Boolean).pop();

    const menuItems = [
        { name: "Overview", path: "Overview", icon: IoInformationCircle },
        { name: "Permissions", path: "Permissions", icon: HiMiniUsers }
    ];

    useEffect(() => {
        const fetchChannelInitial = async () => {
            try {
                const res = await getChannelInfo(params.channelId)
                console.log(res)
                if (res.success) {
                    setChannel(res.channel)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchChannelInitial()
    }, [])

    return (
        <div className="p-6">
            <h2 className="font-bold uppercase text-indigo-500 mb-1">{channel?.name}</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />

            <div className="space-y-[2px]">
                {menuItems.map(({ name, path, icon: Icon, permission = true }) =>
                    permission ? (
                        <div
                            key={path}
                            onClick={() => router.push(`/setting/channel/${channelId}/${path}`)}
                            className={`flex rounded cursor-pointer ${active === path ? "bg-gray-300" : "hover:bg-gray-200"
                                }`}
                        >
                            <div className="my-auto mx-1 text-indigo-500">
                                <Icon size={20} />
                            </div>
                            <div className="block py-1 rounded text-indigo-500">{name}</div>
                        </div>
                    ) : null
                )}
            </div>

            <div className="h-[1px] w-full bg-indigo-400 mb-1 mt-1" />
            <div className="mt-2">
                <div
                    onClick={() => router.push("m")}
                    className={`flex justify-between px-2 rounded cursor-pointer border border-red-500 ${active === "m" ? "bg-red-500 text-white" : "text-red-500 hover:text-white hover:bg-red-500"
                        }`}
                >
                    <div className="block py-1 rounded">Delete Channel</div>
                    <div className="my-auto">
                        <RiDeleteBin6Fill />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySettingSidebar;
