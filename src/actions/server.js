"use server"

import { UTApi } from "uploadthing/server";
import { isAuthUser } from "@/lib/authMiddleware";
import prisma from "@/lib/db";

export const createServer = async (name, description, categories, formData) => {
    try {
        console.log("hi")
        if (!name || !description) {
            return { success: false, message: "name and description are required" };
        }

        // Check if the user is authenticated
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "Please login to continue" };
        }

        let img_url;

        // Check if formData exists and process the file upload
        if (formData) {
            const file = formData.get("file");

            if (file) {
                const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                if (!allowedTypes.includes(file.type)) {
                    return { success: false, message: "Invalid file type. Only PNG, JPG, and JPEG are allowed." }
                }

                const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
                if (file.size > maxSizeInBytes) {
                    return { success: false, message: "File size exceeds the 1MB limit." }
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
                img_url = response.data.url;
                console.log("Image URL:", img_url);
            }
        }


        // Create the server in the database
        const server = await prisma.$transaction(async (prisma) => {
            const createdServer = await prisma.server.create({
                data: {
                    name,
                    imageUrl: img_url || "", // Store the uploaded image URL if available
                    description,
                    ownerId: user.id,
                    categories: categories.length > 0
                        ? {
                            create: categories.map((category, index) => ({
                                name: category.name.toUpperCase(),
                                order: index,
                                channels: category.channels?.length > 0
                                    ? {
                                        create: category.channels.map((channel, i) => ({
                                            name: channel.name.toLowerCase(),
                                            order: i,
                                            description: `${channel.name}`,
                                            type: "TEXT", // Ensure the correct type
                                            defaultChannelRole: {
                                                create: {}
                                            }
                                        }))
                                    }
                                    : undefined,
                                defaultCategoryRole: {
                                    create: {} // Default category role
                                }
                            })),
                        }
                        : undefined,
                    defaultServerRole: {
                        create: {}
                    }
                },
            });

            // Create the server profile for the user
            await prisma.serverProfile.create({
                data: {
                    name:user.username,
                    userId: user.id,
                    serverId: createdServer.id
                },
            });

            return createdServer;
        });

        return { success: true };

    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Error occurred during server creation")
    }
};

export const updateServerAvatar = async (serverId, formData) => {
    try {
        if (!formData || !serverId) {
            return { success: false, message: "provide image file" }
        }
        const file = formData.get("file");
        if (!file) {
            return { success: false, message: "provide image file" }
        }
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, message: "Invalid file type. Only PNG, JPG, and JPEG are allowed." }
        }
        const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSizeInBytes) {
            return { success: false, message: "File size exceeds the 1MB limit." }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "Please login to continue" };
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            }
        })
        if (!server) {
            return { success: false, message: "Server not found" };
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId,
                isDeleted: false
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
            return { success: false, message: "You are not a member of this server" };
        }
        const hasPermission = userServerProfile.roles.some((a) => a.role.adminPermission);
        if (server.ownerId !== user.id && !hasPermission) { // Fix: Corrected permission check
            return { success: false, message: "You do not have permission to update the server avatar." };
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
        img_url = response.data.url;
        console.log("Image URL:", img_url);
        if (server.imageUrl) {
            await utapi.deleteFiles(server.imageUrl)
        }
        const updatedServer = await prisma.server.update({
            where: {
                id: serverId
            },
            data: {
                imageUrl: img_url
            }
        })
        return { success: true, message: "Server avatar updated successfully", img_url };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Error occurred updateServerAvatar")
    }
}

export const getCategories = async (serverId) => {
    try {
        if (!serverId) {
            return { success: false, message: "serverId is not provided" }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "User is not authenticated" }
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId,
                isDeleted: false
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
            return { success: false, message: "User is not a member of the server" }
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            },
            include: {
                categories: {
                    orderBy: { order: "asc" }
                },
            }
        })
        if (!server) {
            return { success: false, message: "Server not found" }
        }
        if (server.ownerId == user.id || userServerProfile.roles.some((role) => role.role.adminPermission)) {
            return { success: true, categories: JSON.parse(JSON.stringify(server.categories)) }
        }
        return { success: false, message: "you do not have permission" }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const updateServerInfo = async (serverId, name, description) => {
    try {
        if (!name || !description) {
            return { success: false, message: "name and description are required" }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "User is not authenticated" }
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId,
                isDeleted: false
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
            return { success: false, message: "User is not a member of the server" }
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            }
        })
        if (!server) {
            return { success: false, message: "Server not found" }
        }
        const hasPermission = userServerProfile.roles.some((a) => a.role.adminPermission)
        if (!server.ownerId == user.id && !hasPermission) {
            return { success: false, message: "you do not have permission" }
        }
        const updatedServer = await prisma.server.update({
            where: {
                id: serverId
            },
            data: {
                name: name,
                description: description
            }
        })
        return { success: true, message: "Server updated successfully" }
    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Error occurred updateServerInfo")
    }
}

export const serverJoinedMembersList=async(serverId)=>{
    try {
        if (!serverId) {
            return { success: false, message: "serverId is required" }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "User is not authenticated" }
        } 
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId,
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                },
                server:true
            }
        })
        if (!userServerProfile) {
            return { success: false, message: "User is not a member of the server" }
        }
        if(userServerProfile.server.ownerId==user.id || userServerProfile.roles.some((role)=>role.role.adminPermission||role.role.manageRoles)){
            const members=await prisma.serverProfile.findMany({
                where: { serverId: serverId, isDeleted: false }, 
                include: { 
                    user: true,
                    roles:{
                        include:{
                            role:true,
                        },
                        orderBy:{
                            role:{
                                order:"asc"
                            }
                        }
                    }
                }
            })
            return { success: true, members: members };
        }
        return { success: false, message: "You do not have permission to view the members list" }
    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Error occurred serverJoinedMembersList")
    }
}