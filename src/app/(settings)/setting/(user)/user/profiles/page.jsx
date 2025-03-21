"use client";

import { useState, useEffect } from 'react';

const ProfileSettingPage = () => {
    const [activeProfile, setActiveProfile] = useState('user');
    const [displayName, setDisplayName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [avatar, setAvatar] = useState('/default-avatar.png'); // Default avatar
    const [aboutMe, setAboutMe] = useState('');
    const [serverNickname, setServerNickname] = useState('');
    const [serverPronouns, setServerPronouns] = useState('');
    const [selectedServer, setSelectedServer] = useState("");
    const [banner, setBanner] = useState('/default-banner.png'); // Default banner
    const [serverBanner, setServerBanner] = useState('/default-banner.png'); // Default server banner

    // Load saved data from localStorage after component mounts
    useEffect(() => {
        const savedAvatar = localStorage.getItem('avatar');
        const savedBanner = localStorage.getItem('banner');
        const savedServerBanner = localStorage.getItem('serverBanner');
        const savedDisplayName = localStorage.getItem('displayName');
        const savedPronouns = localStorage.getItem('pronouns');
        const savedAboutMe = localStorage.getItem('aboutMe');


        if (savedAvatar) setAvatar(savedAvatar);
        if (savedBanner) setBanner(savedBanner);
        if (savedServerBanner) setServerBanner(savedServerBanner);
        if (savedDisplayName) setDisplayName(savedDisplayName);
        if (savedPronouns) setPronouns(savedPronouns);
        if (savedAboutMe) setAboutMe(savedAboutMe);
    }, []);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
            localStorage.setItem('avatar', imageUrl); // Save to localStorage
        }
    };

    const handleBannerChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setBanner(imageUrl);
            localStorage.setItem('banner', imageUrl); // Save to localStorage
        }
    };

    const handleServerBannerChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setServerBanner(imageUrl);
            localStorage.setItem('serverBanner', imageUrl); // Save to localStorage
        }
    };

    const handleAboutMeChange = (event) => {
        const text = event.target.value;
        if (text.length <= 190) {
            setAboutMe(text);
            localStorage.setItem('aboutMe', text); // Save to localStorage
        }
    };

    const handleDisplayNameChange = (event) => {
        const text = event.target.value;
        setDisplayName(text);
        localStorage.setItem('displayName', text); // Save to localStorage
    };

    const handlePronounsChange = (event) => {
        const text = event.target.value;
        setPronouns(text);
        localStorage.setItem('pronouns', text); // Save to localStorage
    };

        }
    };

    return (
        <div className="bg-gray-50 text-indigo-500 p-6">
            <h2 className="text-xl font-bold">Profiles</h2>
            <div className="flex gap-8 mt-4">
                <button 
                    className={`p-2 ${activeProfile === 'user' ? 'border-b-2 border-indigo-500' : ''}`} 
                    onClick={() => setActiveProfile('user')}
                >
                    User Profile
                </button>
                <button 
                    className={`p-2 ${activeProfile === 'server' ? 'border-b-2 border-indigo-500' : ''}`} 
                    onClick={() => setActiveProfile('server')}
                >
                    Server Profile
                </button>
            </div>

            {activeProfile === 'user' && (
                <div className="mt-6">
                    <div className="flex gap-8">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-2">Display Name</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded" 
                                placeholder="Enter display name" 
                                value={displayName}
                                onChange={handleDisplayNameChange} // Updated handler
                                onChange={(e) => setDisplayName(e.target.value)}

                            />
                            <label className="block text-sm font-medium mt-4 mb-2">Pronouns</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded" 
                                placeholder="Enter pronouns" 
                                value={pronouns}
                                onChange={handlePronounsChange} // Updated handler
                                onChange={(e) => setPronouns(e.target.value)}
                            />
                            <label className="block text-sm font-medium mt-4 mb-2">
                                About Me 🌟 (max 190 characters)
                            </label>
                            <textarea 
                                className="w-full p-2 border rounded resize-none" 
                                placeholder="Tell us about yourself! Add emojis like 😊👍"
                                value={aboutMe}
                                onChange={handleAboutMeChange}
                                rows={4}
                                maxLength={190}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {aboutMe.length}/190 characters
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="text-sm font-medium mb-2">Preview</div>
                            <div className="border p-4 rounded">
                                <div className="relative w-full h-32 mb-4">
                                    <img 
                                        src={banner} 
                                        alt="Banner" 
                                        className="w-full h-full object-cover rounded"
                                    />
                                    <label 
                                        htmlFor="banner-upload" 
                                        className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded cursor-pointer"
                                    >
                                        Change Banner
                                    </label>
                                    <input 
                                        id="banner-upload" 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleBannerChange}
                                    />
                                </div>
                                <div className="flex">
                                    <div className="w-3/5 p-4">
                                        <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                                            <img 
                                                src={avatar} 
                                                alt="Avatar" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                            <div className="absolute flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                                                <label 
                                                    htmlFor="avatar-upload" 
                                                    className="text-white text-sm cursor-pointer flex items-center justify-center w-full h-full"
                                                >
                                                    Edit
                                                </label>
                                                <input 
                                                    id="avatar-upload" 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handleAvatarChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold">{displayName}</div>
                                        <div className="text-sm">{displayName} • {pronouns}</div>
                                        {aboutMe && (
                                            <div className="mt-2 text-sm text-gray-700">
                                                <span className="font-medium">About Me:</span> {aboutMe}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeProfile === 'server' && (
                <div className="mt-6">
                    <div className="flex gap-8">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-2 text-gray-600 uppercase">
                                Choose a Server
                            </label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={selectedServer}
                                onChange={(e) => setSelectedServer(e.target.value)}
                            >
                                <option value="server">ZAKOP's server</option>
                                <option value="Other Server">Other Server</option>
                            </select>

                            <label className="block text-sm font-medium mt-4 mb-2 uppercase">
                                Server Nickname
                            </label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded" 
                                placeholder="Enter server nickname" 
                                value={serverNickname}
                                onChange={(e) => setServerNickname(e.target.value)}
                            />

                            <label className="block text-sm font-medium mt-4 mb-2 uppercase">
                                Pronouns
                            </label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded" 
                                placeholder="Add your pronouns" 
                                value={serverPronouns}
                                onChange={(e) => setServerPronouns(e.target.value)}
                            />
                        </div>
                        <div className="w-1/2">
                            <div className="text-sm font-medium mb-2 uppercase">
                                Preview for {selectedServer}
                            </div>
                            <div className="border p-4 rounded">
                                <div className="relative w-full h-32 mb-4">
                                    <img 
                                        src={banner} 
                                        alt="Banner" 
                                        className="w-full h-full object-cover rounded"
                                    />
                                    <label 
                                        htmlFor="server-banner-upload" 
                                        className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded cursor-pointer"
                                    >
                                        Change Banner
                                    </label>
                                    <input 
                                        id="server-banner-upload" 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleServerBannerChange}
                                    />
                                </div>
                                <div className="flex">
                                    <div className="w-3/5 p-4">
                                        <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                                            <img 
                                                src={avatar} 
                                                alt="Avatar" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                            <div className="absolute flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                                                <label 
                                                    htmlFor="avatar-upload" 
                                                    className="text-white text-sm cursor-pointer flex items-center justify-center w-full h-full"
                                                >
                                                    Edit
                                                </label>
                                                <input 
                                                    id="avatar-upload" 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handleAvatarChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold">{serverNickname}</div>
                                        <div className="text-sm text-gray-600">
                                            {serverNickname} • {pronouns}
                                        </div>
                                        {aboutMe && (
                                            <div className="mt-2 text-sm text-gray-700">
                                                <span className="font-medium">About Me:</span> {aboutMe}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileSettingPage;