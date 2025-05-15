"use client";
import { useEffect, useMemo, useState } from "react";
import ServerSettingSideBar from "./ServerSettingSidebar";
import { useParams, useRouter } from "next/navigation";
import { serverSettingFetch } from "@/actions/user";
import { serverSetting } from "@/hooks/zusthook";
import { FaArrowLeft } from "react-icons/fa";

const ServerSettingLayout = ({ children }) => {
  const { onsetServerSettingData } = serverSetting()
  const router = useRouter();
  const params = useParams();
  const serverId = useMemo(() => params.serverId, [params?.serverId]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await serverSettingFetch(serverId);
        console.log(res)
        if (res.success) {
          onsetServerSettingData(res.serverSetting, res.user, res.serverSetting.server)
          setLoading(false)
        }
        if (!res.success) {
          router.push("/home");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (serverId) {
      fetchData();
    }
  }, [serverId]);

  return (
    <div className="h-screen">
      {/* Back button positioned outside the main container */}
      <div className="lg:w-[1030px] mx-auto relative">
        <button
          onClick={() => router.push(`/server/${serverId}`)}
          className="absolute left-0 top-8  -translate-x-full bg-white text-indigo-400 hover:text-indigo-600 text-sm flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-400 hover:border-indigo-600 shadow-md hover:shadow-lg transition-all"
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
                <ServerSettingSideBar />
              </div>
              <div className="flex-1 bg-gray-200 rounded-e-lg">{children}</div>
            </>
          ) : (
            <div>
              Loading
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerSettingLayout;