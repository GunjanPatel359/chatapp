"use server";

import { UTApi } from "uploadthing/server";
import prisma from "@/lib/db";
import { isAuthUser } from "@/lib/authMiddleware";

export const getAllUserJoinedServer = async () => {
    try {
        const user = await isAuthUser();
        if (!user) {
            throw new Error("Please login to continue");
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
            throw new Error("Please provide a server id");
        }
        const user = await isAuthUser();
        if (!user) {
            throw new Error("Please login to continue");
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
            throw new Error("You are not a member of this server");
        }
        if (userServerProfile.server.ownerId == user.id) {
            const server = await prisma.server.findFirst({
                where: {
                    id: serverId,
                },
                include: {
                    categories: {
                        include: {
                            channels: true,
                        },
                    },
                },
            });
            return { success: true, server: JSON.parse(JSON.stringify(server)) };
        }
        const isAdmin = userServerProfile.roles.some(
            (role) => role.role.adminPermission
        );
        if (isAdmin) {
            const server = await prisma.server.findFirst({
                where: {
                    id: serverId,
                },
                include: {
                    categories: {
                        include: {
                            channels: true,
                        },
                    },
                },
            });
            return { success: true, server: JSON.parse(JSON.stringify(server)) };
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

export const serverSettingFetch = async (serverId) => {
    try {
        if (!serverId) {
            throw new Error("Please provide a server id");
        }
        const user = await isAuthUser();
        if (!user) {
            throw new Error("Please login to continue");
        }
        let serverSetting = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    serverId: serverId,
                    userId: user.id,
                },
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
        if (!serverSetting) {
            throw new Error("Server setting not found");
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
            throw new Error('No image provided');
        }
        const file = formData.get("file");
        if (!file) {
            throw new Error('No image provided');
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error('User not found');
        }
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
        }

        const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSizeInBytes) {
            throw new Error("File size exceeds the 1MB limit.");
        }
        const utapi = new UTApi();
        const response = await utapi.uploadFiles(file);
        if (!response) {
            throw new Error("failed to upload the file")
        }
        if (response.error) {
            throw new Error(response.error)
        }
        console.log(response)
        let img_url = response.data.url;
        console.log("Image URL:", img_url);
        const userUpdate=await prisma.user.update({
            where: {
                id: user.id
            },
            data:{
                avatarUrl:img_url
            }
        })
        console.log(userUpdate)
        return {success:true,updateUserImage}
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}