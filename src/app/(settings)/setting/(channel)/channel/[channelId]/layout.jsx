"use client";
import { useEffect, useState } from "react";
import ChannelSettingSidebar from "./ChannelSettingSidebar";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const ChannelSettingLayout = ({ children }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen">
      {/* Back button container */}
      <div className="lg:w-[1040px] mx-auto relative">
        <button
          onClick={() => router.push(`/home`)}
          className="absolute left-0 top-8 -translate-x-full bg-white text-indigo-400 hover:text-indigo-600 text-sm flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-400 hover:border-indigo-600 shadow-md hover:shadow-lg transition-all"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      {/* Main content container */}
      <div className="bg-white lg:w-[980px] mx-auto h-full py-4">
        <div className="flex h-full shadow rounded-lg">
          {!loading ? (
            <>
              <div className="w-[250px] bg-gray-100 rounded-s-lg">
                <ChannelSettingSidebar />
              </div>
              <div className="flex-1 bg-gray-200 rounded-e-lg overflow-scroll scrollbar-none">
                {children}
              </div>
            </>
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSettingLayout;