"use server"

import { isAuthUser } from "@/lib/authMiddleware";
import prisma from "@/lib/db";

export const createChannel = async (serverId, categoryId, data) => {
    try {
        if (!serverId || !categoryId || !data.name || !data.description) {
            throw new Error('Server ID and Category ID are required')
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error('You must be logged in to create a channel')
        }
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId
                }
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
            throw new Error('You must be a member of the server to create a channel')
        }
        const isVerifyCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
                serverId
            }
        })
        if (!isVerifyCategory) {
            throw new Error('Category does not exist')
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            }
        })
        if (!server) {
            throw new Error('Server does not exist')
        }
        if (server.ownerId == user.id) {
            const createChannel = await prisma.channel.create({
                data: {
                    name: data.name,
                    description: data.description,
                    categoryId: categoryId,
                    type: data?.type || "TEXT",
                    defaultChannelRole: {
                        create: {}
                    }
                }
            })
            console.log(createChannel)
            return { success: true, message: "channel created successfully" }
        }
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission)
        if (isAdmin) {
            const createChannel = await prisma.channel.create({
                data: {
                    name: data.name,
                    description: data.description,
                    categoryId: categoryId,
                    type: data?.type || "TEXT",
                    defaultChannelRole: {
                        create: {}
                    }
                }
            })
            console.log(createChannel)
            return { success: true, message: "channel created successfully" }
        }
        const userServerProfileRoles = userServerProfile.roles.map((item) => item.roleId)
        console.log(userServerProfileRoles)
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId
            },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: userServerProfileRoles }, // Must be in user roles
                        manageChannels: { in: ["ALLOW", "NEUTRAL"] } // AND condition for permissions
                    },
                    include: {
                        serverRole: true
                    }
                }
            }
        });
        console.log(category.categoryRoles)
        if (!category || category.categoryRoles.length === 0) {
            throw new Error("You do not have permission to add roles");
        }
        const categoryRoles = category.categoryRoles.some((a) => a.manageChannels == "ALLOW" || (a.manageChannels == "NEUTRAL" && a.serverRole.manageChannels))
        console.log(categoryRoles)
        if (categoryRoles) {
            const createChannel = await prisma.channel.create({
                data: {
                    name: data.name,
                    description: data.description,
                    categoryId: categoryId,
                    type: data.type || "TEXT",
                    defaultChannelRole: {
                        create: {}
                    }
                }
            })
            console.log(createChannel)
            return { success: true, message: "channel created successfully" }
        }
        throw new Error("you do not have permission to create channel")
    } catch (error) {
        console.error("Error in create channel:", error);
        throw new Error(error.message || "Something went wrong");
    }
}

export const updateChannel = async (serverId, categoryId, channelId, data) => {
    try {
        if (!serverId || !categoryId || !channelId || !data.name || !data.description) {
            throw new Error("Please provide all the required fields");
        }
        const user = await isAuthUser()
        if (user) {
            throw new Error("you are not logged in")
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId
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
            throw new Error("You are not a member of this server")
        }
        const verifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                categoryId: categoryId,
            }
        })
        if (!verifyChannel) {
            throw new Error("Channel not found")
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId,
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            }
        })
        if (!server) {
            throw new Error("Server with this category not found")
        }
        if (server.ownerId == user.id) {
            const updateChannel = await prisma.channel.update({
                where: {
                    id: channelId,
                },
                data: {
                    name: data.name,
                    description: data.description
                }
            })
            console.log(updateChannel)
            return { success: true, message: "channel updated successfully" }
        }
        if (userServerProfile.roles.length == 0) {
            throw new Error("you do not have any role")
        }
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission)
        if (isAdmin) {
            const updateChannel = await prisma.channel.update({
                where: {
                    id: channelId
                },
                data: {
                    name: data.name,
                    description: data.description

                }
            })
            console.log(updateChannel)
            return { success: true, message: "channel updated successfully" }
        }
        const userServerProfileRoles = userServerProfile.roles.map((item) => item.roleId)
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId
            },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: {
                            in: userServerProfileRoles
                        },
                        manageChannels: {
                            in: ["ALLOW", "NEUTRAL"],
                        }
                    },
                    include: {
                        serverRole: true
                    }
                }
            }
        })
        if (!category || category.categoryRoles.length === 0) {
            throw new Error("You do not have permission to add roles");
        }
        const categoryRoles = category.categoryRoles.some((a) => a.manageChannels == "ALLOW" || (a.manageChannels == "NEUTRAL" && a.serverRole.manageChannels))
        if (categoryRoles) {
            const updateChannel = await prisma.channel.update({
                where: {
                    id: channelId
                },
                data: {
                    name: data.name,
                    description: data.description

                }
            })
            console.log(updateChannel)
            return { success: true, message: "channel updated successfully" }
        }
        throw new Error("you do not have permission to update the channel")
    } catch (error) {
        console.error("Error in update channel:", error);
        throw new Error(error.message || "Something went wrong");
    }
}

export const deleteChannel = async (serverId, categoryId, channelId) => {
    try {
        if (!serverId || !categoryId || !channelId) {
            throw new Error("Please provide all the required fields");
        }
        const user = await isAuthUser()
        if (user) {
            throw new Error("you are not logged in")
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId
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
            throw new Error("You are not a member of this server")
        }
        const verifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                categoryId: categoryId,
            }
        })
        if (!verifyChannel) {
            throw new Error("Channel not found")
        }
        const server = await prisma.server.findFirst({
            where: {
                id: serverId,
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            }
        })
        if (!server) {
            throw new Error("Server with this category not found")
        }
        if (server.ownerId == user.id) {
            const deleteChannel=await prisma.channel.delete({
                where: {
                    id: channelId
                }
            })
            console.log(deleteChannel)
            return {success:true,message:"channel deleted successfully"}
        }
        if (userServerProfile.roles.length == 0) {
            throw new Error("you do not have any role")
        }
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission)
        if (isAdmin) {
            const deleteChannel=await prisma.channel.delete({
                where: {
                    id: channelId
                }
            })
            console.log(deleteChannel)
            return {success:true,message:"channel deleted successfully"}
        }
        const userServerProfileRoles = userServerProfile.roles.map((item) => item.roleId)
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId
            },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: {
                            in: userServerProfileRoles
                        },
                        manageChannels: {
                            in: ["ALLOW", "NEUTRAL"],
                        }
                    },
                    include: {
                        serverRole: true
                    }
                }
            }
        })
        if (!category || category.categoryRoles.length === 0) {
            throw new Error("You do not have permission to add roles");
        }
        const categoryRoles = category.categoryRoles.some((a) => a.manageChannels == "ALLOW" || (a.manageChannels == "NEUTRAL" && a.serverRole.manageChannels))
        if (categoryRoles) {
            const deleteChannel=await prisma.channel.delete({
                where: {
                    id: channelId
                }
            })
            console.log(deleteChannel)
            return {success:true,message:"channel deleted successfully"}
        }
        throw new Error("you do not have permission to update the channel")
    } catch (error) {
        console.error("Error in delete channel:", error);
        throw new Error(error.message || "Something went wrong");
    }
}