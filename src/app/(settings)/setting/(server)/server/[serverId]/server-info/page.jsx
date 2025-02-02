"use client"

import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";

const Overview = ({ initialServerName }) => {
  const [serverName, setServerName] = useState(initialServerName || "My Server");
  const [inactiveChannel, setInactiveChannel] = useState("No Inactive Channel");
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [stickerPrompt, setStickerPrompt] = useState(true);

  return (
    <div className="min-h-screen bg-white text-indigo-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaRegEye className="text-2xl mr-2" />
          <h1 className="text-2xl font-bold">Overview</h1>Y
        </div>
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-indigo-500">Logo</span>
        </div>
      </div>

      {/* Server Name */}
      <div className="mb-6">
        <h2 className="text-sm text-indigo-500">Server Name</h2>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="w-full bg-gray-200 text-indigo-500 rounded-md p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Inactive Settings */}
      <div className="mb-6">
        <h2 className="text-sm text-indigo-500">Inactive Channel</h2>
        <p className="text-sm text-indigo-500 mb-2">This section allows you to manage inactive channels for your server.</p>
        
        {/* New Description Title and Textbox */}
        <h3 className="text-sm text-indigo-500 mt-4">Channel Description</h3>
        <textarea
          className="w-full bg-gray-200 text-indigo-500 rounded-md p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write a description for the inactive channel..."
          rows="3"
        ></textarea>
        
        <div className="flex items-center justify-between bg-gray-200 p-3 rounded-md mt-2">
          <span className="text-indigo-500">{inactiveChannel}</span>
          <button className="text-indigo-500">Edit</button>
        </div>
        <p className="text-sm text-indigo-500 mt-2">
          Automatically move members to this channel and mute them when they
          have been idle for longer than the inactive timeout. This does not
          affect browsers.
        </p>
      </div>

      {/* System Messages Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-indigo-500">System Messages Settings</h2>
        <div className="mb-4">
          <h3 className="text-sm text-indigo-500">Channel</h3>
          <div className="flex items-center justify-between bg-gray-200 p-3 rounded-md mt-2">
            <span className="text-indigo-500">general</span>
            <button className="text-indigo-500">Edit</button>
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