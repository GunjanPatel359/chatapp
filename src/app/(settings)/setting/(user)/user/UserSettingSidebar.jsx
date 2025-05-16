"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaRegUserCircle, FaArrowLeft } from "react-icons/fa";
import { SignOutButton } from '@clerk/nextjs'
import { MdLogout } from "react-icons/md";

const UserSettingSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const active = pathname.split("/").filter(Boolean).pop();

    const menuItems = [
        { name: "My Account", path: "account" },
        { name: "Profiles", path: "profiles" }
    ];

    return (
        <div className="p-6">
            <h2 className="font-bold uppercase text-indigo-500 mb-1">User Settings</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />

            <div className="space-y-[2px]">
                {menuItems.map(({ name, path, permission = true }) =>
                    permission ? (
                        <div
                            key={path}
                            onClick={() => router.push(`/setting/user/${path}`)}
                            className={`flex rounded cursor-pointer ${active === path ? "bg-gray-300" : "hover:bg-gray-200"
                                }`}
                        >
                            <div className="block py-1 rounded text-indigo-500 pl-2">{name}</div>
                        </div>
                    ) : null
                )}
                <div className="h-[1px] w-full bg-indigo-400 mb-1" />
                <div className="w-full h-[6px]"></div>
                <SignOutButton>
                    <button className="border border-red-500 text-red-500 w-full py-1 px-2 rounded hover:bg-red-500 hover:text-white transition-colors text-center">
                       <MdLogout size={22} className="inline"/> Log out
                    </button>
                    </SignOutButton>
            </div>
        </div>
    );
};

export default UserSettingSidebar;