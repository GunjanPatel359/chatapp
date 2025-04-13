"use client";
import { CopyIcon } from "lucide-react";
import { serverInviteInfo } from "@/actions/invite";
import { CreateInviteModal } from "@/components/modals/createInviteModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { serverLink } from "@/server.js";

dayjs.extend(relativeTime);
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

const InviteAccessToggle = () => {
  const [inviteDisabled, setInviteDisabled] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-500 p-4 rounded-md shadow-sm mb-3">
      <div className="flex items-start gap-3">
        <div className="">
        <AlertTriangle className="w-6 h-6 mt-0.5 text-red-400" />
            </div>
        <div className="space-y-1">
          <p className="font-semibold">Disable server invites</p>
          <p className="text-sm text-red-400">
            Turn this off to prevent anyone from creating or using invite links to join the server.
          </p>
        </div>
      </div>
      <Switch
        checked={inviteDisabled}
        onCheckedChange={setInviteDisabled}
        className="bg-red-200 data-[state=checked]:bg-red-500"
      />
    </div>
  );
};




const InviteList = () => {
    const params = useParams();
    const [inviteList, setInviteList] = useState([]);

    useEffect(() => {
        const initatePage = async () => {
            try {
                const res = await serverInviteInfo(params?.serverId);
                if (res.success) {
                    setInviteList(res.invites);
                } else {
                    toast({
                        title: "Error",
                        description: res.message,
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive",
                });
            }
        };
        if (params?.serverId) {
            initatePage();
        }
    }, [params?.serverId]);

    const getTimeLeft = (expiresAt) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        if (expiry > now) {
            return dayjs(expiry).fromNow(true); // e.g., "in 3 days" → "3 days"
        } else {
            return "Expired";
        }
    };

    return (
        <div className="p-6 rounded-lg text-indigo-500 font-bold max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Invites</h2>
            <p className="text-sm text-indigo-400 uppercase mb-4">Active Invite Links</p>

            <div className="flex justify-between items-center mb-4">
                <Button
                    variant="outline"
                    className="bg-red-100 border border-red-300 text-red-700 hover:bg-red-200"
                >
                    Pause Invites
                </Button>
                <CreateInviteModal>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        Create Invite Link
                    </Button>
                </CreateInviteModal>
            </div>
            <InviteAccessToggle/>

            <div className="overflow-x-auto bg-gray-50 border rounded-lg">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-4">Inviter</th>
                            <th className="px-4 py-4 max-w-[120px]">Invite Code</th>
                            <th className="px-4 py-4 max-w-[80px]">Uses</th>
                            <th className="px-4 py-4">Expires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inviteList.length > 0 ? (
                            inviteList.map((invite) => (
                                <tr key={invite.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <img
                                            src={invite.serverProfile?.imageUrl || "/avatar.png"}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="font-bold h-4 text-sm">@{invite.serverProfile?.user?.username || "Unknown"}</div>
                                            <div className="font-medium h-4">{invite.serverProfile?.name || "Unknown"}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-blue-700">
                                        <div className="flex items-center gap-2 group relative">
                                            <span className="truncate group-hover:text-blue-900 transition">
                                                {invite.inviteString.split("-")[0]}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${serverLink}invite/${invite.inviteString}`);
                                                    toast({
                                                        title: "Copied to clipboard",
                                                        description: "Full invite link has been copied.",
                                                    });
                                                }}
                                                className="p-1 rounded hover:bg-gray-200 transition"
                                                aria-label="Copy invite link"
                                            >
                                                <CopyIcon size={16} className="text-gray-500 group-hover:text-blue-600" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{invite.currentCount}/{invite.limitMember}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{getTimeLeft(invite.expiresAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                                    No invites found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InviteList;
