"use client"
import React, { useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa";

const AccountPage = () => {
    const [username, setUsername] = useState('johndoe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [avatar, setAvatar] = useState('');
  

    return (
        <div className="bg-gray-50 text-indigo-500 p-6">
            <h2 className="text-xl font-bold flex">
                My Account
            </h2>
            <p className="text-sm text-indigo-500 mb-1">
                {/*  */}
            </p>
            <UserProfile/>
        </div>
    )
}

const UserProfile=()=>{
  const [username, setUsername] = useState('gunjanpatel');
  const [displayName, setDisplayName] = useState('gunjanpatel');
  const [email, setEmail] = useState('**********@gmail.com');
  const [phone, setPhone] = useState('********9714');
  const [avatar, setAvatar] = useState('/placeholder.png');

  return (
    <div className="flex justify-center bg-gray-50 p-6 text-gray-900">
      <div className="bg-white shadow-md rounded-xl w-full max-w-2xl">
        {/* Profile Header */}
        <div className='w-full h-28 bg-gray-300 rounded-t-lg'></div>
        <div className="flex items-center gap-4 pb-0 p-6 pt-0 translate-y-[-15px]">
          <img src="/demoProfileImg.jpg" alt="avatar" className="w-28 h-28 rounded-full border-[8px] border-white bg-white translate-y-[-22px]" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 text-sm">Edit User Profile</button>
        </div>
        {/* Profile Details */}
        <div className="space-y-4 p-6 pb-0 mb-0 bg-gray-100 m-4 rounded-md translate-y-[-30px]">
          {[{ label: 'DISPLAY NAME', value: displayName },
            { label: 'USERNAME', value: username },
            { label: 'EMAIL', value: `${email} `, reveal: true },
            { label: 'PHONE NUMBER', value: `${phone} `, reveal: true, removable: true }].map(({ label, value, reveal, removable }, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-300 pb-2">
              <div>
                <p className="text-gray-600 text-sm">{label}</p>
                <p className="text-gray-800">
                  {value} {reveal && <span className="text-gray-700 cursor-pointer hover:text-gray-900">Reveal</span>}
                </p>
              </div>
              <div className="flex gap-2">
                {removable && <button className="text-red-600 hover:underline">Remove</button>}
                <button className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default AccountPage
