"use client";

import { serverSetting } from "@/hooks/zusthook";
import { updateServerAvatar } from "@/actions/server";
import React, { useState } from "react";
import { IoInformationCircle } from "react-icons/io5";

const Overview = () => {
  const { server } = serverSetting();
  const [serverName, setServerName] = useState(server?.name || "");
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [stickerPrompt, setStickerPrompt] = useState(true);
  const [logo, setLogo] = useState(server?.imageUrl || null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  if (!server) {
    return <div>Loading</div>;
  }

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
      return;
    }

    // Validate file size (1MB)
    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError("File size exceeds the 1MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target.result);
      setShowPopup(true);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpdate = async () => {
    try {
      const formData = new FormData();
      const fileInput = document.querySelector('#logo-upload');
      formData.append('file', fileInput.files[0]);

      const data = await updateServerAvatar(server.id,formData);

      if (data.success) {
        updateServerAvatar(data.img_url);
        setShowPopup(false);
        setError(null);
      } else {
        setError(data.message || "Failed to update logo");
      }
    } catch (err) {
      setError("Error updating logo");
      console.error(err);
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
          accept="image/png, image/jpeg, image/jpg"
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
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

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

      {/* Rest of the existing UI remains unchanged */}
      <div className="mb-2">
        <h2 className="text-indigo-500 font-semibold">Server Name</h2>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="w-full bg-white text-indigo-500 placeholder:text-indigo-400 rounded p-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-indigo-500 mt-4 font-semibold">Server Description</h3>
        <textarea
          className="w-full bg-white text-indigo-500 rounded p-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-indigo-400"
          placeholder="Write a description for the inactive channel..."
          rows="3"
        ></textarea>
      </div>

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