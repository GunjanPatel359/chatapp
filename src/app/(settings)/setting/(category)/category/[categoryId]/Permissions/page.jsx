"use client"
import React, { useState } from 'react'
import { HiMiniPlusCircle } from "react-icons/hi2";
import { motion } from "framer-motion";
import { X, Minus, Check } from "lucide-react";

const permissionData = {
  general: [
    { key: "viewChannel", title: "View Channel", description: "Allows members to view channels." },
    { key: "manageChannels", title: "Manage Channels", description: "Allows members to manage channels." },
    { key: "manageRoles", title: "Manage Roles", description: "Allows members to manage roles." }
  ],
  member: [
    { key: "createInvite", title: "Create Invite", description: "Allows members to create invites." }
  ],
  text: [
    { key: "sendMessages", title: "Send Messages", description: "Allows members to send messages." },
    { key: "attachFiles", title: "Attach Files", description: "Allows members to attach files." },
    { key: "manageMessages", title: "Manage Messages", description: "Allows members to manage messages." },
    { key: "seeMessageHistory", title: "See Message History", description: "Allows members to see past messages." }
  ],
  voice: [
    { key: "connect", title: "Connect", description: "Allows members to connect to voice channels." },
    { key: "speak", title: "Speak", description: "Allows members to speak in voice channels." },
    { key: "video", title: "Video", description: "Allows members to stream video." },
    { key: "muteMembers", title: "Mute Members", description: "Allows members to mute others." },
    { key: "deafenMembers", title: "Deafen Members", description: "Allows members to deafen others." }
  ]
};

const PermissionRoleComponent = () => {
  const [selectedRoleId, setSelectedRoleId] = useState(3);
  const [permissions, setPermissions] = useState({
    viewChannel: "NEUTRAL",
    manageChannels: "NEUTRAL",
    manageRoles: "NEUTRAL",
    createInvite: "NEUTRAL",
    sendMessages: "NEUTRAL",
    attachFiles: "NEUTRAL",
    manageMessages: "NEUTRAL",
    seeMessageHistory: "NEUTRAL",
    connect: "NEUTRAL",
    speak: "NEUTRAL",
    video: "NEUTRAL",
    muteMembers: "NEUTRAL",
    deafenMembers: "NEUTRAL"
  });

  return (
    <div className="p-6 w-full">
      <h2 className="text-indigo-600 text-lg font-semibold mb-2">Category Permissions</h2>
      <p className="text-indigo-500 text-sm font-medium mb-2">
        Uses permissions to customize who can do what in this category
      </p>
      <div className="h-[2px] w-full bg-indigo-300"></div>

      <div className="flex mt-4">
        {/* Roles Section */}
        <div className="w-[35%]">
          <div className="flex justify-between px-3 py-2 font-bold text-indigo-600">
            <div className="text-center">ROLES</div>
            <div><HiMiniPlusCircle size={25} /></div>
          </div>
          <div className="flex flex-col gap-1">
            <RoleItem name="Level1" color="bg-purple-500" active={selectedRoleId === 1} clickFun={() => setSelectedRoleId(1)} />
            <RoleItem name="Level2" color="bg-red-500" active={selectedRoleId === 2} clickFun={() => setSelectedRoleId(2)} />
            <RoleItem name="@everyone" color="bg-gray-500" active={selectedRoleId === 3} clickFun={() => setSelectedRoleId(3)} />
          </div>
          <div className="w-[100%] mx-auto mt-2">
            <div className="h-[1px] w-full bg-indigo-400"></div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="flex-1">
          {Object.entries(permissionData).map(([category, permissionsArray]) => (
            <div key={category}>
              <div className="px-2 mt-4 font-bold text-indigo-600 text-sm">
                {category.toUpperCase()} PERMISSIONS
              </div>
              <div className="px-2">
                {permissionsArray.map(({ key, title, description }) => (
                  <PermissionRow
                    key={key}
                    title={title}
                    description={description}
                    state={permissions}
                    setState={setPermissions}
                    permissionKey={key}
                  />
                ))}
              </div>
              <div className="w-full bg-indigo-400 h-[1px] mt-4"></div>
            </div>
          ))}
          <div className='mt-4 text-end'>
          <span className='bg-indigo-500 py-2 px-4 text-white rounded cursor-pointer'>Save</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const RoleItem = ({ name, color, active, clickFun }) => {
  return (
    <div
      className={`flex items-center space-x-2 py-[5px] px-3 text-sm rounded cursor-pointer hover:bg-gray-300 ${active ? "bg-gray-300" : ""}`}
      onClick={clickFun}
    >
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-indigo-600 font-medium">{name}</span>
    </div>
  );
};

const options = [
  { value: "DENY", icon: X, bg: "bg-[rgb(255,59,48)]", border: "border-[rgb(200,0,0)]", color: "rgb(255,59,48)" },
  { value: "NEUTRAL", icon: Minus, bg: "bg-[rgb(142,142,147)]", border: "border-[rgb(99,99,102)]", color: "rgb(142,142,147)" },
  { value: "ALLOW", icon: Check, bg: "bg-[rgb(50,215,75)]", border: "border-[rgb(36,150,55)]", color: "rgb(50,215,75)" },
];

const PermissionButton = ({ type, onClick, isSelected }) => {
  const option = options.find((opt) => opt.value === type);
  return (
    <motion.button
      className={`p-1 rounded border ${isSelected ? option.bg : "bg-gray-200"} ${option.border} hover:opacity-80 transition-all duration-300`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <option.icon size={15} style={{ color: isSelected ? "white" : option.color }} />
    </motion.button>
  );
};

const PermissionRow = ({ title, description, state, setState, permissionKey }) => {
  const handleClick = (value) => {
    setState((prevState) => ({ ...prevState, [permissionKey]: value }));
  };

  return (
    <div className="border-b border-gray-300 py-2">
      <div className="flex justify-between items-center">
        <h3 className="text-indigo-600 font-medium">{title}</h3>
        <div className="flex space-x-2">
          {options.map((opt) => (
            <PermissionButton
              key={opt.value}
              type={opt.value}
              onClick={() => handleClick(opt.value)}
              isSelected={state[permissionKey] === opt.value}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
  );
};

export default PermissionRoleComponent;
