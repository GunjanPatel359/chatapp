"use client";
import { useEffect, useMemo, useState } from "react";
import ServerSettingSideBar from "./ServerSettingSidebar";
import { useParams, useRouter } from "next/navigation";
import { serverSettingFetch } from "@/actions/user";
import { serverSetting } from "@/hooks/zusthook";

const ServerSettingLayout = ({ children }) => {
  const { onsetServerSettingData } = serverSetting()
  const router = useRouter();
  const params = useParams();
  const serverId = useMemo(() => params.serverId, [params?.serverId]);
  // const [user, setUser] = useState();
  // const [server, setServer] = useState();
  // const [userServerProfile, setUserServerProfile] = useState();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await serverSettingFetch(serverId);
        console.log(res)
        if (res.success) {
          // setUser(res.user);
          onsetServerSettingData(res.serverSetting, res.user, res.serverSetting.server)
          // setServer(res.serverSetting.server);
          // setUserServerProfile(res.serverSetting);
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
  console.log(serverId)
  return (
    <div className="bg-white lg:w-[980px] mx-auto h-screen py-4">
      <div className="flex h-full shadow rounded-lg">
        {!loading ? (
          <>
            <div className="w-[250px] bg-gray-100 rounded-s-lg">
              <ServerSettingSideBar
              // userServerProfile={userServerProfile}
              // user={user}
              />
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
  );
};

export default ServerSettingLayout;
