"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCog, FaWrench, FaChevronDown } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

const page = () => {
  const [categoryInfo, setCategoryInfo] = useState("Category Name");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDropdownRole, setSelectedDropdownRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = ["Role 1", "Role 2", "Role 3", "Everyone Role"];

  const handleRoleSelect = (role) => {
    setSelectedDropdownRole(role);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white pt-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex gap-6 p-8 h-fit">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-indigo-500 text-center">Server Settings</h2>
          <textarea
            value={categoryInfo}
            onChange={(e) => setCategoryInfo(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded font-medium text-indigo-500"
          />
          <Button className="mt-2 w-full bg-indigo-500 font-bold">Update Settings</Button>

          {/* Category Roles Section */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-indigo-500 text-center">Category Roles</h3>
            <Button className="w-full bg-indigo-500 mb-2 font-bold" onClick={() => setIsDialogOpen(true)}>
              Add Role
            </Button>

            {/* Custom Dropdown Menu */}
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

        {/* Role Settings Panel */}
        {(selectedRole || selectedDropdownRole) && (
          <div className="w-2/3 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-indigo-500 text-center">
              {(selectedRole || selectedDropdownRole)} Settings
            </h2>
            
            {/* Permissions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-500 text-center">Permissions</h3>
              
              {/* General Permissions */}
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-md font-bold mb-3 text-indigo-500">General Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-500">View Channel</span>
                    <select className="bg-white border border-gray-200 p-1 rounded text-indigo-500 font-medium">
                      <option value="ALLOW">Allow</option>
                      <option value="NEUTRAL">Neutral</option>
                      <option value="DENY">Deny</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-500">Manage Channels</span>
                    <select className="bg-white border border-gray-200 p-1 rounded text-indigo-500 font-medium">
                      <option value="ALLOW">Allow</option>
                      <option value="NEUTRAL">Neutral</option>
                      <option value="DENY">Deny</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Permissions */}
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-md font-bold mb-3 text-indigo-500">Text Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-500">Send Messages</span>
                    <select className="bg-white border border-gray-200 p-1 rounded text-indigo-500 font-medium">
                      <option value="ALLOW">Allow</option>
                      <option value="NEUTRAL">Neutral</option>
                      <option value="DENY">Deny</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-500">Attach Files</span>
                    <select className="bg-white border border-gray-200 p-1 rounded text-indigo-500 font-medium">
                      <option value="ALLOW">Allow</option>
                      <option value="NEUTRAL">Neutral</option>
                      <option value="DENY">Deny</option>
                    </select>
                  </div>
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

        {/* Dialog Box for Adding Roles */}
        {isDialogOpen && (
          <Dialog onClose={() => setIsDialogOpen(false)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-lg font-bold mb-3 text-indigo-500 text-center">Add Role</h2>
                <div className="space-y-2">
                  {roles.map((role, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100">
                      <span className="font-bold text-indigo-500">{role}</span>
                      <FaWrench 
                        className="cursor-pointer text-indigo-500 hover:text-indigo-600" 
                        onClick={() => setSelectedRole(role)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default page;
