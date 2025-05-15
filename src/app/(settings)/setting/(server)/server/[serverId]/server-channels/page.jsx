
"use client";
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BiPlus, BiSolidEdit } from "react-icons/bi"
import { MdEventNote } from "react-icons/md";
import { channelReorder, getChannel } from "@/actions/channel"
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FaHashtag } from "react-icons/fa";
import { HiMiniSpeakerWave } from "react-icons/hi2";

import { CreateChannelModal } from "@/components/modals/createChannelModal"

const ItemTypes = {
  CATEGORY: "CATEGORY",
  CHANNEL: "CHANNEL",
};

// Category component (no drag functionality here)
const CategoryItem = ({ category, index, moveChannel, setReload }) => {
  const params = useParams()
  return (
    <div className="p-3 bg-white text-indigo-500 rounded shadow-md">
      <div className="flex justify-between items-center pl-2">
        <span className="font-bold text-sm">{category.name}</span>
        <span className="pr-1">
          <CreateChannelModal categoryName={category.name} categoryId={category.id} serverId={params.serverId} setReload={setReload}>
            <BiPlus size={26} className="hover:scale-105 cursor-pointer" />
          </CreateChannelModal>
        </span>
      </div>
      {/* Droppable area for channels */}
      <div>
        {category.channels.map((channel, idx) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            index={idx}
            categoryIndex={index}
            moveChannel={moveChannel}
          />
        ))}
      </div>
    </div>
  );
};

// Draggable channel component
const ChannelItem = ({ channel, index, categoryIndex, moveChannel }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CHANNEL,
    item: { index, categoryIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CHANNEL,
    hover: (draggedItem) => {
      if (
        draggedItem.categoryIndex !== categoryIndex ||
        draggedItem.index !== index
      ) {
        // Move the channel from one category to another or within the same category
        moveChannel(
          draggedItem.categoryIndex,
          draggedItem.index,
          categoryIndex,
          index
        );
        draggedItem.categoryIndex = categoryIndex;
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-2 bg-white text-indigo-500 rounded cursor-pointer hover:bg-indigo-100 ${isDragging ? "opacity-50" : ""
        }`}
    >
      <span className="">{channel.type == "TEXT" ? <FaHashtag className="inline" size={17} /> : <HiMiniSpeakerWave size={18} className="inline" />} {channel.name}</span>
      <span>
        <BiSolidEdit size={19} className="hover:text-indigo-600 transition-all hover:scale-110" />
      </span>
    </div>
  );
};

const ServerChannels = () => {
  const params = useParams()
  const [categories, setCategories] = useState([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const initiatePage = async () => {
      try {
        const res = await getChannel(params.serverId)
        if (res.success) {
          setCategories(res.categories)
        }
        if (!res.success) {
          toast({
            title: "Error",
            description: res.message,
            variant: "destructive"
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    initiatePage()
  }, [params.serverId, reload])

  // Function to move channels between categories
  const moveChannel = (
    fromCategoryIndex,
    fromIndex,
    toCategoryIndex,
    toIndex
  ) => {
    const updatedCategories = [...categories];

    // Remove the channel from the source category
    const [movedChannel] = updatedCategories[fromCategoryIndex].channels.splice(
      fromIndex,
      1
    );

    // Add the channel to the target category
    updatedCategories[toCategoryIndex].channels.splice(toIndex, 0, movedChannel);

    setCategories(updatedCategories);
  };

  const handleChannelReorder = async () => {
    try {
      const temp = categories.map((cate) => { return { id: cate.id, channels: cate.channels.map((chan) => chan.id) } })
      console.log(temp)
      const res = await channelReorder(params.serverId, temp)
      if (res.success) {
        toast({
          title: "Success",
          description: "Channels reordered successfully",
          variant: "success"
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="bg-gray-200 p-6 text-indigo-500">
      <h2 className="text-xl font-bold flex items-center">
        <MdEventNote className="mr-2" size={25} />
        Channels
      </h2>
      <p className="text-sm text-indigo-500">
        Change channel settings and reorder how they appear on home page.
      </p>
      <DndProvider backend={HTML5Backend}>
        <div className="text-indigo-500">
          <div className="flex items-center justify-between mb-4">

          </div>
          <div className="flex justify-between mb-1">
            <h2 className="font-bold mb-2">Channels - {categories.reduce((sum, cate) => sum + cate.channels.length, 0)}</h2>
            <span className="bg-indigo-500 text-white py-1 px-3 rounded cursor-pointer hover:bg-indigo-600" onClick={handleChannelReorder}>Save</span>
          </div>
          <div className="space-y-2 overflow-y-scroll max-h-[450px] scrollbar-none">
            {categories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                index={index}
                moveChannel={moveChannel}
                setReload={setReload}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default ServerChannels;