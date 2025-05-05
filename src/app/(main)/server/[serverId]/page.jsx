"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getServerInfo } from "@/actions/server";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ServerHomePage = () => {
  const { serverId } = useParams();
  const [server, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setLoading(true);
        const response = await getServerInfo(serverId);
        if (response.success) {
          setServerData(response.server);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch server information");
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-[500px] h-[80vw] max-h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-white z-0" />

      {/* Animated Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-10 max-w-sm sm:max-w-md text-center hover:shadow-2xl transition-shadow duration-300"
      >
        <motion.div
          variants={childVariants}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 flex justify-center"
        >
          <img
            src={server?.imageUrl}
            alt="Server Logo"
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
          />
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-3xl font-bold text-indigo-500"
        >
          Welcome to {server?.name || "Server Home"} Server
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="mt-4 text-gray-600"
        >
          {server?.description || "This is the server’s landing page — elegant, smooth, and ready for action."}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ServerHomePage;