"use client";
import { getServerRoles, reorderServerRole } from "@/actions/role";
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
import { serverSetting } from "@/hooks/zusthook";

const serverRoles = () => {
  const { userServerProfile, user } = serverSetting()
  // console.log(userServerProfile, user)

  const userHighestRole = useMemo(() => {
    if (userServerProfile.server.ownerId === user.id) {
      return -1; // Return 0 if the user is the server owner
    }

    const highestRole = userServerProfile.server.roles
      .filter(role => role.adminPermission) // Filter roles with admin permission
      .reduce((prev, current) => prev.priority > current.priority ? prev : current, null);

    return highestRole ? highestRole.priority : 0; // Return priority or 0 if no role found

  }, [userServerProfile, user.id]); // Depend on both userServerProfile and user.id

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

  const reorderRoleSubmit=async()=>{
    try {
      const temp=roles.map((role)=>role.id)
      const res=await reorderServerRole(serverId,temp)
      if(res.success){
        return toast({
          title: "successfully updated the role order",
          variant:"success"
        })
      }
      toast({
        title: "Error",
        description: res.message,
        variant:"destructive"
      })
    } catch (error) {
      console.log(error)
    }
  }

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
        <div className="w-full flex flex-col">
          {roles.length > 0 ? (
            <>
            <div className="py-2 px-3 bg-indigo-500 text-white hover:bg-indigo-400 cursor-pointer"
            onClick={reorderRoleSubmit}
            >Save</div>
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
                        reorderable={role.order<=userHighestRole?false:true}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
            </>
          ) : (
            <div>No roles available</div>
          )}
        </div>
      </div>
    </div>
  );
};

const SortableRow = ({ id, roleName, roleCount, reorderable }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: !reorderable }); // Disable sorting if reorderable is false

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Reduce opacity while dragging
    cursor: reorderable ? "grab" : "default", // Change cursor style based on reorderable state
  };

  return (
    <>
      <tr ref={setNodeRef} style={style} className="border-b bg-gray-200 rounded cursor-pointer" {...attributes} {...listeners}>
        <td className="w-[2px] px-2 pr-0 py-2">
          {/* Disable drag handle if reorderable is false */}
          {reorderable ? (
            <BsThreeDotsVertical className="cursor-grab" />
          ) : (
            <BsThreeDotsVertical className="text-gray-400" />
          )}
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
            >
              <BiSolidEdit size={19} />
            </button>
            <button className="p-1 hover:bg-indigo-600 bg-indigo-500 text-white transition rounded-full">
              <PiDotsThreeOutlineFill size={19} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};





export default serverRoles;