"use client"
import Link from "next/link";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoInformationCircle } from "react-icons/io5";
import { HiMiniUsers } from "react-icons/hi2";
import { MdEventNote, MdOutlineNotes } from "react-icons/md";
import { FaUserPlus, FaUsersCog } from "react-icons/fa";
import { useMemo } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

const ServerSettingSideBar = ({userServerProfile,user}) => {
    const owner=userServerProfile?.server.ownerId==user?.id || false
    const isAdmin=userServerProfile?.roles.find((role)=>role.role.adminPermission) || false
    const manageRole=userServerProfile?.roles.find((role)=>role.role.manageRoles) || false
    const router = useRouter();
    const params = useParams()
    const pathname = usePathname()
    const serverId = useMemo(() => params.serverId, [router])
    const active = useMemo(() => pathname.split('/').filter(Boolean).pop(), [router,pathname])
    console.log(active)
    return (
        <div className="p-6">
            <h2 className="font-bold uppercase text-indigo-500 mb-1">{userServerProfile.server.name}</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />
            <div className="space-y-[2px]">
                <div onClick={()=>router.push(`${serverId}/server-info`)} className={`flex rounded cursor-pointer ${active == "server-info" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                    <div className="my-auto mx-1 text-indigo-500">
                        <IoInformationCircle size={20} />
                    </div>
                    <div className="block py-1 rounded text-indigo-500 ">
                        Overview
                    </div>
                </div>
                <div onClick={()=>router.push(`${serverId}/server-roles`)} className={`flex rounded cursor-pointer ${active == "server-roles" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                    <div className="my-auto mx-1 text-indigo-500">
                        <HiMiniUsers size={20} />
                    </div>
                    <div className="block py-1 rounded text-indigo-500">
                        Roles
                    </div>
                </div>
                <div onClick={()=>router.push(`${serverId}/server-categories`)} className={`flex rounded cursor-pointer ${active == "server-categories" ? "bg-gray-300" : "hover:bg-gray-200"} ${!owner && !isAdmin && "hidden"}`}>
                    <div className="my-auto mx-1 text-indigo-500">
                        <MdEventNote size={20} />
                    </div>
                    <div className="block py-1 rounded text-indigo-500">
                        Categories
                    </div>
                </div>
                <div onClick={()=>router.push(`${serverId}/server-channels`)} className={`flex rounded cursor-pointer ${active == "server-channels" ? "bg-gray-300" : "hover:bg-gray-200"} ${!owner && !isAdmin && "hidden"}`}>
                    <div className="my-auto mx-1 text-indigo-500">
                        <MdOutlineNotes size={20} />
                    </div>
                    <div className="block py-1 rounded text-indigo-500">
                        Channels
                    </div>
                </div>
            </div>

            <h2 className="font-bold uppercase text-indigo-500 mt-1 mb-1">User Management</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />
            <div>
                <div onClick={()=>router.push(`${serverId}/manage-members`)} className={`flex rounded cursor-pointer ${active == "manage-members" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                    <div className="my-auto mx-1 text-indigo-500">
                        <FaUsersCog size={20} />
                    </div>
                    <div className="block py-1 rounded text-indigo-500 hover:bg-gray-200">
                        Members
                    </div>
                </div>
                <div onClick={()=>router.push(`${serverId}/manage-invites`)} className={`flex rounded cursor-pointer ${active == "manage-invites" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                    <div className="my-auto mx-1 text-indigo-500">
                        <FaUserPlus size={20} />
                    </div>
                    <div className="block py-1 rounded text-indigo-500">
                        invites
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-indigo-400 mb-1 mt-1" />
            <div className="mt-2">
                <div onClick={()=>router.push("m")} className={`flex justify-between px-2 rounded cursor-pointer border border-red-500 ${active=="m"?"bg-red-500 text-white":"text-red-500 hover:text-white hover:bg-red-500"}`}>
                    <div className="block py-1 rounded">
                        Delete Server
                    </div>
                    <div className="my-auto">
                        <RiDeleteBin6Fill />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServerSettingSideBar;