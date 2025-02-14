import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react'

import { FaRegUserCircle } from "react-icons/fa";
// import { RiDeleteBin6Fill } from "react-icons/ri";
// import { HiMiniUsers } from "react-icons/hi2";
// import { MdEventNote, MdOutlineNotes } from "react-icons/md";
// import { FaUserPlus, FaUsersCog } from "react-icons/fa";

const UserSettingSidebar = () => {
    const pathname=usePathname()
    const active=pathname.split("/").filter(Boolean).pop();
    const menuItems = [
        { name: "My Account", path: "account"},
        { name: "Profiles", path: "profile"},
        // { name: "Roles", path: "server-roles", icon: HiMiniUsers },
        // { name: "Categories", path: "server-categories", icon: MdEventNote },
        // { name: "Channels", path: "server-channels", icon: MdOutlineNotes }
    ];

    // const userManagementItems = [
    //     { name: "Members", path: "manage-members", icon: FaUsersCog },
    //     { name: "Invites", path: "manage-invites", icon: FaUserPlus }
    // ];
  return (
    <div className="p-6">
    <h2 className="font-bold uppercase text-indigo-500 mb-1">{"User Settings"}</h2>
    <div className="h-[1px] w-full bg-indigo-400 mb-1" />

    <div className="space-y-[2px]">
        {menuItems.map(({ name, path, permission = true }) =>
            permission ? (
                <div
                    key={path}
                    // onClick={() => router.push(`/setting/server/${serverId}/${path}`)}
                    className={`flex rounded cursor-pointer ${
                        active === path ? "bg-gray-300" : "hover:bg-gray-200"
                    }`}
                >
                    <div className="block py-1 rounded text-indigo-500 pl-2">{name}</div>
                </div>
            ) : null
        )}
    </div>

    {/* <h2 className="font-bold uppercase text-indigo-500 mt-1 mb-1">User Management</h2>
    <div className="h-[1px] w-full bg-indigo-400 mb-1" />
    <div>
        {userManagementItems.map(({ name, path, icon: Icon }) => (
            <div
                key={path}
                // onClick={() => router.push(`/setting/server/${serverId}/${path}`)}
                className={`flex rounded cursor-pointer ${
                    active === path ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
            >
                <div className="my-auto mx-1 text-indigo-500">
                    <Icon size={20} />
                </div>
                <div className="block py-1 rounded text-indigo-500">{name}</div>
            </div>
        ))}
    </div>

    <div className="h-[1px] w-full bg-indigo-400 mb-1 mt-1" />
    <div className="mt-2">
        <div
            onClick={() => router.push("m")}
            className={`flex justify-between px-2 rounded cursor-pointer border border-red-500 ${
                active === "m" ? "bg-red-500 text-white" : "text-red-500 hover:text-white hover:bg-red-500"
            }`}
        >
            <div className="block py-1 rounded">Delete Server</div>
            <div className="my-auto">
                <RiDeleteBin6Fill />
            </div>
        </div>
    </div> */}
</div>
  )
}

export default UserSettingSidebar
