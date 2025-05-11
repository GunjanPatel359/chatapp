"use client";

import Link from "next/link";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoInformationCircle } from "react-icons/io5";
import { HiMiniUsers } from "react-icons/hi2";
import { MdEventNote, MdOutlineNotes } from "react-icons/md";
import { FaUserPlus, FaUsersCog } from "react-icons/fa";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useEffect } from "react";
import { serverSetting } from "@/hooks/zusthook";

const ServerSettingSideBar = () => {
    const { user, userServerProfile } = serverSetting();

    if (!user || !userServerProfile) return <div>Loading...</div>;

    const { server, roles } = userServerProfile;
    const owner = server?.ownerId === user?.id;
    const isAdmin = roles?.some(role => role.role.adminPermission);
    const manageRole = roles?.some(role => role.role.manageRoles);

    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const serverId = params.serverId;
    const active = pathname.split("/").filter(Boolean).pop();

    // Auto redirect to "Overview" when at base server settings path
    useEffect(() => {
        if (pathname === `/setting/server/${serverId}`) {
            router.push(`/setting/server/${serverId}/server-info`);
        }
    }, [pathname, router, serverId]);

    const menuItems = [
        { name: "Overview", path: "server-info", icon: IoInformationCircle },
        { name: "Roles", path: "server-roles", icon: HiMiniUsers },
        { name: "Categories", path: "server-categories", icon: MdEventNote, permission: owner || isAdmin },
        { name: "Channels", path: "server-channels", icon: MdOutlineNotes, permission: owner || isAdmin }
    ];

    const userManagementItems = [
        { name: "Members", path: "manage-members", icon: FaUsersCog },
        { name: "Invites", path: "manage-invites", icon: FaUserPlus }
    ];

    return (
        <div className="p-6">
            {/* Back button */}
            <div className="mb-3">
                <button
                    onClick={() => router.push(`/server/${serverId}`)}
                    className="text-indigo-400 hover:underline text-sm"
                >
                    ← Back to Server
                </button>
            </div>

            {/* Server name and divider */}
            <h2 className="font-bold uppercase text-indigo-500 mb-1">{server?.name}</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />

            {/* Settings Menu */}
            <div className="space-y-[2px]">
                {menuItems.map(({ name, path, icon: Icon, permission = true }) =>
                    permission ? (
                        <div
                            key={path}
                            onClick={() => router.push(`/setting/server/${serverId}/${path}`)}
                            className={`flex rounded cursor-pointer ${active === path ? "bg-gray-300" : "hover:bg-gray-200"}`}
                        >
                            <div className="my-auto mx-1 text-indigo-500">
                                <Icon size={20} />
                            </div>
                            <div className="block py-1 rounded text-indigo-500">{name}</div>
                        </div>
                    ) : null
                )}
            </div>

            {/* User Management */}
            <h2 className="font-bold uppercase text-indigo-500 mt-1 mb-1">User Management</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />
            <div>
                {userManagementItems.map(({ name, path, icon: Icon }) => (
                    <div
                        key={path}
                        onClick={() => router.push(`/setting/server/${serverId}/${path}`)}
                        className={`flex rounded cursor-pointer ${active === path ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                        <div className="my-auto mx-1 text-indigo-500">
                            <Icon size={20} />
                        </div>
                        <div className="block py-1 rounded text-indigo-500">{name}</div>
                    </div>
                ))}
            </div>

            {/* Delete Server */}
            <div className="h-[1px] w-full bg-indigo-400 mb-1 mt-1" />
            <div className="mt-2">
                <div
                    onClick={() => router.push("m")}
                    className={`flex justify-between px-2 rounded cursor-pointer border border-red-500 ${active === "m" ? "bg-red-500 text-white" : "text-red-500 hover:text-white hover:bg-red-500"}`}
                >
                    <div className="block py-1 rounded">Delete Server</div>
                    <div className="my-auto">
                        <RiDeleteBin6Fill />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerSettingSideBar;
