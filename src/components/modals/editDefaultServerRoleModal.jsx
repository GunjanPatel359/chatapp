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
import { getDefaultServerRoleInfo, getServerRoleInfo, updateDefaultServerRole } from "@/actions/role";
import { useParams } from "next/navigation";

// The Permissions Section Logic Inside Modal
const permissionsList = [
  {
    section: "General",
    items: [
      { key: "viewChannel", label: "View Channel", description: "Allows everyone to view channels." },
      { key: "sendMessage", label: "Send Message", description: "Allows everyone to send messages in text channels." },
      { key: "attachFiles", label: "Attach Files", description: "Allows everyone to upload files." },
      { key: "seemessageHistory", label: "see previous message", description: "Allows everyone to see previous messages." },
    ],
  },
  {
    section: "Member Permissions",
    items: [
      { key: "createInvite", label: "Create Invite", description: "Allows everyone to create invites." },
    ],
  },
  {
    section: "Voice Channel Permissions",
    items: [
      { key: "connect", label: "Connect", description: "Allows everyone to connect to voice channels." },
      { key: "speak", label: "Speak", description: "Allows everyone to speak in voice channels." },
      { key: "video", label: "Video", description: "Allows everyone to use video in voice channels." },
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

export const EditDefaultServerRoleModal = ({ children, roleId}) => {
  const params=useParams()
  const [activeSection, setActiveSection] = useState("permissions");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRoleData = async () => {
      setLoading(true);
      try {
        const res = await getDefaultServerRoleInfo(params.serverId,roleId);
        console.log(res)
        if (res.success) {
          setPermissions(res.role || {});
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
      try {
        const res=await updateDefaultServerRole(roleId,permissions)
        console.log(res)
        if(res.success){
            toast({
                title: "Role updated",
                description: `Role @everyone has been updated.`,
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
          <DialogTitle>Edit Role: @everyone</DialogTitle>
        </DialogHeader>

        {/* Section Tabs */}
        <div className="flex space-x-4 border-b mb-4">
          {["permissions"].map((section) => (
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
