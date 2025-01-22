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

const serverRoles = () => {
  const params = useParams();
  const serverId = useMemo(() => params.serverId, [params?.serverId]);
  const [roles, setRoles] = useState([]);

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

  const handleDragEnd = (event) => {
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
              <IoSearchOutline className="" size={25} />
            </div>
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm py-2 px-4 ml-2 rounded whitespace-nowrap">
            Create Role
          </button>
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
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={roles.map((role) => role.id)}
                strategy={verticalListSortingStrategy}
              >
                <table
                  className="w-full table-auto border-collapse"
                  style={{ tableLayout: "auto" }}
                >
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="w-[2px] px-2 pr-0 py-2 text-left text-sm font-medium text-indigo-500">
                        
                      </th>
                      <th className="px-4 pl-2 py-2 text-left text-sm font-medium text-indigo-500">
                        Roles - {roles.length}
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-indigo-500">
                        Members
                      </th>
                      <th className="w-24 px-4 py-2 text-right text-sm font-medium text-indigo-500">
                        
                      </th>
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes} 
      {...listeners}
      className="border-b hover:bg-gray-300 rounded"
    >
      <td className="w-[2px] px-2 pr-0 py-2" >
        <BsThreeDotsVertical className="cursor-grab" />
      </td>
      <td className="px-4 pl-2 py-2 capitalize">{roleName}</td>
      <td className="px-4 py-2">{roleCount}
      <button
            className="p-1 text-indigo-500 hover:text-indigo-600 transition rounded-full ml-1"
            onClick={() => console.log("Edit role:", roleName)}
          >
            <FaUser size={17} />
          </button>
      </td>
      <td className="w-auto px-4 py-2">
        <div className="flex space-x-2">
          <button
            className="p-1 hover:bg-indigo-600 bg-indigo-500 text-white transition rounded-full"
            onClick={() => console.log("Edit role:", roleName)}
          >
            <BiSolidEdit size={17} />
          </button>
          <button
            className="p-1 hover:bg-indigo-600 bg-indigo-500 text-white transition rounded-full"
            onClick={() => console.log("Options for:", roleName)}
          >
            <PiDotsThreeOutlineFill size={17} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default serverRoles;
