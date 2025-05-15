"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getCategories } from "@/actions/server";
import { useParams, useRouter } from "next/navigation";
import { MdEventNote } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaEllipsisVertical } from "react-icons/fa6";
import { toast } from "@/hooks/use-toast";
import { reorderCategory } from "@/actions/category";
import { BsPlus } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";

import { CreateCategoryModal } from "@/components/modals/createCategoryModal"

const ItemType = "CATEGORY";

// Drag-and-Drop Category Item
const CategoryItem = ({ category, index, moveCategory }) => {
  const router = useRouter()
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCategory(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <>
      <div
        ref={(node) => ref(drop(node))}
        className={`p-3 py-2 pl-2 bg-white text-indigo-500 rounded cursor-pointer transition-all border border-indigo-500 shadow-lg`}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm flex">
            <FaEllipsisVertical className="my-auto mr-[3px]" size={17} />
            <span>{category.name}</span>
          </span>
          <div className="flex space-x-2">
            <button className="p-1 hover:bg-indigo-600 border border-indigo-500 bg-white text-indigo-500 hover:text-white transition rounded-full">
              <BiSolidEdit size={19} onClick={() => router.push(`/setting/category/${category.id}`)} />
            </button>
            <button className="p-1 hover:bg-indigo-600 border border-indigo-500 bg-white text-indigo-500 hover:text-white transition rounded-full">
              <PiDotsThreeOutlineFill size={19} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ServerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [reload,setReload]=useState(0);
  const params = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(params?.serverId);
        if (res?.success) {
          setCategories(res.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    if(params?.serverId){
      fetchCategories();
    }
  }, [params?.serverId,reload]);

  // Optimized function to move categories
  const moveCategory = useCallback((fromIndex, toIndex) => {
    setCategories((prev) => {
      const updatedCategories = [...prev];
      const [movedCategory] = updatedCategories.splice(fromIndex, 1);
      updatedCategories.splice(toIndex, 0, movedCategory);
      return updatedCategories;
    });
  }, []);
  console.log(categories)
  const handleReOrder = async () => {
    try {
      const category = categories.map((cat) => cat.id)
      console.log(category)
      const res = await reorderCategory(params?.serverId, category)
      console.log(res?.reorderCategory)
      if (res) {
        console.log("updated successfully")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="p-6 text-indigo-500 bg-gray-200">
      <h2 className="text-xl font-bold flex items-center">
        <MdEventNote className="mr-2" size={25} />
        Categories
      </h2>
      <p className="text-sm text-indigo-500">
        Change category settings and reorder how they appear on home page.
      </p>

      <DndProvider backend={HTML5Backend}>
        <div className="mt-5">
          <div className="flex items-center justify-between mb-4">
            <CreateCategoryModal serverId={params.serverId} setReload={setReload}>
              <button className="bg-indigo-500 hover:bg-indigo-600 px-3 py-2 rounded-md text-white flex">
                <FaPlus size={20} className="inline my-auto mr-1" /> Create Category
              </button>
            </CreateCategoryModal>
          </div>
          <h2 className="mb-2 flex justify-between">
            <span className="font-bold">
              Total Categories: {categories.length}
            </span>
            <span
              onClick={handleReOrder}
              className="bg-indigo-500 text-white px-3 py-[3px] rounded my-auto cursor-pointer hover:bg-indigo-600"
            >
              save
            </span>
          </h2>

          <div className="space-y-2 max-h-[400px] overflow-y-scroll scrollbar-none">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  index={index}
                  moveCategory={moveCategory}
                />
              ))
            ) : (
              <p className="text-gray-500">No categories available.</p>
            )}
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default ServerCategories;