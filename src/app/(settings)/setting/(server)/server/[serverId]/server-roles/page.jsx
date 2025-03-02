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

            {/* Display Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Display</label>
              <input
                type="text"
                placeholder="Enter display name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Permissions Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Permissions</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="manageMessages"
                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-indigo-500 rounded"
                  />
                  <label htmlFor="manageMessages" className="ml-2 text-sm text-gray-700">
                    Manage Messages
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="kickMembers"
                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-indigo-500 rounded"
                  />
                  <label htmlFor="kickMembers" className="ml-2 text-sm text-gray-700">
                    Kick Members
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="banMembers"
                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-indigo-500 rounded"
                  />
                  <label htmlFor="banMembers" className="ml-2 text-sm text-gray-700">
                    Ban Members
                  </label>
                </div>
              </div>
            </div>

            {/* Manage Access Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Manage Access</label>
              <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 w-full">
                Add Members
              </button>
            </div>

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