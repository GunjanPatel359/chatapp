"use client";


import React, { useRef } from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    PlusIcon,
    MinusIcon,
    GripVertical,
} from "lucide-react";
import { FaHashtag } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";
import { DndContext, closestCenter, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createServer } from "@/actions/server";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CreateServerPage = () => {
    const router = useRouter()
    const { toast } = useToast()
    const fileInputRef = useRef(null);
    const [imageAvatar, setImageAvatar] = useState("")

    const handleFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 1 * 1024 * 1024; // 1MB

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a PNG, JPG, or JPEG file.",
                variant: "destructive"
            });
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            toast({
                title: "Invalid file size",
                description: "File size exceeds 1MB. Please choose a smaller file.",
                variant: "destructive"
            });
            return;
        }

        setImageAvatar(file);
    };

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [categories, setCategories] = useState([
        {
            name: "TEXT CHANNELS",
            channels: [{ name: "General", id: 1, type: "TEXT" }],
            id: 1,
        },
    ]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCategoryNameChange = (id, value) => {
        setCategories((prev) =>
            prev.map((category) =>
                category.id === id ? { ...category, name: value } : category
            )
        );
    };

    const handleCategoryNameBlur = (id, value) => {
        const updatedName = value.trim() === "" ? "Default Category" : value.trim();
        setCategories((prev) =>
            prev.map((category) =>
                category.id === id ? { ...category, name: updatedName } : category
            )
        );
    };

    const handleChannelNameChange = (categoryId, channelId, value) => {
        setCategories((prev) =>
            prev.map((category) =>
                category.id === categoryId
                    ? {
                        ...category,
                        channels: category.channels.map((channel) =>
                            channel.id === channelId ? { ...channel, name: value } : channel
                        ),
                    }
                    : category
            )
        );
    };

    const handleChannelNameBlur = (categoryId, channelId, value) => {
        const updatedName = value.trim() === "" ? "Default Channel" : value.trim();
        setCategories((prev) =>
            prev.map((category) =>
                category.id === categoryId
                    ? {
                        ...category,
                        channels: category.channels.map((channel) =>
                            channel.id === channelId
                                ? { ...channel, name: updatedName }
                                : channel
                        ),
                    }
                    : category
            )
        );
    };



    // Function to add a new category
    const handleAddCategory = () => {
        const newCategory = {
            name: "New Category",
            channels: [],
            id: Date.now(),
        };
        setCategories((prev) => [...prev, newCategory]);
    };

    // Function to add a new channel to a category
    const handleAddChannel = (categoryId) => {
        const newChannel = {
            name: "New Channel",
            id: Date.now(),
            type: "TEXT", // Default type
        };
        setCategories((prev) =>
            prev.map((category) =>
                category.id === categoryId
                    ? { ...category, channels: [...category.channels, newChannel] }
                    : category
            )
        );
    };

    const handleDeleteCategory = (categoryId) => {
        setCategories((prev) =>
            prev.filter((category) => category.id !== categoryId)
        );
    };

    const handleDeleteChannel = (categoryId, channelId) => {
        setCategories((prev) =>
            prev.map((category) =>
                category.id === categoryId
                    ? {
                        ...category,
                        channels: category.channels.filter((channel) => channel.id !== channelId),
                    }
                    : category
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name && !formData.description) {
            toast({
                title: "Error",
                description: "name and description is required",
                variant: "destructive"
            })
        }
        const imagedata = new FormData();
        if (imageAvatar) {
            imagedata.append("file", imageAvatar);
        }
        try {
            const res = await createServer(formData.name, formData.description, categories, imagedata)
            console.log(res)
            if (res.success) {
                toast({
                    title: "Success",
                    description: "Server created successfully",
                    variant: "success"
                })
                router.push("/home")
            }
            if (!res.success) {
                toast({
                    title: "Error",
                    description: res.message,
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }
    };

    return (
        <div className="min-h-screen bg-white">

            <header className="w-full h-20 bg-white border-b border-gray-200 flex items-center px-6">
                <div className="flex items-center space-x-3">
                    {/* Logo */}
                    <Image
                        src="/chatverse.svg"
                        alt="Chatverse Logo"
                        width={40}
                        height={40}
                        className="block"
                    />
                    {/* App Name */}
                    <h1 className="text-xl font-semibold text-indigo-500 cursor-pointer" onClick={()=>router.push("/home")}>
                        Chatverse
                    </h1>
                </div>
            </header>

            <div className="flex">
                {/* Server Structure Preview */}
                <div className="w-1/3 bg-gray-100 m-8 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold text-indigo-700">Server Structure</h2>
                    <div className="h-[2px] bg-indigo-300 mb-1" />
                    <ChannelManager
                        categories={categories}
                        setCategories={setCategories}
                        handleCategoryNameChange={handleCategoryNameChange}
                        handleAddChannel={handleAddChannel}
                        handleDeleteChannel={handleDeleteChannel}
                        handleChannelNameChange={handleChannelNameChange}
                        handleCategoryNameBlur={handleCategoryNameBlur}
                        handleChannelNameBlur={handleChannelNameBlur}
                    />
                </div>

                {/* Add/Edit Section */}
                <div className="w-2/3 p-8">
                    <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-md p-6">
                        <h1 className="text-xl font-semibold mb-2 text-indigo-700">Create a New Server</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="flex">
                                <div className="bg-gray-200 text-white rounded-full w-36 h-36 mx-auto flex hover:cursor-pointer hover:bg-gray-300 transition-all border-2 border-indigo-500 shadow-lg"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imageAvatar ? (
                                        <img src={URL.createObjectURL(imageAvatar)} alt="Preview" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <IoImageOutline className="mx-auto my-auto text-indigo-500" size={65} />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/jpg" // Restrict to images
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-indigo-500 font-medium mb-1">
                                    Server Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-indigo-400 rounded-md bg-white text-sm text-indigo-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-indigo-500 font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-indigo-400 rounded-md bg-white text-sm text-indigo-500 resize-none"
                                />
                            </div>

                            <div className="mb-2">
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 text-sm"
                                >
                                    + Add Category
                                </button>
                            </div>

                            <div className="my-4">
                                <div className="">
                                    <h1 className="text-md font-semibold mb-1 text-indigo-500">
                                        Reorder Categories
                                    </h1>
                                    <CategoryManager
                                        setCategories={setCategories}
                                        categories={categories}
                                        handleDeleteCategory={handleDeleteCategory}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                            >
                                Create Server
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SortableChannel = ({ id, channel, handleDeleteChannel }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}

            className="flex items-center py-1 rounded-md"
        >
            {/* Drag Handle */}
            <div className="mr-2 cursor-grab"
                {...attributes}
                {...listeners}>
                <GripVertical size={20} className="text-indigo-500" />
            </div>

            {/* Channel Type Icon */}
            {channel.type && <FaHashtag size={15} className="text-indigo-500" />}

            {/* Channel Name Input */}
            <input
                type="text"
                value={channel.name}
                onChange={(e) => channel.onChange(e.target.value)}
                onBlur={(e) => channel.onBlur(e.target.value)}
                className="flex-1 px-1 py-1 rounded-md text-indigo-500 font-semibold bg-transparent text-sm lowercase outline-none"
            />

            {/* Delete Channel Button */}
            <div
                onClick={() => handleDeleteChannel(channel.categoryId, channel.id)}
                className="ml-2 cursor-pointer text-red-500"
            >
                <MinusIcon />
            </div>
        </div>
    );
};

const ChannelManager = ({
    categories,
    setCategories,
    handleCategoryNameChange,
    handleAddChannel,
    handleDeleteChannel,
    handleChannelNameChange,
    handleCategoryNameBlur,
    handleChannelNameBlur
}) => {
    const [activeChannel, setActiveChannel] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
        })
    )

    const handleDragStart = (event) => {
        const { active } = event;
        const [categoryId, channelId] = active.id.split(":");
        const category = categories.find((cat) => cat.id === Number(categoryId));
        const channel = category.channels.find((ch) => ch.id === Number(channelId));
        setActiveChannel({ ...channel, categoryId: Number(categoryId) });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id.split(":");
        const overId = over.id.split(":");

        const activeCategoryId = Number(activeId[0]);
        const activeChannelId = Number(activeId[1]);
        const overCategoryId = Number(overId[0]);
        const overChannelId = Number(overId[1]);

        setCategories((prev) => {
            const activeCategory = prev.find((c) => c.id === activeCategoryId);
            const overCategory = prev.find((c) => c.id === overCategoryId);

            const activeChannelIndex = activeCategory.channels.findIndex(
                (ch) => ch.id === activeChannelId
            );
            const overChannelIndex = overCategory.channels.findIndex(
                (ch) => ch.id === overChannelId
            );

            if (activeCategoryId === overCategoryId) {
                const reorderedChannels = arrayMove(
                    activeCategory.channels,
                    activeChannelIndex,
                    overChannelIndex
                );
                return prev.map((cat) =>
                    cat.id === activeCategoryId
                        ? { ...cat, channels: reorderedChannels }
                        : cat
                );
            }

            const activeChannel = activeCategory.channels[activeChannelIndex];
            return prev.map((cat) => {
                if (cat.id === activeCategoryId) {
                    return {
                        ...cat,
                        channels: cat.channels.filter((ch) => ch.id !== activeChannelId),
                    };
                } else if (cat.id === overCategoryId) {
                    const updatedChannels = [...cat.channels];
                    updatedChannels.splice(overChannelIndex, 0, activeChannel);
                    return { ...cat, channels: updatedChannels };
                }
                return cat;
            });
        });

        setActiveChannel(null);
    };

    const handleDragCancel = () => {
        setActiveChannel(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="overflow-y-scroll h-[80vh] scrollbar-none pl-2">
                {categories.map((category) => (
                    <div key={category.id}>
                        {/* Category Header */}
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={category.name}
                                onChange={(e) =>
                                    handleCategoryNameChange(category.id, e.target.value)
                                }
                                onBlur={(e) => handleCategoryNameBlur(category.id, e.target.value)}
                                className="w-full my-1 rounded-md text-indigo-600 bg-transparent text-sm uppercase outline-none border-none font-semibold"
                            />
                            <div
                                onClick={() => handleAddChannel(category.id)}
                                className="ml-2 text-white rounded cursor-pointer"
                            >
                                <PlusIcon className="text-indigo-500" />
                            </div>
                        </div>

                        {/* Channels */}
                        <SortableContext
                            items={category.channels.map(
                                (channel) => `${category.id}:${channel.id}`
                            ) || []}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="pl-2">
                                {category.channels.map((channel) => (
                                    <SortableChannel
                                        key={`${category.id}:${channel.id}`}
                                        id={`${category.id}:${channel.id}`}
                                        channel={{
                                            ...channel,
                                            categoryId: category.id,
                                            onChange: (value) =>
                                                handleChannelNameChange(
                                                    category.id,
                                                    channel.id,
                                                    value
                                                ),
                                            onBlur: (value) => handleChannelNameBlur(
                                                category.id,
                                                channel.id,
                                                value
                                            )
                                        }}
                                        handleDeleteChannel={handleDeleteChannel}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeChannel ? (
                    <div className="flex items-center bg-gray-700 p-1 rounded-md">
                        <div className="mr-2">
                            <GripVertical size={20} />
                        </div>
                        {activeChannel.type && <FaHashtag size={15} className="mr-2" />}
                        <span className="flex-1 text-white text-sm lowercase">{activeChannel.name}</span>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

const SortableItem = ({ id, category, handleDeleteCategory }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center mb-2 bg-gray-200 p-2 rounded-md"
        >
            {/* Drag Handle */}
            <div className="mr-2 cursor-grab"
                {...attributes}
                {...listeners}>
                <GripVertical size={20} className="text-indigo-500" />
            </div>

            {/* Category Name */}
            <span className="flex-1 text-indigo-500 text-sm uppercase font-semibold">
                {category.name}
            </span>

            {/* Delete Category Button */}
            <div
                onClick={() => handleDeleteCategory(category.id)}
                className="ml-2 cursor-pointer text-red-500"
            >
                <MinusIcon />
            </div>
        </div>
    );
};

const CategoryManager = ({ categories, setCategories, handleDeleteCategory }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = categories.findIndex((cat) => cat.id === active.id);
            const newIndex = categories.findIndex((cat) => cat.id === over.id);
            const reorderedCategories = arrayMove(categories, oldIndex, newIndex);
            setCategories(reorderedCategories);
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext
                items={categories.map((category) => category.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="h-[150px] overflow-y-scroll scrollbar-none">
                    {categories.map((category) => (
                        <SortableItem
                            key={category.id}
                            id={category.id}
                            category={category}
                            handleDeleteCategory={handleDeleteCategory}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};


export default CreateServerPage;
