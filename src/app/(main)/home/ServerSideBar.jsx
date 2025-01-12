"use client"
import React, { useState } from "react";
import { FaUserFriends, FaHashtag, FaBell, FaCog } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { MdForum } from "react-icons/md";

const ServerSideBar = () => {
    // State to handle collapsible sections
    const [isForumsOpen, setForumsOpen] = useState(true);
    const [isGeneralOpen, setGeneralOpen] = useState(true);

    return (
        <div className="w-[300px] h-screen bg-gray-50 text-indigo-500 flex flex-col">
            {/* Server Header */}
            <div className="p-2 pl-4 bg-gray-100 flex items-center space-x-2 border-b border-gray-100 shadow">
                {/* <img
                    src="https://via.placeholder.com/40"
                    alt="Server Icon"
                    className="w-10 h-10 rounded-full"
                /> */}
                <div className="w-10 h-10 rounded-full bg-gray-400">
                    N
                </div>
                <span className="font-bold text-indigo-500">Neon</span>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-hide">
                {/* Section: Welcome */}
                <SidebarSection title="welcome">
                    <SidebarItem name="announcements" icon={FaBell} />
                    <SidebarItem name="neon-blog" icon={FaHashtag} />
                    <SidebarItem name="neon-changelog" icon={FaHashtag} />
                </SidebarSection>

                {/* Section: Forums */}
                <SidebarSection
                    title="Forums"
                    isOpen={isForumsOpen}
                    toggleOpen={() => setForumsOpen(!isForumsOpen)}
                >
                    {isForumsOpen && (
                        <>
                            <SidebarItem name="questions-answers" icon={MdForum} badge="12 New" />
                            <SidebarItem name="feedback" icon={MdForum} badge="2 New" />
                        </>
                    )}
                </SidebarSection>

                {/* Section: General */}
                <SidebarSection
                    title="General"
                    isOpen={isGeneralOpen}
                    toggleOpen={() => setGeneralOpen(!isGeneralOpen)}
                >
                    {isGeneralOpen && (
                        <>
                            <SidebarItem name="neon-status" icon={FaHashtag} />
                            <SidebarItem name="gpt-help" icon={FaHashtag} />
                            <SidebarItem name="neon-early-access" icon={FaHashtag} />
                            <SidebarItem name="showcase" icon={FaHashtag} badge="1 New" />
                        </>
                    )}
                </SidebarSection>
            </div>

            {/* Footer */}
            <div className="p-1 space-x-2 border-t border-indigo-200">
                <div className="hover:bg-gray-200 flex items-center p-2 rounded cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                        G
                    </div>
                    <div className="flex-1 ml-2">
                        <h3 className="text-sm font-bold text-indigo-500">gunjanpatel</h3>
                        <p className="text-xs text-gray-400">Idle</p>
                    </div>
                    <div className="flex space-x-2 text-gray-400">
                        <button>
                            <IoSettingsSharp size={22} className="text-indigo-500 transition-all duration-500 hover:rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ name, icon: Icon, badge }) => (
    <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md cursor-pointer">
        <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5" />
            <span className="text-sm">{name}</span>
        </div>
        {badge && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
);

const SidebarSection = ({ title, children, isOpen, toggleOpen }) => (
    <div>
        <div
            className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-gray-700 rounded-md"
            onClick={toggleOpen}
        >
            <span className="text-sm font-semibold uppercase">{title}</span>
            {toggleOpen && (
                <span className="text-sm">
                    {isOpen ? "-" : "+"}
                </span>
            )}
        </div>
        {children}
    </div>
);

export default ServerSideBar;
