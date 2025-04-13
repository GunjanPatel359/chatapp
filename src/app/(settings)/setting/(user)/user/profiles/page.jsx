"use client";

import { getUserProfile, getUserServerProfile, getUserServerProfileList, updateUserBanner, updateUserImage, updateUserProfile, updateUserServerBannerImage, updateUserServerProfileDetails, updateUserServerProfileImage } from "@/actions/user";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const ProfileSettingPage = () => {
    const [activePage, setActivePage] = useState("profile");

    return (
        <div className="bg-gray-50 text-indigo-500 p-6">
            <h2 className="text-xl font-bold">Profiles</h2>
            <div className="flex gap-8 mt-4">
                <button
                    className={`p-2 ${activePage === "profile" ? "border-b-2 border-indigo-500" : ""}`}
                    onClick={() => setActivePage("profile")}
                >
                    User Profile
                </button>
                <button
                    className={`p-2 ${activePage === "server" ? "border-b-2 border-indigo-500" : ""}`}
                    onClick={() => setActivePage("server")}
                >
                    Server Profile
                </button>
            </div>

            {activePage === "profile" ? <ProfilePage /> : <ServerPage />}
        </div>
    );
};

const ProfilePage = () => {
    const [userName, setUserName] = useState("")
    const [displayName, setDisplayName] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [avatar, setAvatar] = useState("/default-avatar.png");
    const [banner, setBanner] = useState("/default-banner.png");

    useEffect(() => {
        const initiateProfile = async () => {
            try {
                const res = await getUserProfile();
                if (res.success) {
                    setUserName(res.user.username || "")
                    setDisplayName(res.user.displayName || "");
                    setPronouns(res.user.pronoun || "");
                    setAboutMe(res.user.description || "");
                    setAvatar(res.user.avatarUrl || "/default-avatar.png");
                    setBanner(res.user.bannerUrl || "/default-banner.png");
                }
            } catch (error) {
                console.log(error);
            }
        };
        initiateProfile();
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSizeInBytes = 1 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only PNG, JPG, and JPEG are allowed.",
                variant: "destructive"
            });
            return;
        }

        if (file.size > maxSizeInBytes) {
            toast({
                title: "File too large",
                description: "Image must be less than 1MB.",
                variant: "destructive"
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await updateUserImage(formData);
            if (res.success) {
                setAvatar(URL.createObjectURL(file));
            } else {
                toast({
                    title: "Error",
                    description: res.message,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSizeInBytes = 1 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only PNG, JPG, and JPEG are allowed.",
                variant: "destructive"
            });
            return;
        }

        if (file.size > maxSizeInBytes) {
            toast({
                title: "File too large",
                description: "Image must be less than 1MB.",
                variant: "destructive"
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await updateUserBanner(formData);
            if (res.success) {
                setBanner(URL.createObjectURL(file));
            } else {
                toast({
                    title: "Error",
                    description: res.message,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error uploading banner:", error);
        }
    };

    const handleSave = async () => {
        try {
            const res = await updateUserProfile(displayName, pronouns, aboutMe);

            if (res.success) {
                toast({
                    title: "Saved",
                    description: "Profile updated successfully",
                    variant: "success"
                });
            } else {
                toast({
                    title: "Error",
                    description: res.message || "Failed to update profile",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: "Unexpected error",
                description: "Something went wrong while saving the profile.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="mt-6 flex gap-8">
            <div className="w-1/2">
                <label className="block mb-2 font-medium">Display Name</label>
                <input
                    className="w-full p-2 border rounded"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                />

                <label className="block mt-4 mb-2 font-medium">Pronouns</label>
                <input
                    className="w-full p-2 border rounded"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="e.g. he/him, she/her, they/them"
                />

                <label className="block mt-4 mb-2 font-medium">
                    About Me 🌟 (max 190 characters)
                </label>
                <textarea
                    className="w-full p-2 border rounded resize-none"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    maxLength={190}
                    placeholder="Tell us about yourself in a few words..."
                />
                <div className="text-xs text-gray-500 mt-1">
                    {aboutMe?.length || 0}/190 characters
                </div>

                <button
                    className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    onClick={handleSave}
                >
                    Save Profile
                </button>
            </div>

            <div className="w-1/2">
                <div className="text-sm font-medium mb-2">Preview</div>
                <div className="border p-4 rounded">
                    <div className="relative w-full h-32 mb-4">
                        <img src={banner} className="w-full h-full object-cover rounded" />
                        <label
                            htmlFor="banner-upload"
                            className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded cursor-pointer"
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

                    <div className="relative w-24 h-24 mb-4">
                        <img src={avatar} className="w-full h-full rounded-full object-cover" />
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
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

                    <div className="text-lg font-bold">{displayName}</div>
                    <div className="text-sm">aka {userName} • {pronouns}</div>

                    {aboutMe && (
                        <div className="mt-2 text-sm text-gray-700">
                            {/* <span className="font-medium">About Me:</span>  */}
                            {aboutMe}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ServerPage = () => {
    const [joinedServers, setJoinedServers] = useState([]);
    const [selectedServerId, setSelectedServerId] = useState("");
    const [serverNickname, setServerNickname] = useState("");
    const [serverPronouns, setServerPronouns] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [avatar, setAvatar] = useState("/default-avatar.png");
    const [banner, setBanner] = useState("/default-banner.png");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const res = await getUserServerProfileList();
                if (res.success && res.serverList?.length > 0) {
                    setJoinedServers(res.serverList);
                    setSelectedServerId(res.serverProfile.id);

                    const profile = res.serverProfile;
                    setServerNickname(profile.name || "");
                    setServerPronouns(profile.pronoun || "");
                    setAboutMe(profile.description || "");
                    setAvatar(profile.imageUrl || "/default-avatar.png");
                    setBanner(profile.bannerUrl || "/default-banner.png");
                }
            } catch (error) {
                console.error("Failed to load servers", error);
            }
        };

        loadInitialData();
    }, []);

    const fetchProfile = async (serverId) => {
        try {
            const res = await getUserServerProfile(serverId);
            if (res.success) {
                const profile = res.serverProfile;
                setServerNickname(profile.name || "");
                setServerPronouns(profile.pronoun || "");
                setAboutMe(profile.description || "");
                setAvatar(profile.imageUrl || "/default-avatar.png");
                setBanner(profile.bannerUrl || "/default-banner.png");
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleServerChange = (e) => {
        const serverId = e.target.value;
        setSelectedServerId(serverId);
        fetchProfile(serverId);
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 1 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only PNG, JPG, JPEG allowed.",
                variant: "destructive",
            });
            return;
        }

        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Must be under 1MB.",
                variant: "destructive",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            const res = await updateUserServerProfileImage(selectedServerId, formData);
            if (res.success) {
                const imageUrl = URL.createObjectURL(file);
                setAvatar(imageUrl);
            } else {
                toast({
                    title: "Upload error",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    const handleBannerUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 1 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only PNG, JPG, JPEG allowed.",
                variant: "destructive",
            });
            return;
        }

        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Must be under 1MB.",
                variant: "destructive",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            const res = await updateUserServerBannerImage(selectedServerId, formData);
            if (res.success) {
                const imageUrl = URL.createObjectURL(file);
                setBanner(imageUrl);
            } else {
                toast({
                    title: "Upload error",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    const handleSave = async () => {
        try {
            const res = await updateUserServerProfileDetails(
                selectedServerId,
                serverNickname,
                serverPronouns,
                aboutMe,
            );

            if (res.success) {
                toast({
                    title: "Saved!",
                    description: "Server profile updated.",
                    variant:"success"
                });
            } else {
                toast({
                    title: "Error",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Save error:", error);
            toast({
                title: "Unexpected error",
                description: "Couldn't save your server profile.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="mt-6 flex gap-8">
            <div className="w-1/2">
                <label className="block text-sm font-medium mb-2 uppercase">Choose a Server</label>
                <select
                    className="w-full p-2 border rounded"
                    value={selectedServerId}
                    onChange={handleServerChange}
                >
                    {joinedServers.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                            {profile.server.name}
                        </option>
                    ))}
                </select>

                <label className="block mt-4 mb-2 uppercase font-medium text-sm">
                    Server Nickname
                </label>
                <input
                    className="w-full p-2 border rounded"
                    value={serverNickname}
                    onChange={(e) => setServerNickname(e.target.value)}
                    placeholder="Your nickname in this server"
                />

                <label className="block mt-4 mb-2 uppercase font-medium text-sm">
                    Pronouns
                </label>
                <input
                    className="w-full p-2 border rounded"
                    value={serverPronouns}
                    onChange={(e) => setServerPronouns(e.target.value)}
                    placeholder="e.g. they/them"
                />

                <label className="block mt-4 mb-2 font-medium">
                    About Me (optional)
                </label>
                <textarea
                    className="w-full p-2 border rounded resize-none"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    maxLength={190}
                    placeholder="How do you want others to know you in this server?"
                />
                <div className="text-xs text-gray-500 mt-1">{aboutMe.length}/190 characters</div>

                <button
                    className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    onClick={handleSave}
                >
                    Save Server Profile
                </button>
            </div>

            <div className="w-1/2">
                <div className="text-sm font-medium mb-2 uppercase">
                    Preview for {joinedServers.find((s) => s.id === selectedServerId)?.server?.name || "Server"}
                </div>
                <div className="border p-4 rounded">
                    <div className="relative w-full h-32 mb-4">
                        <img src={banner} className="w-full h-full object-cover rounded" />
                        <label
                            htmlFor="server-banner-upload"
                            className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded cursor-pointer"
                        >
                            Change Banner
                        </label>
                        <input
                            id="server-banner-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleBannerUpload(e)}
                        />
                    </div>

                    <div className="relative w-24 h-24 mb-4">
                        <img src={avatar} className="w-full h-full rounded-full object-cover" />
                        <label
                            htmlFor="server-avatar-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                        >
                            Edit
                        </label>
                        <input
                            id="server-avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "avatar")}
                        />
                    </div>

                    <div className="text-lg font-bold">{serverNickname}</div>
                    <div className="text-sm text-gray-600">
                        {serverNickname} • {serverPronouns}
                    </div>
                    {aboutMe && (
                        <div className="mt-2 text-sm text-gray-700">
                            <span className="font-medium">About Me:</span> {aboutMe}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// const ProfileSettingPage = () => {
//     const [activeProfile, setActiveProfile] = useState('user');
//     const [displayName, setDisplayName] = useState('ZAKOP');
//     const [pronouns, setPronouns] = useState('AKA OLLA(•U•)');
//     const [avatar, setAvatar] = useState('/default-avatar.png'); // Default avatar
//     const [aboutMe, setAboutMe] = useState('hello');
//     const [serverNickname, setServerNickname] = useState('ZAKOP');
//     const [serverPronouns, setServerPronouns] = useState('');
//     const [selectedServer, setSelectedServer] = useState("ZAKOP'S server");
//     const [banner, setBanner] = useState('/default-banner.png'); // Default banner
//     const [serverBanner, setServerBanner] = useState('/default-banner.png'); // Default server banner

//     // Load saved data from localStorage after component mounts
//     useEffect(() => {
//         const savedAvatar = localStorage.getItem('avatar');
//         const savedBanner = localStorage.getItem('banner');
//         const savedServerBanner = localStorage.getItem('serverBanner');
//         const savedDisplayName = localStorage.getItem('displayName');
//         const savedPronouns = localStorage.getItem('pronouns');
//         const savedAboutMe = localStorage.getItem('aboutMe');


//         if (savedAvatar) setAvatar(savedAvatar);
//         if (savedBanner) setBanner(savedBanner);
//         if (savedServerBanner) setServerBanner(savedServerBanner);
//         if (savedDisplayName) setDisplayName(savedDisplayName);
//         if (savedPronouns) setPronouns(savedPronouns);
//         if (savedAboutMe) setAboutMe(savedAboutMe);
//     }, []);

//     const handleAvatarChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setAvatar(imageUrl);
//             localStorage.setItem('avatar', imageUrl); // Save to localStorage
//         }
//     };

//     const handleBannerChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setBanner(imageUrl);
//             localStorage.setItem('banner', imageUrl); // Save to localStorage
//         }
//     };

//     const handleServerBannerChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setServerBanner(imageUrl);
//             localStorage.setItem('serverBanner', imageUrl); // Save to localStorage
//         }
//     };

//     const handleAboutMeChange = (event) => {
//         const text = event.target.value;
//         if (text.length <= 190) {
//             setAboutMe(text);
//             localStorage.setItem('aboutMe', text); // Save to localStorage
//         }
//     };

//     const handleDisplayNameChange = (event) => {
//         const text = event.target.value;
//         setDisplayName(text);
//         localStorage.setItem('displayName', text); // Save to localStorage
//     };

//     const handlePronounsChange = (event) => {
//         const text = event.target.value;
//         setPronouns(text);
//         localStorage.setItem('pronouns', text); // Save to localStorage
//     };

//     return (
//         <div className="bg-gray-50 text-indigo-500 p-6">
//             <h2 className="text-xl font-bold">Profiles</h2>
//             <div className="flex gap-8 mt-4">
//                 <button 
//                     className={`p-2 ${activeProfile === 'user' ? 'border-b-2 border-indigo-500' : ''}`} 
//                     onClick={() => setActiveProfile('user')}
//                 >
//                     User Profile
//                 </button>
//                 <button 
//                     className={`p-2 ${activeProfile === 'server' ? 'border-b-2 border-indigo-500' : ''}`} 
//                     onClick={() => setActiveProfile('server')}
//                 >
//                     Server Profile
//                 </button>
//             </div>

//             {activeProfile === 'user' && (
//                 <div className="mt-6">
//                     <div className="flex gap-8">
//                         <div className="w-1/2">
//                             <label className="block text-sm font-medium mb-2">Display Name</label>
//                             <input 
//                                 type="text" 
//                                 className="w-full p-2 border rounded" 
//                                 placeholder="Enter display name" 
//                                 value={displayName}
//                                 onChange={handleDisplayNameChange} 

//                             />
//                             <label className="block text-sm font-medium mt-4 mb-2">Pronouns</label>
//                             <input 
//                                 type="text" 
//                                 className="w-full p-2 border rounded" 
//                                 placeholder="Enter pronouns" 
//                                 value={pronouns}
//                                 onChange={handlePronounsChange} 
//                             />
//                             <label className="block text-sm font-medium mt-4 mb-2">
//                                 About Me 🌟 (max 190 characters)
//                             </label>
//                             <textarea 
//                                 className="w-full p-2 border rounded resize-none" 
//                                 placeholder="Tell us about yourself! Add emojis like 😊👍"
//                                 value={aboutMe}
//                                 onChange={handleAboutMeChange}
//                                 rows={4}
//                                 maxLength={190}
//                             />
//                             <div className="text-xs text-gray-500 mt-1">
//                                 {aboutMe.length}/190 characters
//                             </div>
//                         </div>
//                         <div className="w-1/2">
//                             <div className="text-sm font-medium mb-2">Preview</div>
//                             <div className="border p-4 rounded">
//                                 <div className="relative w-full h-32 mb-4">
//                                     <img 
//                                         src={banner} 
//                                         alt="Banner" 
//                                         className="w-full h-full object-cover rounded"
//                                     />
//                                     <label 
//                                         htmlFor="banner-upload" 
//                                         className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded cursor-pointer"
//                                     >
//                                         Change Banner
//                                     </label>
//                                     <input 
//                                         id="banner-upload" 
//                                         type="file" 
//                                         className="hidden" 
//                                         accept="image/*" 
//                                         onChange={handleBannerChange}
//                                     />
//                                 </div>
//                                 <div className="flex">
//                                     <div className="w-3/5 p-4">
//                                         <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
//                                             <img 
//                                                 src={avatar} 
//                                                 alt="Avatar" 
//                                                 className="w-full h-full rounded-full object-cover"
//                                             />
//                                             <div className="absolute flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
//                                                 <label 
//                                                     htmlFor="avatar-upload" 
//                                                     className="text-white text-sm cursor-pointer flex items-center justify-center w-full h-full"
//                                                 >
//                                                     Edit
//                                                 </label>
//                                                 <input 
//                                                     id="avatar-upload" 
//                                                     type="file" 
//                                                     className="hidden" 
//                                                     accept="image/*" 
//                                                     onChange={handleAvatarChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="text-lg font-bold">{displayName}</div>
//                                         <div className="text-sm">aka_{displayName} • {pronouns}</div>
//                                         {aboutMe && (
//                                             <div className="mt-2 text-sm text-gray-700">
//                                                 <span className="font-medium">About Me:</span> {aboutMe}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {activeProfile === 'server' && (
//                 <div className="mt-6">
//                     <div className="flex gap-8">
//                         <div className="w-1/2">
//                             <label className="block text-sm font-medium mb-2 text-gray-600 uppercase">
//                                 Choose a Server
//                             </label>
//                             <select 
//                                 className="w-full p-2 border rounded"
//                                 value={selectedServer}
//                                 onChange={(e) => setSelectedServer(e.target.value)}
//                             >
//                                 <option value="ZAKIR HUSSAIN'S server">ZAKOP's server</option>
//                                 <option value="Other Server">Other Server</option>
//                             </select>

//                             <label className="block text-sm font-medium mt-4 mb-2 uppercase">
//                                 Server Nickname
//                             </label>
//                             <input 
//                                 type="text" 
//                                 className="w-full p-2 border rounded" 
//                                 placeholder="Enter server nickname" 
//                                 value={serverNickname}
//                                 onChange={(e) => setServerNickname(e.target.value)}
//                             />

//                             <label className="block text-sm font-medium mt-4 mb-2 uppercase">
//                                 Pronouns
//                             </label>
//                             <input 
//                                 type="text" 
//                                 className="w-full p-2 border rounded" 
//                                 placeholder="Add your pronouns" 
//                                 value={serverPronouns}
//                                 onChange={(e) => setServerPronouns(e.target.value)}
//                             />
//                         </div>
//                         <div className="w-1/2">
//                             <div className="text-sm font-medium mb-2 uppercase">
//                                 Preview for {selectedServer}
//                             </div>
//                             <div className="border p-4 rounded">
//                                 <div className="relative w-full h-32 mb-4">
//                                     <img 
//                                         src={banner} 
//                                         alt="Banner" 
//                                         className="w-full h-full object-cover rounded"
//                                     />
//                                     <label 
//                                         htmlFor="server-banner-upload" 
//                                         className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded cursor-pointer"
//                                     >
//                                         Change Banner
//                                     </label>
//                                     <input 
//                                         id="server-banner-upload" 
//                                         type="file" 
//                                         className="hidden" 
//                                         accept="image/*" 
//                                         onChange={handleServerBannerChange}
//                                     />
//                                 </div>
//                                 <div className="flex">
//                                     <div className="w-3/5 p-4">
//                                         <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
//                                             <img 
//                                                 src={avatar} 
//                                                 alt="Avatar" 
//                                                 className="w-full h-full rounded-full object-cover"
//                                             />
//                                             <div className="absolute flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
//                                                 <label 
//                                                     htmlFor="avatar-upload" 
//                                                     className="text-white text-sm cursor-pointer flex items-center justify-center w-full h-full"
//                                                 >
//                                                     Edit
//                                                 </label>
//                                                 <input 
//                                                     id="avatar-upload" 
//                                                     type="file" 
//                                                     className="hidden" 
//                                                     accept="image/*" 
//                                                     onChange={handleAvatarChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="text-lg font-bold">{serverNickname}</div>
//                                         <div className="text-sm text-gray-600">
//                                             {serverNickname} • {pronouns}
//                                         </div>
//                                         {aboutMe && (
//                                             <div className="mt-2 text-sm text-gray-700">
//                                                 <span className="font-medium">About Me:</span> {aboutMe}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

export default ProfileSettingPage;