"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCog, FaWrench, FaChevronDown } from "react-icons/fa";
import { X, Minus, Check } from "lucide-react";
import { motion } from "framer-motion";

import { Dialog } from "@headlessui/react";

const options = [
  { value: "DENY", icon: <X className="text-red-500" />, bg: "bg-red-300", border: "border-red-300", color: "red" },
  { value: "NEUTRAL", icon: <Minus className="text-gray-500" />, bg: "bg-gray-100", border: "border-gray-300", color: "gray" },
  { value: "ALLOW", icon: <Check className="text-green-500" />, bg: "bg-green-300", border: "border-green-300", color: "green" },
];

const page = () => {
  const [channelInfo, setchannelInfo] = useState("channel Name");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDropdownRole, setSelectedDropdownRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize permissions state for each permission item
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

  const roles = ["Role 1", "Role 2", "Role 3", "Everyone Role"];

  const handleRoleSelect = (role) => {
    setSelectedDropdownRole(role);
  };

  // Update the permission state for a specific permission item
  const handlePermissionClick = (permission, value) => {
    setPermissionsState((prevState) => ({
      ...prevState,
      [permission]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white pt-8">
      <div className="w-full max-w-6xl flex gap-6 p-8 h-fit">
        <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-indigo-500 text-center">Server Settings</h2>
          <textarea
            value={channelInfo}
            onChange={(e) => setchannelInfo(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded font-medium text-indigo-500"
          />
          <Button className="mt-2 w-full bg-indigo-500 font-bold">Update Settings</Button>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-indigo-500 text-center">Channel Roles</h3>
            <Button className="w-full bg-indigo-500 mb-2 font-bold" onClick={() => setIsDialogOpen(true)}>
              Add Role
            </Button>

            <div className="relative w-full">
              <div
                className="w-full p-2 bg-white border border-gray-200 rounded mb-1 flex items-center justify-between cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="font-bold text-indigo-500">{selectedDropdownRole || "Select a Role"}</span>
                <FaChevronDown className={`transform transition-transform text-indigo-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isDropdownOpen && (
                <div className="absolute w-full bg-white rounded-md mt-1 shadow-lg z-10 border border-gray-200">
                  {roles.map((role, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <span 
                        className="font-bold text-indigo-500"
                        onClick={() => {
                          setSelectedDropdownRole(role);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {role}
                      </span>
                      <FaCog 
                        className="text-indigo-500 hover:text-indigo-600 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleSelect(role);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {(selectedRole || selectedDropdownRole) && (
          <div className="w-2/3 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-indigo-500 text-center">
              {(selectedRole || selectedDropdownRole)} Settings
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-500 text-center">Permissions</h3>
              
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-md font-bold mb-3 text-indigo-500">General Permissions</h4>
                <div className="space-y-2">
                  {['View Channel', 'Manage Channels', 'Manage Roles'].map((permission) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="font-bold text-indigo-500">{permission}</span>
                      <div className="flex space-x-2">
                        {options.map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-1 rounded border ${
                              permissionsState[permission] === option.value ? option.bg : "bg-gray-100"
                            } ${option.border}`}
                            onClick={() => handlePermissionClick(permission, option.value)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {option.icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-md font-bold mb-3 text-indigo-500">Member Permissions</h4>
                <div className="space-y-2">
                  {['Create Invite'].map((permission) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="font-bold text-indigo-500">{permission}</span>
                      <div className="flex space-x-2">
                        {options.map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-1 rounded border ${
                              permissionsState[permission] === option.value ? option.bg : "bg-gray-100"
                            } ${option.border}`}
                            onClick={() => handlePermissionClick(permission, option.value)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {option.icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-md font-bold mb-3 text-indigo-500">Text Channel Permissions</h4>
                <div className="space-y-2">
                  {['Send Message', 'Attach Files', 'Manage Message', 'See Message History'].map((permission) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="font-bold text-indigo-500">{permission}</span>
                      <div className="flex space-x-2">
                        {options.map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-1 rounded border ${
                              permissionsState[permission] === option.value ? option.bg : "bg-gray-100"
                            } ${option.border}`}
                            onClick={() => handlePermissionClick(permission, option.value)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {option.icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-md font-bold mb-3 text-indigo-500">Voice Channel Permissions</h4>
                <div className="space-y-2">
                  {['Connect', 'Speak', 'Video', 'muteMembers', 'deafenMembers'].map((permission) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="font-bold text-indigo-500">{permission}</span>
                      <div className="flex space-x-2">
                        {options.map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-1 rounded border ${
                              permissionsState[permission] === option.value ? option.bg : "bg-gray-100"
                            } ${option.border}`}
                            onClick={() => handlePermissionClick(permission, option.value)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {option.icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button className="bg-indigo-500 font-bold">Save Changes</Button>
                <Button 
                  className="bg-gray-200 text-indigo-500 font-bold"
                  onClick={() => {
                    setSelectedRole(null);
                    setSelectedDropdownRole(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;