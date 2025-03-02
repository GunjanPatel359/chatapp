"use client"
import React, { useState } from 'react'
import { HiMiniPlusCircle } from "react-icons/hi2";
import { motion } from "framer-motion";
import { X, Minus, Check } from "lucide-react";

const PermissionRoleComponent = () => {
    const [permissionsState, setPermissionsState] = useState({
        "View Channel": "NEUTRAL",
        "Manage Channels": "NEUTRAL",
        "Manage Roles": "NEUTRAL",
        "Create Invite": "NEUTRAL",
        "Send Message": "NEUTRAL",
        "Attach Files": "NEUTRAL",
        "Manage Message": "NEUTRAL",
        "See Message History": "NEUTRAL",
        "Connect": "NEUTRAL",
        "Speak": "NEUTRAL",
        "Video": "NEUTRAL",
        "muteMembers": "NEUTRAL",
        "deafenMembers": "NEUTRAL",
    });
    return (
        <div className="p-6 w-full">
            <h2 className="text-indigo-600 text-lg font-semibold mb-2">Category Permissions</h2>
            <p className="text-indigo-500 text-sm font-medium mb-2">Uses permissions to customize who can do what in this category</p>
            <div className='h-[2px] w-full bg-indigo-300'></div>
            <div className='flex mt-4'>
                <div className='w-[35%]'>
                    <div className='flex justify-between px-3 py-2 font-bold text-indigo-600'>
                        <div className='text-center'>ROLES</div>
                        <div><HiMiniPlusCircle size={25} /></div>
                    </div>
                    <div>
                        <RoleItem name="Level1" color="bg-purple-500" />
                        <RoleItem name="Level2" color="bg-red-500" />
                        <RoleItem name="@everyone" color="bg-gray-500" />
                    </div>
                    <div className='w-[90%] mx-auto mt-2'>
                        <div className='h-[1px] w-full bg-indigo-400'></div>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='px-2 py-2 font-bold text-indigo-600 text-sm'>
                        GENERAL CATEGORY PERMISSION
                    </div>
                    <div className='px-2'>
                    {Object.keys(permissionsState).map((key) => (
                        <PermissionRow
                        key={key}
                        title={key}
                        description={`Allows members to ${key.toLowerCase()}.`}
                        state={permissionsState}
                        setState={setPermissionsState}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const RoleItem = ({ name, color }) => {
    return (
        <div className="flex items-center space-x-2 py-[5px] px-3 text-sm rounded cursor-pointer hover:bg-gray-300">
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
  
  const PermissionRow = ({ title, description, state, setState }) => {
    const handleClick = (value) => {
      setState((prevState) => ({ ...prevState, [title]: value }));
    };
  
    return (
      <div className="border-b border-gray-300 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-indigo-600 font-medium" style={{ color: options.find(opt => opt.value === state[title])?.color }}>{title}</h3>
          <div className="flex space-x-2">
            {options.map((opt) => (
              <PermissionButton 
                key={opt.value} 
                type={opt.value} 
                onClick={() => handleClick(opt.value)} 
                isSelected={state[title] === opt.value}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
    );
  };
  

export default PermissionRoleComponent
