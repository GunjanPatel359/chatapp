"use client"

import { serverSetting } from "@/hooks/zusthook";
import React, { useState } from "react";
import { IoInformationCircle } from "react-icons/io5";

const Overview = () => {
  const {server}=serverSetting()
  if(!server){
    return <div>Loading</div>
  }
  const [serverName, setServerName] = useState(server.name);
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [stickerPrompt, setStickerPrompt] = useState(true);

  return (
    <div className="bg-gray-200 text-indigo-500 p-6">
      <h2 className="text-xl font-bold flex">
        <IoInformationCircle className="my-auto mr-1" size={30} />
        Overview
      </h2>
      <p className="text-sm text-indigo-500">
        {/*  */}
      </p>

      <div className="flex justify-center items-center w-28 h-28 py-8 bg-gray-50 rounded-full mx-auto">
        <span className="text-indigo-500">Logo</span>
      </div>
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

      {/* Inactive Settings */}
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