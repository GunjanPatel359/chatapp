"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUserFriends } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.4
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const HomePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("Online"); // Track which tab is active
  const [friends, setFriends] = useState([
    { name: "aditya", status: "Online" },
    { name: "CodeMaster", status: "Offline" },
    { name: "PixelWarrior", status: "Online" },
  ]);
  const [pendingRequests, setPendingRequests] = useState([
    { name: "Newbie123" },
    { name: "CoolCat" },
    { name: "Noob" },
    { name: "Cool" },
    { name: "Manthan" },
    { name: "Zak" },
  ]);

  // Animation state
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // Handle message click
//   const handleMessageClick = (friendName) => {
//     // Navigate to chat page (You can change the route as you like)
//     router.push(`/chat/${friendName}`);
//   };

  // Accept a friend request and move to friends list
  const acceptFriendRequest = (friendName) => {
    // Remove from pending requests
    const newPendingRequests = pendingRequests.filter(request => request.name !== friendName);
    setPendingRequests(newPendingRequests);

    // Add to friends
    const newFriend = { name: friendName, status: "Online" }; // Default status can be Online, but you can change it
    setFriends([...friends, newFriend]);
  };

  // Filter friends based on current tab
  const filteredFriends = () => {
    let list = [];
    
    if (tab === "Online") {
      list = friends.filter(friend => friend.status === "Online");
    } else if (tab === "All") {
      list = friends;
    } else if (tab === "Pending") {
      list = pendingRequests;
    }

    if (searchTerm.trim() !== "") {
      return list.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return list;
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-offwhite">
      {/* If animation is not completed, show animation */}
      {!animationCompleted ? (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
          {/* Glowing Background */}
          <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-white z-0"></div>

          {/* Animated Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onAnimationComplete={handleAnimationComplete}
            className="relative z-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-10 max-w-md text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.div
              variants={childVariants}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6 flex justify-center"
            >
              <img src="/chatverse.svg" alt="Chatverse Logo" className="w-28 h-28" />
            </motion.div>

            <motion.h1
              variants={childVariants}
              className="text-3xl font-bold text-indigo-500"
            >
              Welcome to Chatverse
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="mt-4 text-gray-600"
            >
              Your space to connect, create, and chat — seamlessly and beautifully.
            </motion.p>
          </motion.div>
        </div>
      ) : (
        // After animation completes, show the friends content
        <div className="flex flex-col min-h-screen w-full bg-offwhite">
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-white shadow-md border-b">
            <div className="flex items-center gap-4">
              <FaUserFriends size={25} className="text-indigo-500" />
              <h1 className="text-2xl font-bold text-indigo-500">Friends</h1>
              <Button
                variant={tab === "Online" ? "outline" : "ghost"}
                className="text-xl text-indigo-500 font-normal"
                onClick={() => setTab("Online")}
              >
                Online
              </Button>
              <Button
                variant={tab === "All" ? "outline" : "ghost"}
                className="text-xl text-indigo-500 font-normal"
                onClick={() => setTab("All")}
              >
                All
              </Button>
              <Button
                variant={tab === "Pending" ? "outline" : "ghost"}
                className="text-xl text-indigo-500 font-normal"
                onClick={() => setTab("Pending")}
              >
                Pending
              </Button>
              <Button
                variant="ghost"
                className="text-xl text-indigo-500 font-normal"
                onClick={() => setTab("Suggestions")}
              >
                Suggestions
              </Button>
              <Button variant="outline" className="border-indigo-300 text-indigo-500">
                Add Friend
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex p-4 bg-white border-b shadow-sm">
            <Input
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-indigo-300 placeholder:text-indigo-300 text-indigo-500"
            />
          </div>

          {/* Friends / Pending Requests List */}
          <div className="flex-1 flex flex-col p-4 overflow-y-auto bg-offwhite gap-3">
            {filteredFriends().length > 0 ? (
              filteredFriends().map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <IoPersonCircleOutline size={45} className="text-indigo-400" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-indigo-600">{friend.name}</span>
                      {tab !== "Pending" && (
                        <span className={`text-sm ${friend.status === "Online" ? "text-green-500" : "text-gray-400"}`}>
                          {friend.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {tab !== "Pending" && (
                    <Button
                      variant="ghost"
                      className="text-indigo-400 hover:text-indigo-600"
                      onClick={() => handleMessageClick(friend.name)}
                    >
                      Message
                    </Button>
                  )}

                  {tab === "Pending" && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="border-indigo-300 text-indigo-500"
                        onClick={() => acceptFriendRequest(friend.name)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-500 ml-2"
                        onClick={() => setPendingRequests(pendingRequests.filter(request => request.name !== friend.name))}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-1 justify-center items-center text-indigo-400">
                No {tab === "Pending" ? "pending requests" : "friends"} found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
