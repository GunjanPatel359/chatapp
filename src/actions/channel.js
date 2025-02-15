"use server"

import { isAuthUser } from "@/lib/authMiddleware";
import prisma from "@/lib/db";

const handleDeleteChannel = async (channelId, categoryId) => {
    // Start a transaction to delete the channel and reorder the remaining channels
    const result = await prisma.$transaction(async (prisma) => {
        // Step 1: Delete the channel
        await prisma.channel.delete({
            where: { id: channelId },
        });

        // Step 2: Fetch category and its associated channels (only channel IDs)
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            select: {
                channels: {
                    where: { id: { not: channelId } }, // Exclude the deleted channel
                    orderBy: { order: 'asc' }, // Sort channels by order
                    select: { id: true }, // Only get the channel IDs
                },
            },
        });

        if (!category || !category.channels || category.channels.length === 0) {
            // No remaining channels found
            return { success: false, message: "No remaining channels found in this category." };
        }

        // Step 3: Reorder the remaining channels by updating their order field
        const updateChannelPromises = category.channels.map((channel, index) => {
            return prisma.channel.update({
                where: { id: channel.id },
                data: {
                    order: index, // Adjust the order of the remaining channels
                },
            });
        });

        // Step 4: Execute all update operations in parallel
        await Promise.all(updateChannelPromises);

        return { success: true, message: "Channel deleted and remaining channels reordered successfully" };
    });
};

export const createChannel = async (serverId, categoryId, data) => {
    try {
        // Validate input parameters
        if (!serverId || !categoryId || !data.name || !data.description) {
            return { success: false, message: 'Server ID, Category ID, name, and description are required' };
        }

        // Check if user is authenticated
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: 'You must be logged in to create a channel' };
        }

        // Fetch user's server profile and roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId,
                },
                isDeleted: false,
            },
            include: {
                roles: { include: { role: true } },
            },
        });

        if (!userServerProfile) {
            return { success: false, message: 'You must be a member of the server to create a channel' };
        }

        // Verify if the category exists
        const isVerifyCategory = await prisma.category.findFirst({
            where: { id: categoryId, serverId },
            include:{
                channels:true
            }
        });

        if (!isVerifyCategory) {
            return { success: false, message: 'Category does not exist' };
        }

        // Fetch server and check if it exists
        const server = await prisma.server.findFirst({
            where: { id: serverId },
            select: { ownerId: true, categories: true },
        });

        if (!server) {
            return { success: false, message: 'Server does not exist' };
        }

        // If the user is the server owner, allow channel creation
        if (server.ownerId == user.id) {
            const newChannel = await prisma.channel.create({
                data: {
                    name: data.name,
                    order: isVerifyCategory.channels.length,
                    description: data.description,
                    categoryId: categoryId,
                    type: data?.type || "TEXT",
                    defaultChannelRole: { create: {} },
                },
            });
            return { success: true, message: 'Channel created successfully' };
        }

        // If user is an admin, allow channel creation
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission);
        if (isAdmin) {
            const newChannel = await prisma.channel.create({
                data: {
                    name: data.name,
                    order: isVerifyCategory.channels.length,
                    description: data.description,
                    categoryId: categoryId,
                    type: data?.type || "TEXT",
                    defaultChannelRole: { create: {} },
                },
            });
            return { success: true, message: 'Channel created successfully' };
        }

        // Check if user has permission to manage channels
        const userServerProfileRoles = userServerProfile.roles.map((item) => item.roleId);
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: userServerProfileRoles },
                        manageChannels: { in: ["ALLOW", "NEUTRAL"] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        // If no category roles or no permission to manage channels
        if (!category || category.categoryRoles.length === 0) {
            return { success: false, message: 'You do not have permission to add roles' };
        }

        // If user has the "ALLOW" or "NEUTRAL" permission, create the channel
        const hasPermission = category.categoryRoles.some(
            (role) => role.manageChannels === "ALLOW" || (role.manageChannels === "NEUTRAL" && role.serverRole.manageChannels)
        );

        if (hasPermission) {
            const newChannel = await prisma.channel.create({
                data: {
                    name: data.name,
                    order: isVerifyCategory.channels.length,
                    description: data.description,
                    categoryId: categoryId,
                    type: data.type || "TEXT",
                    defaultChannelRole: { create: {} },
                },
            });
            return { success: true, message: 'Channel created successfully' };
        }

        return { success: false, message: 'You do not have permission to create a channel' };
    } catch (error) {
        console.error('Error in createChannel:', error);
        return { success: false, message: `Something went wrong: ${error.message || error}` };
    }
};

export const updateChannel = async (serverId, categoryId, channelId, data) => {
    try {
        // Validate input parameters
        if (!serverId || !categoryId || !channelId || !data.name || !data.description) {
            return { success: false, message: 'Please provide all the required fields' };
        }

        // Check if user is authenticated
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: 'You are not logged in' };
        }

        // Fetch user's server profile and roles
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: 'You are not a member of this server' };
        }

        // Verify if the channel exists in the specified category
        const verifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                categoryId: categoryId
            }
        });

        if (!verifyChannel) {
            return { success: false, message: 'Channel not found' };
        }

        // Verify if the server exists and belongs to the correct category
        const server = await prisma.server.findFirst({
            where: {
                id: serverId,
                categories: { some: { id: categoryId } }
            }
        });

        if (!server) {
            return { success: false, message: 'Server with this category not found' };
        }

        // If user is the server owner, allow updating the channel
        if (server.ownerId == user.id) {
            const updatedChannel = await prisma.channel.update({
                where: { id: channelId },
                data: {
                    name: data.name,
                    description: data.description
                }
            });
            return { success: true, message: 'Channel updated successfully' };
        }

        // If the user is an admin, allow updating the channel
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission);
        if (isAdmin) {
            const updatedChannel = await prisma.channel.update({
                where: { id: channelId },
                data: {
                    name: data.name,
                    description: data.description
                }
            });
            return { success: true, message: 'Channel updated successfully' };
        }

        // Check if user has permission to manage channels in this category
        const userServerProfileRoles = userServerProfile.roles.map((item) => item.roleId);
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: userServerProfileRoles },
                        manageChannels: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: { serverRole: true }
                }
            }
        });

        if (!category || category.categoryRoles.length === 0) {
            return { success: false, message: 'You do not have permission to update the channel' };
        }

        // If user has the "ALLOW" or "NEUTRAL" permission, allow updating the channel
        const hasPermission = category.categoryRoles.some(
            (role) => role.manageChannels === "ALLOW" || (role.manageChannels === "NEUTRAL" && role.serverRole.manageChannels)
        );

        if (hasPermission) {
            const updatedChannel = await prisma.channel.update({
                where: { id: channelId },
                data: {
                    name: data.name,
                    description: data.description
                }
            });
            return { success: true, message: 'Channel updated successfully' };
        }

        return { success: false, message: 'You do not have permission to update the channel' };
    } catch (error) {
        console.error('Error in updateChannel:', error);
        return { success: false, message: `Something went wrong: ${error.message || error}` };
    }
};

export const deleteChannel = async (serverId, categoryId, channelId) => {
    try {
        // Validate input parameters
        if (!serverId || !categoryId || !channelId) {
            return { success: false, message: "Please provide all the required fields" };
        }

        // Check if user is authenticated
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }

        // Fetch user's server profile and roles
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server" };
        }

        // Verify if the channel exists in the specified category
        const verifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                categoryId: categoryId
            }
        });

        if (!verifyChannel) {
            return { success: false, message: "Channel not found" };
        }

        // Verify if the server exists and belongs to the correct category
        const server = await prisma.server.findFirst({
            where: {
                id: serverId,
                categories: { some: { id: categoryId } }
            }
        });

        if (!server) {
            return { success: false, message: "Server with this category not found" };
        }

        // If user is the server owner, allow deleting the channel
        if (server.ownerId === user.id) {
            return await handleDeleteChannel(channelId,categoryId)
        }

        // If user is an admin, allow deleting the channel
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission);
        if (isAdmin) {
            return await handleDeleteChannel(channelId,categoryId)
        }

        // Check if user has permission to manage channels in this category
        const userServerProfileRoles = userServerProfile.roles.map((item) => item.roleId);
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: userServerProfileRoles },
                        manageChannels: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: { serverRole: true }
                }
            }
        });

        if (!category || category.categoryRoles.length === 0) {
            return { success: false, message: "You do not have permission to delete the channel" };
        }

        const hasPermission = category.categoryRoles.some(
            (role) => role.manageChannels === "ALLOW" || (role.manageChannels === "NEUTRAL" && role.serverRole.manageChannels)
        );

        if (hasPermission) {
            return await handleDeleteChannel(channelId,categoryId)
        }

        return { success: false, message: "You do not have permission to delete the channel" };
    } catch (error) {
        console.error("Error in deleteChannel:", error);
        return { success: false, message: `Something went wrong: ${error.message || error}` };
    }
};

export const channelReorder = async (serverId, channelReorder) => {
    try {
        // Check for required parameters
        if (!serverId || !Array.isArray(channelReorder) || channelReorder.length === 0) {
            throw new Error("Please provide all the required fields.");
        }

        // Check if user is authenticated
        const user = await isAuthUser();
        if (!user) {
            throw new Error("User is not authenticated.");
        }

        // Fetch user's server profile
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                serverId,
                userId: user.id,
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            throw new Error("You are not a member of this server.");
        }

        // Fetch the server details
        const server = await prisma.server.findFirst({
            where: { id: serverId },
            include: {
                categories: { include: { channels: true } }
            }
        });

        if (!server) {
            throw new Error("Server not found.");
        }

        // Check if the user has the required permissions (owner or admin)
        const isOwnerOrAdmin = server.ownerId === user.id || userServerProfile.roles.some(role => role.role.adminPermission);
        if (!isOwnerOrAdmin) {
            throw new Error("You do not have permission to update the server.");
        }

        // Extract the existing and provided channel IDs
        const existingChannelIds = new Set(
            server.categories.flatMap(category => category.channels.map(channel => channel.id))
        );
        
        const providedChannelIds = new Set(
            channelReorder.flatMap(category => category.channels)
        );

        // Check if the reorder list contains exactly the same channels as the server
        const isValidReorder = [...existingChannelIds].every(id => providedChannelIds.has(id));

        if (!isValidReorder) {
            throw new Error("Invalid reorder: Some channels are missing or extra channels were provided.");
        }

        // Perform the transaction to update the channels and categories
        const updateChannels = await prisma.$transaction([
            // 1️⃣ Move channels to the correct category
            ...channelReorder.flatMap(({ id: categoryId, channels }) =>
                channels.map(channelId =>
                    prisma.channel.update({
                        where: { id: channelId },
                        data: { categoryId } // Move channel to the correct category
                    })
                )
            ),
        
            // 2️⃣ Update categories with the new channel order
            ...channelReorder.map(({ id: categoryId, channels }) =>
                prisma.category.update({
                    where: { id: categoryId },
                    data: {
                        channels: {
                            set: channels.map(channelId => ({ id: channelId })) // Reorder channels within the category
                        }
                    }
                })
            )
        ]);

        console.log("Channels reordered successfully:", updateChannels);
        return { success: true, message: "Channels reordered successfully." };
        
    } catch (error) {
        console.error("Error in channelReorder:", error);
        throw new Error(error.message || "Something went wrong while reordering channels.");
    }
};

export const getChannel = async (serverId) => {
    try {
        if (!serverId) {
            return { success: false, message: "Server ID is required." };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not authenticated." };
        }

        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You don't have permission to access this server." };
        }

        const server = await prisma.server.findFirst({
            where: { id: serverId },
            include: {
                categories: {
                    include:{
                        channels:{
                            orderBy:{order:"asc"}
                        }
                    },
                    orderBy: { order: "asc" }
                }
            }
        });

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        if (server.ownerId === user.id || userServerProfile.roles.some(role => role.role.adminPermission)) {
            return { success: true, categories: JSON.parse(JSON.stringify(server.categories)) };
        }

        return { success: false, message: "You do not have permission to access channels." };

    } catch (error) {
        console.error("Error fetching channels:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred while fetching channels." };
    }
};