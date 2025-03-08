"use client"

import { useState } from 'react';

const ProfileSettingPage = () => {
    const [activeProfile, setActiveProfile] = useState('user');
    const [displayName, setDisplayName] = useState('ZAKOP');
    const [pronouns, setPronouns] = useState('AKA OLLA(•U•)');
    const [avatar, setAvatar] = useState('/default-avatar.png');
    const [aboutMe, setAboutMe] = useState('');
    const [serverNickname, setServerNickname] = useState('ZAKOP'); // Added for server profile
    const [serverPronouns, setServerPronouns] = useState(''); // Added for server profile
    const [selectedServer, setSelectedServer] = useState("ZAKOP'S server"); // Added for server selection

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    const handleAboutMeChange = (event) => {
        const text = event.target.value;
        if (text.length <= 190) {
            setAboutMe(text);
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
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                            <label className="block text-sm font-medium mt-4 mb-2">Pronouns</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded" 
                                placeholder="Enter pronouns" 
                                value={pronouns}
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
                                <div className="relative w-24 h-24 mb-4">
                                    <img 
                                        src={avatar} 
                                        alt="Avatar" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
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
                                <div className="text-sm">aka_{displayName} • {pronouns}</div>
                                {aboutMe && (
                                    <div className="mt-2 text-sm text-gray-700">
                                        <span className="font-medium">About Me:</span> {aboutMe}
                                    </div>
                                )}
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
                                <option value="ZAKIR HUSSAIN'S server">ZAKOP's server</option>
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
                            <div className="border p-4 rounded bg-white shadow-lg">
                                <div className="relative w-16 h-16 mb-4">
                                    <img 
                                        src={avatar} 
                                        alt="Avatar" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    <div className="absolute -top-1 -right-1 w-6 h-6  rounded-full flex items-center justify-center border-2 border-white">
                                        <span className="text-white text-xs">✖</span>
                                    </div>
                                    <div className="absolute top-0 right-0 w-6 h-6  rounded-full flex items-center justify-center border-2 border-white">
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6  rounded-full flex items-center justify-center border-2 border-white">
                                    </div>
                                </div>
                                <div className="text-lg font-bold">{serverNickname}</div>
                                <div className="text-sm text-gray-600">
                                    aka_{serverNickname} • {serverPronouns}
                                </div>
                                <div className="mt-2 text-sm text-gray-700">{aboutMe}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileSettingPage;