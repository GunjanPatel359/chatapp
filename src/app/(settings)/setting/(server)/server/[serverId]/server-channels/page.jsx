"use client";
import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaEdit, FaEllipsisV } from "react-icons/fa";

const ItemTypes = {
  CATEGORY: "CATEGORY",
  CHANNEL: "CHANNEL",
};

// Category component (no drag functionality here)
const CategoryItem = ({ category, index, moveCategory, moveChannel }) => {
  return (
    <div className="p-3 bg-white text-indigo-500 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{category.title}</span>
        <div className="flex space-x-2">
          <button className="text-indigo-400 hover:text-indigo-500">
            <FaEdit />
          </button>
          <button className="text-indigo-300 hover:text-indigo-400">
            <FaEllipsisV />
          </button>
        </div>
      </div>
      {/* Droppable area for channels */}
      <div className="pl-4 space-y-2">
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
      className={`flex items-center justify-between p-2 bg-white text-indigo-500 rounded-md cursor-pointer hover:bg-indigo-100 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span># {channel.name}</span>
    </div>
  );
};

const ServerChannels = () => {
  const [categories, setCategories] = useState([
    {
      id: "text",
      title: "TEXT CHANNELS",
      channels: [
        { id: "general", name: "general" },
        { id: "clips", name: "clips-and-highlights" },
      ],
    },
    {
      id: "voice",
      title: "VOICE CHANNELS",
      channels: [
        { id: "example", name: "example1" },
        { id: "example2", name: "example2" },
        { id: "example3", name: "example3" },
      ],
    },
  ]);

  const [search, setSearch] = useState("");

  // Function to move categories
  const moveCategory = (from, to) => {
    const updatedCategories = [...categories];
    const [movedCategory] = updatedCategories.splice(from, 1);
    updatedCategories.splice(to, 0, movedCategory);
    setCategories(updatedCategories);
  };

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

  // Filter categories by search
  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white text-indigo-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search Categories"
            className="p-2 bg-gray-100 text-indigo-500 rounded-md w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="ml-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md text-white">
            Create Category
          </button>
        </div>
        <h2 className="text-lg font-bold mb-2">Categories - {categories.length}</h2>
        <div className="space-y-2">
          {filteredCategories.map((category, index) => (
            <CategoryItem
              key={category.id}
              category={category}
              index={index}
              moveCategory={moveCategory}
              moveChannel={moveChannel}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default ServerChannels;