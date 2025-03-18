"use client";

import Link from "next/link";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoInformationCircle } from "react-icons/io5";
import { HiMiniUsers } from "react-icons/hi2";
import { MdEventNote, MdOutlineNotes } from "react-icons/md";
import { FaUserPlus, FaUsersCog } from "react-icons/fa";
import { useRouter, usePathname, useParams } from "next/navigation";

const CategorySettingSidebar = ({category}) => {

    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const categoryId = params.categoryId;
    const active = pathname.split("/").filter(Boolean).pop();

    const menuItems = [
        { name: "Overview", path: "Overview", icon: IoInformationCircle },
        { name: "Permissions", path: "Permissions", icon: HiMiniUsers }
    ];

    return (
        <div className="p-6">
            <h2 className="font-bold uppercase text-indigo-500 mb-1">{category.name}</h2>
            <div className="h-[1px] w-full bg-indigo-400 mb-1" />

            <div className="space-y-[2px]">
                {menuItems.map(({ name, path, icon: Icon, permission = true }) =>
                    permission ? (
                        <div
                            key={path}
                            onClick={() => router.push(`/setting/category/${categoryId}/${path}`)}
                            className={`flex rounded cursor-pointer ${
                                active === path ? "bg-gray-300" : "hover:bg-gray-200"
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
                    className={`flex justify-between px-2 rounded cursor-pointer border border-red-500 ${
                        active === "m" ? "bg-red-500 text-white" : "text-red-500 hover:text-white hover:bg-red-500"
                    }`}
                >
                    <div className="block py-1 rounded">Delete Category</div>
                    <div className="my-auto">
                        <RiDeleteBin6Fill />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySettingSidebar;
