"use client";
import { getServerRoles } from "@/actions/role";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HiMiniUsers } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";

import { CreateServerRoleModal } from "@/components/modals/createServerRoleModal";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const serverRoles = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const params = useParams();
  const serverId = useMemo(() => params.serverId, [params?.serverId]);
  const [roles, setRoles] = useState([]);
  const [dragging, setDragging] = useState(false); // State to manage overlay

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await getServerRoles(serverId);
        if (res.success) {
          setRoles(res.roles);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    };
    if (serverId) {
      fetchPage();
    }
  }, [serverId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setDragging(true); // Enable overlay when dragging starts
  };

  const handleDragEnd = (event) => {
    setDragging(false); // Disable overlay when dragging ends
    const { active, over } = event;
    if (active.id !== over.id) {
      setRoles((items) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  return (
    <div className="text-indigo-500 h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold flex">
          <HiMiniUsers className="my-auto mr-2" size={25} />
          Roles
        </h2>
        <p className="text-sm text-indigo-500">
          Use roles to group your server members and assign permissions.
        </p>

        <div className="flex items-center mt-4">
          <div className="flex flex-1 rounded pl-4 pr-2 py-[5px] bg-gray-50 border border-indigo-500">
            <input
              type="text"
              placeholder="Search Roles"
              className="bg-transparent text-sm w-full focus:outline-none flex-1 placeholder:text-indigo-400 text-indigo-500"
            />
            <div className="mx-1">|</div>
            <div className="flex items-center">
              <IoSearchOutline size={25} />
            </div>
          </div>
          <CreateServerRoleModal serverId={serverId}>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm py-2 px-4 ml-2 rounded whitespace-nowrap">
              Create Role
            </button>
          </CreateServerRoleModal>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Members use the color of the highest role they have on this list. Drag
          roles to reorder them.{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Need help with permissions?
          </a>
        </p>
      </div>

      <div>
        <div className="w-full">
          {roles.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={roles.map((role) => role.id)}
                strategy={verticalListSortingStrategy}
              >
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="w-[2px] px-2 pr-0 py-2 text-left text-sm font-medium text-indigo-500"></th>
                      <th className="px-4 pl-2 py-2 text-left font-medium text-indigo-500">
                        Roles - {roles.length}
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-indigo-500">
                        Members
                      </th>
                      <th className="w-24 px-4 py-2 text-right font-medium text-indigo-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <SortableRow
                        key={role.id}
                        id={role.id}
                        roleName={role.name}
                        roleCount={role?.UserRoleAssignment?.length || 0}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          ) : (
            <div>No roles available</div>
          )}
        </div>
      </div>
    </div>
  );
};

const SortableRow = ({ id, roleName, roleCount }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const [selectedRole, setSelectedRole] = useState(""); // State to manage the selected role
  const [activeSection, setActiveSection] = useState("display"); // State to manage active section
  const [permissions, setPermissions] = useState({
    viewChannels: false,
    manageChannels: false,
    manageRoles: false,
  }); // Initialize permissions state

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="border-b bg-gray-200 rounded cursor-pointer"
      >
        <td className="w-[2px] px-2 pr-0 py-2">
          <BsThreeDotsVertical className="cursor-grab" />
        </td>
        <td className="px-4 pl-2 py-2 capitalize">{roleName}</td>
        <td className="px-4 py-2 flex">
          <span className="my-auto text-center">{roleCount}</span>
          <button className="p-1 text-indigo-500 hover:text-indigo-600 transition rounded-full ml-1">
            <FaUser size={19} />
          </button>
        </td>
        <td className="w-auto px-4 py-2">
          <div className="flex space-x-2">
            <button
              className="p-1 hover:bg-indigo-600 bg-indigo-500 text-white transition rounded-full"
              onClick={() => setSelectedRole(roleName)} // Open the modal
            >
              <BiSolidEdit size={19} />
            </button>
            <button className="p-1 hover:bg-indigo-600 bg-indigo-500 text-white transition rounded-full">
              <PiDotsThreeOutlineFill size={19} />
            </button>
          </div>
        </td>
      </tr>

      {/* Modal for editing role */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Role: {selectedRole}</h3>

            {/* Tabs for Navigation */}
            <div className="flex space-x-4 mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveSection("display")}
                className={`pb-2 text-sm font-medium ${activeSection === "display"
                    ? "text-indigo-500 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Display
              </button>
              <button
                onClick={() => setActiveSection("permissions")}
                className={`pb-2 text-sm font-medium ${activeSection === "permissions"
                    ? "text-indigo-500 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Permissions
              </button>
              <button
                onClick={() => setActiveSection("manage")}
                className={`pb-2 text-sm font-medium ${activeSection === "manage"
                    ? "text-indigo-500 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Manage Access
              </button>
            </div>

            {/* Display Section */}
            {activeSection === "display" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Display</label>
                <input
                  type="text"
                  placeholder="Enter display name"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {/* Scrollable Permissions Section */}
            {activeSection === "permissions" && (
              <div className="mb-4 max-h-64 overflow-y-auto pr-1">
                <label className="block text-sm font-medium text-gray-700">Permissions</label>
                <div className="mt-2 space-y-4">
                  {/* View Channels Permission */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">View Channels</p>
                      <p className="text-xs text-gray-500">
                        Allows members to view channels by default (excluding private channels).
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.viewChannels ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          viewChannels: !prev.viewChannels,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.viewChannels ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Manage Channels Permission */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Manage Channels</p>
                      <p className="text-xs text-gray-500">
                        Allows members to create, edit, or delete channels.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.manageChannels ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          manageChannels: !prev.manageChannels,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.manageChannels ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Manage Roles Permission */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Manage Roles</p>
                      <p className="text-xs text-gray-500">
                        Allows members to create new roles and edit or delete roles lower than their highest role.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.manageRoles ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          manageRoles: !prev.manageRoles,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.manageRoles ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* MEMBER PERMISSIONS */}
                  <div className="pt-2">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-wider">Member Permissions</h3>
                  </div>
                  
                  {/* Create Invite */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Create Invite</p>
                      <p className="text-xs text-gray-500">
                        Allows members to create invites for channels.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.createInvite ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          createInvite: !prev.createInvite,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.createInvite ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Kick Members */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Kick Members</p>
                      <p className="text-xs text-gray-500">
                        Allows kicking members from the server.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.kickMembers ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          kickMembers: !prev.kickMembers,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.kickMembers ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Ban Members */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ban Members</p>
                      <p className="text-xs text-gray-500">
                        Allows banning members from the server.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.banMembers ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          banMembers: !prev.banMembers,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.banMembers ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Timeout Members */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Timeout Members</p>
                      <p className="text-xs text-gray-500">
                        Allows timing out members temporarily.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.timeOutMembers ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          timeOutMembers: !prev.timeOutMembers,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.timeOutMembers ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* TEXT CHANNEL PERMISSIONS */}
                  <div className="pt-2">
                    <h3 className="text-xs font-semibold text-gray-500  tracking-wider">Text Channel Permissions</h3>
                  </div>
                  
                  {/* Send Messages */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Send Messages</p>
                      <p className="text-xs text-gray-500">
                        Allows sending messages in text channels.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.sendMessage ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          sendMessage: !prev.sendMessage,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.sendMessage ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Attach Files */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Attach Files</p>
                      <p className="text-xs text-gray-500">
                        Allows uploading and attaching files in messages.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.attachFiles ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          attachFiles: !prev.attachFiles,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.attachFiles ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Manage Messages */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Manage Messages</p>
                      <p className="text-xs text-gray-500">
                        Allows deleting and managing other users' messages.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.manageMessage ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          manageMessage: !prev.manageMessage,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.manageMessage ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* See Message History */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">See Message History</p>
                      <p className="text-xs text-gray-500">
                        Allows viewing previous messages before joining.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.seemessageHistory ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          seemessageHistory: !prev.seemessageHistory,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.seemessageHistory ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* VOICE CHANNEL PERMISSIONS */}
                  <div className="pt-2">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-wider">Voice Channel Permissions</h3>
                  </div>
                  
                  {/* Connect */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Connect</p>
                      <p className="text-xs text-gray-500">
                        Allows connecting to a voice channel.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.connect ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          connect: !prev.connect,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.connect ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Speak */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Speak</p>
                      <p className="text-xs text-gray-500">
                        Allows speaking in a voice channel.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.speak ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          speak: !prev.speak,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.speak ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Video */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Video</p>
                      <p className="text-xs text-gray-500">
                        Allows sharing video in a voice channel.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.video ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          video: !prev.video,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.video ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Mute Members */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Mute Members</p>
                      <p className="text-xs text-gray-500">
                        Allows muting members in a voice channel.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.muteMembers ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          muteMembers: !prev.muteMembers,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.muteMembers ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Deafen Members */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Deafen Members</p>
                      <p className="text-xs text-gray-500">
                        Allows deafening members in a voice channel.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.deafenMembers ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          deafenMembers: !prev.deafenMembers,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.deafenMembers ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* ADMIN PERMISSION */}
                  <div className="pt-2">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-wider">Administrator</h3>
                  </div>
                  
                  {/* Admin Permission */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Admin Permission</p>
                      <p className="text-xs text-gray-500">
                        Grants all permissions and bypasses channel-specific overrides.
                      </p>
                    </div>
                    <button
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        permissions.adminPermission ? "bg-indigo-500" : "bg-gray-300"
                      }`}
                      onClick={() =>
                        setPermissions((prev) => ({
                          ...prev,
                          adminPermission: !prev.adminPermission,
                        }))
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          permissions.adminPermission ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Access Section */}
            {activeSection === "manage" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Manage Access</label>

                {/* Search Members Input */}
                <div className="mt-2 flex items-center bg-gray-50 border border-indigo-500 rounded-md p-2">
                  <input
                    type="text"
                    placeholder="Search Members"
                    className="bg-transparent text-sm w-full focus:outline-none placeholder:text-indigo-400 text-indigo-500"
                  />
                  <IoSearchOutline className="text-indigo-500" size={20} />
                </div>

                {/* Add Members Button */}
                <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 w-full">
                  Add Members
                </button>

                {/* Members List */}
                <div className="mt-4 space-y-2">
                  {/* Example Member 1 */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <img
                        src="https://via.placeholder.com/40" // Placeholder avatar
                        alt="Member Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">AniGame</p>
                        <p className="text-xs text-gray-500">AniGame#0359</p>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-600 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedRole("")} // Close the modal
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle form submission here
                  setSelectedRole(""); // Close the modal after submission
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};




export default serverRoles;