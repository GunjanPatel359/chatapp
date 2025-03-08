"use client";

import { serverSetting } from "@/hooks/zusthook";
import React, { useState } from "react";
import { IoInformationCircle } from "react-icons/io5";

const Overview = () => {
  const { server, updateServerLogo } = serverSetting(); // Add updateServerLogo to your Zustand store
  const [serverName, setServerName] = useState(server?.name || "");
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [stickerPrompt, setStickerPrompt] = useState(true);
  const [logo, setLogo] = useState(server?.logo || null); // State to store the uploaded logo
  const [showPopup, setShowPopup] = useState(false); // State to control the popup

  if (!server) {
    return <div>Loading</div>;
  }

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result); // Set the logo as a base64 string
        setShowPopup(true); // Show the popup
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle popup confirmation
  const handleConfirmUpdate = async () => {
    try {
      // Call an API to update the server logo in the database
      const response = await fetch("/api/updateServerLogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: server.id, logo }),
      });
      const data = await response.json();

      if (data.success) {
        // Update the logo in the Zustand store
        updateServerLogo(logo);
        setShowPopup(false); // Close the popup
      } else {
        console.error("Failed to update logo:", data.message);
      }
    } catch (error) {
      console.error("Error updating logo:", error);
    }
  };

  return (
    <div className="bg-gray-200 text-indigo-500 p-6">
      <h2 className="text-xl font-bold flex">
        <IoInformationCircle className="my-auto mr-1" size={30} />
        Overview
      </h2>
      <p className="text-sm text-indigo-500">
        {/* Add a description if needed */}
      </p>

      {/* Logo Upload Section */}
      <div className="flex justify-center items-center w-28 h-28 py-8 bg-gray-50 rounded-full mx-auto cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload"
        />
        <label htmlFor="logo-upload" className="cursor-pointer">
          {logo ? (
            <img
              src={logo}
              alt="Server Logo"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-indigo-500">Logo</span>
          )}
        </label>
      </div>

      {/* Popup for Confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-indigo-500">Update Logo</h3>
            <p className="text-sm text-indigo-500 mb-4">
              Are you sure you want to update the server logo?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-sm text-indigo-500 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="px-4 py-2 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Server Name */}
      <div className="mb-2">
        <h2 className="text-indigo-500 font-semibold">Server Name</h2>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="w-full bg-white text-indigo-500 placeholder:text-indigo-400 rounded p-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Server Description */}
      <div className="mb-4">
        <h3 className="text-indigo-500 mt-4 font-semibold">Server Description</h3>
        <textarea
          className="w-full bg-white text-indigo-500 rounded p-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-indigo-400"
          placeholder="Write a description for the inactive channel..."
          rows="3"
        ></textarea>
      </div>

      {/* System Messages Settings */}
      <div>
        <h2 className="font-semibold mb-2 text-indigo-500">System Messages Settings</h2>
        <div className="mb-4">
          <h3 className="text-indigo-500">Channel</h3>
          <div className="flex items-center justify-between bg-white p-3 py-2 rounded mt-2">
            <span className="text-indigo-500 text-sm">general</span>
            <button className="text-indigo-500 text-sm">Edit</button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-indigo-500">Send a random welcome message when someone joins this server.</span>
            <input
              type="checkbox"
              checked={welcomeMessage}
              onChange={() => setWelcomeMessage(!welcomeMessage)}
              className="w-5 h-5 accent-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-500">Prompt members to reply to welcome messages with a sticker.</span>
            <input
              type="checkbox"
              checked={stickerPrompt}
              onChange={() => setStickerPrompt(!stickerPrompt)}
              className="w-5 h-5 accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;