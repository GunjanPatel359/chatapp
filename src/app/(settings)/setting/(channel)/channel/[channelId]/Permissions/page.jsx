"use client";
import React, { useEffect, useState } from "react";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";

import { addChannelRole, getChannelRolesData, removeChannelRole, updateChannelRole, updateDefaultChannelRole } from "@/actions/role"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useParams } from "next/navigation";
import { X, Minus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { FaLock } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const PermissionRoleComponent = () => {
  const params = useParams();
  const [channelRoles, setChannelRoles] = useState([]);
  const [defaultChannelRole, setDefaultChannelRole] = useState(null);
  const [serverRoles, setServerRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const fetchChannelRoleData = async () => {
      try {
        const res = await getChannelRolesData(params.channelId);
        console.log(res)
        if (res.success) {
          setLimit(res.limit)
          const temp1 = res.channelRoles.channelRoles.sort((a, b) => a.serverRole.order - b.serverRole.order)
          setChannelRoles(temp1);
          setDefaultChannelRole(res.channelRoles.defaultChannelRole);

          const defaultRole = res.channelRoles.defaultChannelRole;
          setSelectedRoleId(defaultRole.id);
          setPermissions(defaultRole || {});

          let temp = res.serverRoles
          console.log(temp)
          // .sort((a, b) => a.order - b.order)
          temp = temp.filter((a) => !res.channelRoles.channelRoles.some((role) => role.serverRoleId == a.id))
          console.log(temp)
          setServerRoles(temp);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchChannelRoleData();
  }, [params.channelId]);

  const handleRoleSelect = (role) => {
    setSelectedRoleId(role.id);
    setPermissions(role ?? {});
  };

  const handleRoleClick = async (serverRoleId) => {
    if (!serverRoleId) {
      return
    }
    try {
      const res = await addChannelRole(params.channelId, serverRoleId)
      if (res.success) {
        channelRoles.push(res.channel)
        serverRoles.pop(serverRoleId)
        setSelectedRoleId(res.channel.id)
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: res.message,
        })
      }
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  const updateRole = (idToUpdate, updatedRole) => {
    const updatedRoles = channelRoles.map(role =>
      role.id === idToUpdate ? updatedRole : role
    );
    setChannelRoles(updatedRoles);
  };

  const updateCategoryRolePermission = async () => {
    try {
      let res;
      if (selectedRoleId == defaultChannelRole.id) {
        res = await updateDefaultChannelRole(selectedRoleId, permissions)
        if (res.success) {
          setDefaultChannelRole(res.updatedRole)
          toast({
            title: "Success",
            variant: "success",
            description: "@everyone role updated successfully for channel",
          })
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: res.message,
          })
        }
      } else {
        res = await updateChannelRole(params.channelId, selectedRoleId, permissions)
        if (res.success) {
          updateRole(selectedRoleId, res.updatedRole)
          toast({
            title: "Success",
            variant: "success",
            description: "Role updated successfully",
          })
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: res.message,
          })
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }

  const handleRemoveCateRole = async (id) => {
    try {
      const res = await removeChannelRole(params.channelId, id)
      if (res.success) {
        const temp = channelRoles.find((role) => role.id == id).serverRole;
        setServerRoles((prevServerRoles) => [...prevServerRoles, temp]);
        setChannelRoles(channelRoles.filter((role) => role.id != id));

        toast({
          title: "Success",
          variant: "success",
          description: "Role removed successfully",
        })
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: res.message,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-6 w-full">
      <h2 className="text-indigo-600 text-lg font-semibold mb-2">Channel Permissions</h2>
      <p className="text-indigo-500 text-sm font-medium mb-2">Customize who can do what in this channel</p>
      <div className="h-[2px] w-full bg-indigo-300"></div>

      <div className="flex mt-4">
        {/* Roles Section */}
        <div className="w-[35%]">
          <div className="flex justify-between px-2 py-2 pb-1 font-bold text-indigo-600 align-middle">
            <div className="text-center my-auto">ROLES</div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="my-auto">
                  <FaPlus size={25} className="cursor-pointer p-[2.4px]" />
                  {/* <HiMiniPlusCircle size={25} className="cursor-pointer" /> */}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Add Channel Role</h4>
                    <p className="text-sm text-muted-foreground">
                      Search and select role.
                    </p>
                  </div>
                  {/* Search Input */}
                  <Input
                    placeholder="Search roles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10"
                  />
                  {/* Roles List */}
                  <ScrollArea className="max-h-40 rounded-md">
                    <div className="space-y-1">
                      {serverRoles.length > 0 ? (
                        serverRoles.map((role) => (
                          <button
                            disabled={role.order < limit}
                            key={role.id}
                            className={`p-2 rounded-md cursor-pointer w-full text-left flex ${role.order < limit ? "opacity-75" : "hover:bg-gray-100"}`}
                            onClick={() => handleRoleClick(role.id)}
                          >
                            <span className="flex-1">
                              {role.name}
                            </span>
                            <span>
                              {role.order < limit ? <FaLock className="inline mx-auto" size={15} /> : ""}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No roles found</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            {[...channelRoles].filter(Boolean).map((role) => (
              <RoleItem
                key={role.id}
                id={role.id}
                name={role.serverRole.name}
                color={role.color || "bg-gray-500"}
                active={selectedRoleId === role.id}
                clickFun={() => handleRoleSelect(role)}
                show={role.serverRole.order >= limit}
                handleRemoveCateRole={handleRemoveCateRole}
              />
            ))}
            {defaultChannelRole && [defaultChannelRole].map((role) => (
              <RoleItemDefault
                key={role.id}
                name={"@everyone"}
                color={"bg-gray-500"}
                active={selectedRoleId === role.id}
                clickFun={() => handleRoleSelect(role)}
              />
            ))}
          </div>
          <div className="w-full mx-auto mt-1">
            <div className="h-[1px] w-full bg-indigo-400"></div>
          </div>
        </div>

        {/* Permissions Section */}
        <PermissionsDisplay permissions={permissions} setPermissions={setPermissions} updateCategoryRolePermission={updateCategoryRolePermission} limit={limit} />
      </div>
    </div>
  );
};

const RoleItem = ({ id, name, color, active, clickFun, show = true, handleRemoveCateRole }) => {
  return (
    <div
      className={`flex items-center space-x-2 py-[5px] px-3 text-sm rounded cursor-pointer hover:bg-gray-300 ${active ? "bg-gray-300" : ""} 
        ${show ? "" : "opacity-70"}`}
      onClick={clickFun}
    >
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-indigo-600 font-medium flex flex-1">
        <span className="flex-1 my-auto">
          {name}
        </span>
        <span>
          {show ?
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button>
                    <MdDeleteForever className="inline text-red-500 translate-x-[2px]" size={22} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to remove role {name}? </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will remove channel role and remove all the permission record related to this.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemoveCateRole(id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
            :
            <>
              <FaLock className="inline" size={17} />
            </>
          }
        </span>
      </span>
    </div>
  );
};

const RoleItemDefault = ({ name, color, active, clickFun, show = true }) => {
  return (
    <div
      className={`flex items-center space-x-2 py-[5px] px-3 text-sm rounded cursor-pointer hover:bg-gray-300 ${active ? "bg-gray-300" : ""} 
        ${show ? "" : "opacity-70"}`}
      onClick={clickFun}
    >
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-indigo-600 font-medium flex flex-1">
        <span className="flex-1">
          {name}
        </span>
        <span>
          {show ? "" :
            <>
              <FaLock className="inline" size={17} />
            </>
          }
        </span>
      </span>
    </div>
  );
};

const permissionData = {
  general: [
    { key: "viewChannel", title: "View Channel", description: "Allows members to view channels." },
    { key: "manageChannels", title: "Manage Channels", description: "Allows members to manage channels." },
    { key: "manageRoles", title: "Manage Roles", description: "Allows members to manage roles." }
  ],
  member: [{ key: "createInvite", title: "Create Invite", description: "Allows members to create invites." }],
  text: [
    { key: "sendMessage", title: "Send Messages", description: "Allows members to send messages." },
    { key: "attachFiles", title: "Attach Files", description: "Allows members to attach files." },
    { key: "manageMessage", title: "Manage Messages", description: "Allows members to manage messages." },
    { key: "seemessageHistory", title: "See Message History", description: "Allows members to see past messages." }
  ],
  voice: [
    { key: "connect", title: "Connect", description: "Allows members to connect to voice channels." },
    { key: "speak", title: "Speak", description: "Allows members to speak in voice channels." },
    { key: "video", title: "Video", description: "Allows members to stream video." },
    { key: "muteMembers", title: "Mute Members", description: "Allows members to mute others." },
    { key: "deafenMembers", title: "Deafen Members", description: "Allows members to deafen others." }
  ]
};

const options = [
  { value: "DENY", icon: X, bg: "bg-red-500", border: "border-red-600", color: "red" },
  { value: "NEUTRAL", icon: Minus, bg: "bg-gray-400", border: "border-gray-500", color: "gray" },
  { value: "ALLOW", icon: Check, bg: "bg-green-500", border: "border-green-600", color: "green" }
];

const PermissionsDisplay = ({ permissions, setPermissions, updateCategoryRolePermission, limit }) => {
  console.log(permissions)
  const filteredPermissions = Object.entries(permissionData)
    .flatMap(([category, perms]) =>
      perms.map(({ key, title, description }) => ({
        key,
        title,
        description,
        value: permissions[key] ?? "NEUTRAL",
        isAvailable: key in permissions
      }))
    );

  return (
    <div className="flex-1 ml-2 overflow-y-scroll">
      <div className="flex justify-between py-2 pb-0 font-bold text-indigo-600 align-middle">
        <div className="text-center my-auto uppercase">Permission</div>
      </div>
      {filteredPermissions.length > 0 ? (
        filteredPermissions.map(({ key, title, description, isAvailable }) => (
          <PermissionRow
            key={key}
            title={title}
            description={description}
            permissionKey={key}
            state={permissions}
            setState={setPermissions}
            isAvailable={isAvailable}
            show={!permissions?.serverRole || permissions.serverRole.order >= limit}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">No permissions available for this role.</p>
      )}
      <div className="mt-4 text-end">
        <button className="bg-indigo-500 py-2 px-4 text-white rounded cursor-pointer" onClick={updateCategoryRolePermission}>Save</button>
      </div>
    </div>
  );
};

const PermissionRow = ({ title, description, state, setState, permissionKey, isAvailable, show = true }) => {
  const currentValue = state?.[permissionKey] ?? "NEUTRAL";

  const handleClick = (value) => {
    if (isAvailable && show) {
      setState((prevState) => ({ ...prevState, [permissionKey]: value }));
    }
  };

  return (
    <div className={`border-b border-gray-300 py-2 ${!isAvailable && "hidden"} ${show ? "" : "opacity-70"}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-indigo-600 font-medium">{title}</h3>
        <div className="flex space-x-2">
          {options.map((opt) => (
            <PermissionButton
              key={opt.value}
              type={opt.value}
              onClick={() => handleClick(opt.value)}
              isSelected={currentValue === opt.value}
              isDisabled={!isAvailable}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
  );
};

const PermissionButton = ({ type, onClick, isSelected, isDisabled }) => {
  const option = options.find((opt) => opt.value === type);
  return (
    <motion.button
      className={`p-1 rounded border ${isDisabled ? "opacity-50 cursor-not-allowed" : isSelected ? option.bg : "bg-gray-200"
        } ${option.border} transition-all duration-300`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      <option.icon size={15} style={{ color: isSelected ? "white" : option.color }} />
    </motion.button>
  );
};

export default PermissionRoleComponent;
