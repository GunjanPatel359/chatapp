"use client";
import React, { useEffect, useState } from "react";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { getCategoryRolesData } from "@/actions/role";
import { useParams } from "next/navigation";
import { X, Minus, Check } from "lucide-react";
import { motion } from "framer-motion";

const PermissionRoleComponent = () => {
  const params = useParams();
  const [categoryRoles, setCategoryRoles] = useState([]);
  const [defaultCategoryRole, setDefaultCategoryRole] = useState(null);
  const [serverRoles, setServerRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const fetchCategoryRoleData = async () => {
      try {
        const res = await getCategoryRolesData(params.categoryId);
        if (res.success) {
          setCategoryRoles(res.categoryRoles.categoryRoles);
          setDefaultCategoryRole(res.categoryRoles.defaultCategoryRole);
          setServerRoles(res.serverRoles);

          const defaultRole = res.categoryRoles.defaultCategoryRole;
          setSelectedRoleId(defaultRole.id);
          setPermissions(defaultRole||{});
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategoryRoleData();
  }, [params.categoryId]);

  const handleRoleSelect = (role) => {
    setSelectedRoleId(role.id);
    setPermissions(role.permissions ?? {});
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-indigo-600 text-lg font-semibold mb-2">Category Permissions</h2>
      <p className="text-indigo-500 text-sm font-medium mb-2">Customize who can do what in this category</p>
      <div className="h-[2px] w-full bg-indigo-300"></div>

      <div className="flex mt-4">
        {/* Roles Section */}
        <div className="w-[35%]">
          <div className="flex justify-between px-3 py-2 font-bold text-indigo-600">
            <div className="text-center">ROLES</div>
            <div>
              <HiMiniPlusCircle size={25} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {[...categoryRoles, defaultCategoryRole].filter(Boolean).map((role) => (
              <RoleItem
                key={role.id}
                name={role.name}
                color={role.color || "bg-gray-500"}
                active={selectedRoleId === role.id}
                clickFun={() => handleRoleSelect(role)}
              />
            ))}
          </div>
          <div className="w-full mx-auto mt-2">
            <div className="h-[1px] w-full bg-indigo-400"></div>
          </div>
        </div>

        {/* Permissions Section */}
        <PermissionsDisplay permissions={permissions} setPermissions={setPermissions} />
      </div>
    </div>
  );
};

const RoleItem = ({ name, color, active, clickFun }) => {
  return (
    <div
      className={`flex items-center space-x-2 py-[5px] px-3 text-sm rounded cursor-pointer hover:bg-gray-300 ${
        active ? "bg-gray-300" : ""
      }`}
      onClick={clickFun}
    >
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-indigo-600 font-medium">{name}</span>
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
    { key: "sendMessages", title: "Send Messages", description: "Allows members to send messages." },
    { key: "attachFiles", title: "Attach Files", description: "Allows members to attach files." },
    { key: "manageMessages", title: "Manage Messages", description: "Allows members to manage messages." },
    { key: "seeMessageHistory", title: "See Message History", description: "Allows members to see past messages." }
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

const PermissionsDisplay = ({ permissions, setPermissions }) => {
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
    <div className="flex-1 ml-2">
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
          />
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">No permissions available for this role.</p>
      )}
      <div className="mt-4 text-end">
        <button className="bg-indigo-500 py-2 px-4 text-white rounded cursor-pointer">Save</button>
      </div>
    </div>
  );
};

const PermissionRow = ({ title, description, state, setState, permissionKey, isAvailable }) => {
  const currentValue = state?.[permissionKey] ?? "NEUTRAL";

  const handleClick = (value) => {
    if (isAvailable) {
      setState((prevState) => ({ ...prevState, [permissionKey]: value }));
    }
  };

  return (
    <div className={`border-b border-gray-300 py-2 ${!isAvailable && "hidden"}`}>
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
      className={`p-1 rounded border ${
        isDisabled ? "opacity-50 cursor-not-allowed" : isSelected ? option.bg : "bg-gray-200"
      } ${option.border} transition-all duration-300`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      <option.icon size={15} style={{ color: isSelected ? "white" : option.color }} />
    </motion.button>
  );
};

export default PermissionRoleComponent;
