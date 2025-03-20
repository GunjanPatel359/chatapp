"use client";
import { useEffect, useState } from "react";
import ChannelSettingSidebar from "./ChannelSettingSidebar"
import { useParams } from "next/navigation";

const ChannelSettingLayout = ({ children }) => {
const params=useParams()
const [loading, setLoading] = useState(false);

  return (
        <div className="bg-white lg:w-[980px] mx-auto h-screen py-4">
          <div className="flex h-full shadow rounded-lg">
            {!loading?(
                <>
                <div className="w-[250px] bg-gray-100 rounded-s-lg">
                  <ChannelSettingSidebar/>
                </div>
                <div className="flex-1 bg-gray-200 rounded-e-lg overflow-scroll scrollbar-none">{children}</div>
                </>
            ):(
        <div>
            Loading
        </div>
            )}
          </div>
        </div>
  );
};

export default ChannelSettingLayout;
