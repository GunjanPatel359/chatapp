"use client"
import React, { useState, useEffect } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { getUserProfile } from '@/actions/user';

const AccountPage = () => {
    return (
        <div className="bg-gray-50 text-indigo-500 p-6">
            <h2 className="text-xl font-bold flex">
                My Account
            </h2>
            <p className="text-sm text-indigo-500 mb-1">
                {/* You can put breadcrumb or helper text here */}
            </p>
            <UserProfile />
        </div>
    )
}

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveClick = () => {
    setUser(prevUser => ({
      ...prevUser,
      [editingField]: tempValue,
    }));
    setEditingField(null);
  };

  const handleCancelClick = () => {
    setEditingField(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Failed to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 p-6 text-gray-900">
      <div className="bg-white shadow-md rounded-xl w-full max-w-2xl">
        {/* Profile Header */}
        <div className='w-full h-28 bg-gray-300 rounded-t-lg'></div>
        <div className="flex items-center gap-4 pb-0 p-6 pt-0 translate-y-[-15px]">
          <img src={user.avatar || "/demoProfileImg.jpg"} alt="avatar" className="w-28 h-28 rounded-full border-[8px] border-white bg-white translate-y-[-22px]" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{user.username || "Unknown User"}</h2>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 text-sm">Edit User Profile</button>
        </div>
        {/* Profile Details */}
        <div className="space-y-4 p-6 pb-0 mb-0 bg-gray-100 m-4 rounded-md translate-y-[-30px]">
          {[
            { label: 'DISPLAY NAME', field: 'displayName', value: user.displayName || user.username },
            { label: 'USERNAME', field: 'username', value: user.username },
            { label: 'EMAIL', field: 'email', value: user.email },
            { label: 'PHONE NUMBER', field: 'phone', value: user.phone }
          ].map(({ label, field, value }, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-300 pb-2">
              <div>
                <p className="text-gray-600 text-sm">{label}</p>
                {editingField === field ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="mt-1 p-1 border rounded w-full"
                  />
                ) : (
                  <p className="text-gray-800">{value || 'N/A'}</p>
                )}
              </div>
              <div className="flex gap-2">
                {editingField === field ? (
                  <>
                    <button onClick={handleSaveClick} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Save</button>
                    <button onClick={handleCancelClick} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(field, value)} className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
