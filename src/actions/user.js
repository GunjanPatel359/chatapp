"use server";

import { UTApi } from "uploadthing/server";
import prisma from "@/lib/db";
import { isAuthUser } from "@/lib/authMiddleware";
import { decodeToken, generateToken } from "@/lib/tokenConfig";

const handleGetServerCategoryAndChannels = async (serverId) => {
    const server = await prisma.server.findFirst({
        where: {
            id: serverId,
        },
        include: {
            categories: {
                include: {
                    channels: {
                        orderBy: { order: "asc" }
                    }
                },
                orderBy: { order: "asc" }
            },
        },
    });
    return { success: true, server: JSON.parse(JSON.stringify(server)) };
}

export const getAllUserJoinedServer = async () => {
    try {
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "Please login to continue" }
        }
        const joinedServer = await prisma.user.findFirst({
            where: {
                id: user.id,
            },
            include: {
                serverProfiles: {
                    include: {
                        server: true,
                    },
                },
            },
        });
        return {
            success: true,
            joinedServer: JSON.parse(JSON.stringify(joinedServer.serverProfiles)),
        };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

//improvement needed
export const getServer = async (serverId) => {
    try {
        if (!serverId) {
            return { success: false, message: "Please provide a server id" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "Please login to continue" }
        }
        console.log(user)
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId,
                isDeleted: false,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                server: true,
            },
        });
        console.log(userServerProfile)
        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server" }
        }
        if (userServerProfile.server.ownerId == user.id) {
            return await handleGetServerCategoryAndChannels(serverId)
        }
        const isAdmin = userServerProfile.roles.some(
            (role) => role.role.adminPermission
        );
        if (isAdmin) {
            return await handleGetServerCategoryAndChannels(serverId)
        }
        const userServerRoles = userServerProfile.roles.map((role) => role.roleId);
        let server = await prisma.server.findFirst({
            where: {
                id: serverId,
            },
            include: {
                categories: {
                    include: {
                        channels: {
                            include: {
                                channelRoles: {
                                    where: {
                                        serverRoleId: {
                                            in: userServerRoles,
                                        },
                                    },
                                },
                                defaultChannelRole: true,
                            },
                            orderBy: { order: "asc" }
                        },
                        categoryRoles: {
                            where: {
                                serverRoleId: {
                                    in: userServerRoles,
                                },
                            },
                        },
                        defaultCategoryRole: true,
                    },
                    orderBy: { order: "asc" }
                },
            },
        });

        server.categories = server.categories.filter((category) => {
            category.channels = category.channels.filter((channel) => {
                if (channel.defaultChannelRole.viewChannel) {
                    return channel;
                }
                if (
                    channel.channelRoles.some((chanRole) =>
                        chanRole.viewChannel === "ALLOW" ||
                        (
                            chanRole.viewChannel === "NEUTRAL" &&
                            (
                                category.categoryRoles?.some((catRole) => catRole.serverRoleId == chanRole.serverRoleId)
                                    ? category.categoryRoles.some(
                                        (cateRole) =>
                                            cateRole.serverRoleId === chanRole.serverRoleId &&
                                            (
                                                cateRole.viewChannel === "ALLOW" ||
                                                (
                                                    cateRole.viewChannel === "NEUTRAL" &&
                                                    userServerProfile.roles.some(
                                                        (serRole) =>
                                                            serRole.roleId === chanRole.serverRoleId &&
                                                            serRole.role.viewChannel
                                                    )
                                                )
                                            )
                                    )
                                    : userServerProfile.roles.some(
                                        (serRole) =>
                                            serRole.roleId === chanRole.serverRoleId &&
                                            serRole.role.viewChannel
                                    )
                            )
                        )
                    )
                ) {
                    return channel;
                }
            });
            // if (category.channels != []) {
            //     return category.channels
            // }
            if (category.defaultCategoryRole.viewChannel) {
                return category.channels;
            }
            if (
                category.categoryRoles.some(
                    (catRol) =>
                        catRol.viewChannel == "ALLOW" ||
                        (catRol.viewChannel == "NEUTRAL" &&
                            userServerProfile.roles.find(
                                (role) =>
                                    role.role.viewChannel && role.roleId == catRol.serverRoleId
                            ))
                )
            ) {
                return category.channels;
            }
        });

        return { success: true, server: JSON.parse(JSON.stringify(server)) };
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
};

export const getChannel = async(channelId)=>{
    try {
        if(!channelId){
            return { success: false, message: "Channel ID is required" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "Please login to continue" }
        }
        const channel = await prisma.channel.findUnique({
            where:{
                id:channelId
            }
        })
        if(!channel){
            return { success: false, message: "Channel not found" }
        }
        return { success: true, channel: JSON.parse(JSON.stringify(channel)) };
    } catch (error) {
        console.log(error);
        throw new Error(`getChannel: ${error}`);
    }
}

export const serverSettingFetch = async (serverId) => {
    try {
        if (!serverId) {
            return { success: false, message: "Please provide a server id" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "Please login to continue" }
        }
        let serverSetting = await prisma.serverProfile.findFirst({
            where: {
                serverId: serverId,
                userId: user.id,
                isDeleted: false,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                server: true,
            }
        });
        if (!serverSetting) {
            return { success: false, message: "Server setting not found" }
        }
        if (serverSetting.server.ownerId == user.id) {
            return {
                success: true,
                serverSetting: JSON.parse(JSON.stringify(serverSetting)),
                user: JSON.parse(JSON.stringify(user)),
            };
        }
        serverSetting.roles = serverSetting.roles.sort(
            (a, b) => a.role.order - b.role.order
        );
        const isVerifiedToLook = serverSetting.roles.some(
            (role) => role.role.adminPermission || role.role.manageRoles
        );
        if (!isVerifiedToLook) {
            return {
                success: false,
                message: "You don't have permission to view this server",
            };
        }
        return {
            success: true,
            serverSetting: JSON.parse(JSON.stringify(serverSetting)),
            user: JSON.parse(JSON.stringify(user)),
        };
    } catch (error) {
        console.log(error);
        throw new Error(`serverSettingFetch: ${error}`);
    }
};

export const updateUserImage = async (formData) => {
    try {
        if (!formData) {
            return { success: false, message: "No image provided" }
        }
        const file = formData.get("file");
        if (!file) {
            return { success: false, message: "No image provided" }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "User not found" }
        }
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, message: "Invalid file type. Only PNG, JPG, and JPEG are allowed." }
        }

        const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSizeInBytes) {
            return { success: false, message: "File size exceeds the 1MB limit" }
        }
        const utapi = new UTApi();
        const response = await utapi.uploadFiles(file);
        if (!response) {
            return { success: false, message: "failed to upload the file" }
        }
        if (response.error) {
            return { success: false, message: response.error }
        }
        console.log(response)
        let img_url = response.data.url;
        console.log("Image URL:", img_url);
        const userUpdate = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                avatarUrl: img_url
            }
        })
        console.log(userUpdate)
        return { success: true, updateUserImage }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const checkChannelViewPermission = async (channelId, token = null) => {
    try {
        if (!channelId) {
            return { success: false, message: "Channel ID is required" }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "User not found" }
        }
        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId
            },
            select: {
                category: true,
                updatedAt:true
            }
        })
        if (!channel) {
            return { success: false, message: "Channel not found" }
        }
        let tokenData = null
        // if (token) {
        //     tokenData = decodeToken(token, channelId)
            // if (tokenData.valid && tokenData.data.userId == user.id) {
            //     if (tokenData.data.timestamp > channel.updatedAt) {
            //         const checkPermission = tokenData.data.permissions.admin || tokenData.data.permissions.viewChannel
            //         if (checkPermission) {
            //             await dbHelperTokenCreateMessage(channelId, user, serverId);
            //             return { success: true, message: "Message sent successfully." };
            //         }
            //     }
            // }
        // }
        const serverId = channel.category.serverId
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        })
        if (!userServerProfile) {
            return { success: false, message: "User not found in server" }
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            }
        })
        if (server.ownerId == user.id || userServerProfile.roles.some((role) => role.role.adminPermission)) {
            const newToken = await generateToken(channelId, user.id, { permission: { viewChannel: true } }, tokenData?.data)
            return { success: true, message: "You have permission to view this channel",token: { [channelId]: newToken } }
        }
        const userServerRoleIds = userServerProfile.roles.map((role) => role.roleId)
        const channelWithRoles = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                category: {
                    include: {
                        categoryRoles: {
                            where: { id: { in: userServerRoleIds } }
                        },
                        server: { include: { defaultServerRole: true } },
                        defaultCategoryRole: true
                    }
                },
                channelRoles: {
                    where: { id: { in: userServerRoleIds } },
                    include: { serverRole: true }
                },
                defaultChannelRole: true
            }
        });

        const checkPermission = checkViewChannelPermission(channelWithRoles)
        if (checkPermission) {
            const newToken = await generateToken(channelId, user.id, { permission: { viewChannel: true } }, tokenData?.data)
            return { success: true, message: "You have permission to view this channel",token: { [channelId]: newToken } }
        }

        return { success: false, message: "You do not have permission to view this channel" }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}



// helper functions

// Helper function to check view channel permissions
const checkViewChannelPermission = (channelWithRoles) => {
    // Check if the user has permission to send messages in the channel
    const hasPermission =
        channelWithRoles.defaultChannelRole.viewChannel === "ALLOW" ||
        (channelWithRoles.defaultChannelRole.viewChannel === "NEUTRAL" &&
            (channelWithRoles.category.defaultCategoryRole.viewChannel === "ALLOW" ||
                channelWithRoles.category.server.defaultServerRole.viewChannel));

    // Check if user has any custom channel role allowing sendMessage
    const hasCustomRolePermission = channelWithRoles.channelRoles.some(role => {
        if (role.viewChannel === "ALLOW") return true;
        if (role.viewChannel === "NEUTRAL") {
            const categoryRole = channelWithRoles.category.categoryRoles.find(
                categoryRole => categoryRole.serverRoleId === role.serverRoleId
            );
            if (categoryRole) {
                return categoryRole.viewChannel === "ALLOW" || (categoryRole.viewChannel === "NEUTRAL" && role.serverRole.viewChannel);
            }
        }
        return false;
    });

    return hasPermission || hasCustomRolePermission;
};