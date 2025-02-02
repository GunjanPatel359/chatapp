"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

export const sendMessage = async (serverId, channelId, content) => {
    try {
        if (!serverId || !channelId || !content) {
            throw new Error("channelId is not defined")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("User is not authenticated")
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
            throw new Error("User is not in the server")
        }
        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                category: {
                    serverId: serverId
                }
            },
            include: {
                category: {
                    include: {
                        server: true
                    }
                }
            }
        })
        if (!channel) {
            throw new Error("Channel is not found")
        }
        if (!channel.category.server.ownerId == user.id) {
            const sendMessage = await prisma.channelMessage.create({
                data: {
                    channelId: channelId,
                    content: content,
                    serverProfileId: userServerProfile.id
                }
            })
            console.log(sendMessage)
            return { success: true, message: "message created successfully" }
        }
        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission)
        if (isAdmin) {
            const sendMessage = await prisma.channelMessage.create({
                data: {
                    channelId: channelId,
                    content: content,
                    serverProfileId: userServerProfile.id
                }
            })
            console.log(sendMessage)
            return { success: true, message: "message created successfully" }
        }
        const userServerRoleId = userServerProfile.roles.map((role) => role.id);

        const channelP = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                category: {
                    include: {
                        categoryRoles: {
                            where: {
                                id: { in: userServerRoleId }
                            },
                        },
                        server: {
                            include: {
                                defaultServerRole: true
                            }
                        },
                        defaultCategoryRole: true
                    }
                },
                channelRoles: {
                    where: {
                        id: { in: userServerRoleId }
                    },
                    include: {
                        serverRole: true
                    }
                },
                defaultChannelRole: true,
            }
        });
        if (channelP.defaultChannelRole.sendMessage == "ALLOW" || (channelP.defaultChannelRole.sendMessage == "NEUTRAL" && (channelP.category.defaultCategoryRole.sendMessage == "ALLOW" || (channelP.category.server.defaultServerRole.sendMessage)))) {
            const sendMessage = await prisma.channelMessage.create({
                data: {
                    channelId: channelId,
                    content: content,
                    serverProfileId: userServerProfile.id
                }
            })
            console.log(sendMessage)
            return { success: true, message: "message created successfully" }
        }
        const verify = channelP.channelRoles.some((role) =>{
            if(role.viewChannel == "ALLOW"){
                return true
            }
            if(role.viewChannel == "NEUTRAL"){
                const temp=channelP.category.categoryRoles.find((cateRole)=>cateRole.serverRoleId==role.serverRoleId)
                if(temp){
                    if(temp.viewChannel=="ALLOW" || (temp.viewChannel=="NEUTRAL" && role.serverRole.viewChannel)){
                        return true
                    }
                }else{
                    if(role.serverRole.viewChannel){
                        return true
                    }
                }
            }
        })
        if(verify){
            const sendMessage = await prisma.channelMessage.create({
                data: {
                    channelId: channelId,
                    content: content,
                    serverProfileId: userServerProfile.id
                }
            })
            console.log(sendMessage)
            return { success: true, message: "message created successfully" }
        }
        throw new Error("you do not have permission to send message")
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}
