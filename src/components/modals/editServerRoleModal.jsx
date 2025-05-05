import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { IoSearchOutline } from "react-icons/io5";
import { editServerRole, getServerRoleInfo } from "@/actions/role";
import { useParams } from "next/navigation";

// The Permissions Section Logic Inside Modal
const permissionsList = [
  {
    section: "General",
    items: [
      { key: "viewChannel", label: "View Channel", description: "Allows members to view channels." },
      { key: "sendMessage", label: "Send Message", description: "Allows members to send messages in text channels." },
      { key: "attachFiles", label: "Attach Files", description: "Allows members to upload files." },
    ],
  },
  {
    section: "Member Permissions",
    items: [
      { key: "createInvite", label: "Create Invite", description: "Allows members to create invites." },
      { key: "kickMembers", label: "Kick Members", description: "Allows kicking members from the server." },
      { key: "banMembers", label: "Ban Members", description: "Allows banning members from the server." },
      { key: "timeOutMembers", label: "Timeout Members", description: "Allows temporarily timing out members." },
    ],
  },
  {
    section: "Voice Channel Permissions",
    items: [
      { key: "connect", label: "Connect", description: "Allows members to connect to voice channels." },
      { key: "speak", label: "Speak", description: "Allows members to speak in voice channels." },
      { key: "muteMembers", label: "Mute Members", description: "Allows muting other members in voice channels." },
      { key: "deafenMembers", label: "Deafen Members", description: "Allows deafening other members in voice channels." },
      { key: "video", label: "Video", description: "Allows members to use video in voice channels." },
    ],
  },
  {
    section: "Admin Permissions",
    items: [
      { key: "adminPermission", label: "Administrator", description: "Grants all permissions, including server settings." },
      { key: "manageChannels", label: "Manage Channels", description: "Allows members to manage channels." },
      { key: "manageRoles", label: "Manage Roles", description: "Allows managing roles." },
      { key: "manageMessage", label: "Manage Messages", description: "Allows managing messages in channels." },
    ],
  },
];

const PermissionToggle = ({ label, description, value, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {/* Switch */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only"
        />
        <div className="w-10 h-6 bg-gray-200 rounded-full dark:bg-gray-600">
          <div
            className={`${
              value ? "translate-x-4 bg-indigo-500" : "translate-x-0 bg-gray-400"
            } absolute left-0 top-0 bottom-0 transition-transform ease-in-out duration-200 w-6 h-6 rounded-full`}></div>
        </div>
      </label>
    </div>
  );
};

export const EditServerRoleModal = ({ children, roleId }) => {
  const params=useParams()
  const [activeSection, setActiveSection] = useState("display");
  const [displayName, setDisplayName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [members,setMembers]=useState();
  const [loading, setLoading] = useState(false);
  console.log(members)
  useEffect(() => {
    const fetchRoleData = async () => {
      setLoading(true);
      try {
        const res = await getServerRoleInfo(params.serverId,roleId);
        console.log(res)
        if (res.success) {
          setDisplayName(res.role.name);
          setPermissions(res.role || {});
          setMembers(res.role.UserRoleAssignment);
        } else {
          toast({
            title: "Role not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error fetching role data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      fetchRoleData();
    }
  }, [roleId]);

  const handleSave = async() => {
    if (!displayName.trim()) {
      return toast({
        title: "Enter a valid display name",
        variant: "destructive",
      });
    }

    try {
      const res=await editServerRole(params.serverId,roleId,{name:displayName,permissions})
      if(res.success){
        toast({
          title: "Role updated",
          description: `Role "${displayName}" has been updated.`,
          variant: "success",
        });
        return
      }
      toast({
        title:"somthing went wrong",
        description:`error: ${res.message}`,
        variant:"destructive"
      })
    } catch (error) {
      return toast({
        title: "error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handlePermissionChange = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role: {displayName || "Loading..."}</DialogTitle>
        </DialogHeader>

        {/* Section Tabs */}
        <div className="flex space-x-4 border-b mb-4">
          {["display", "permissions", "manage"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`pb-2 text-sm font-medium ${
                activeSection === section
                  ? "text-indigo-500 border-b-2 border-indigo-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Display Section */}
        {activeSection === "display" && (
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
            />
          </div>
        )}

        {/* Permission section */}
        {activeSection === "permissions" && (
          <div className="space-y-4 max-h-60 overflow-y-auto p-4">
            {permissionsList.map(({ section, items }) => (
              <div key={section}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{section}</h3>
                {items.map(({ key, label, description }) => (
                  <PermissionToggle
                    key={key}
                    label={label}
                    description={description}
                    value={permissions[key] || false}
                    onChange={() => handlePermissionChange(key)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Manage Access Section */}
        {activeSection === "manage" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Manage Access</label>
            <div className="mt-2 flex items-center bg-gray-50 border border-indigo-500 rounded-md p-2">
              <input
                type="text"
                placeholder="Search Members"
                className="bg-transparent text-sm w-full focus:outline-none placeholder:text-indigo-400 text-indigo-500"
              />
              <IoSearchOutline className="text-indigo-500" size={20} />
            </div>

            {/* <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 w-full">
              Add Members
            </button> */}

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Member Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">AniGame</p>
                    <p className="text-xs text-gray-500">AniGame#0359</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-600 text-sm">Remove</button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
