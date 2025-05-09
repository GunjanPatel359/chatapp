"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"
import { decodeToken, generateToken } from "@/lib/tokenConfig"
import {webSocketServer} from "@/server"

//trial 
export const fetchMessagesTrial = async (serverId,channelId, cursor = null,token=null) => {
    try {
        if(!channelId){
            return {success:false,message:"channelId not provided"}
        }
        const user = await isAuthUser();
        if (!user) {
            throw new Error("User is not authenticated.");
        }

        // Check if the channel exists
        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                category: { serverId }
            },
            include: {
                category: { include: { server: true } }
            }
        });

        if (!channel) {
            throw new Error("Channel not found.");
        }

        let tokenData = null
        if (token) {
            tokenData = decodeToken(token, channelId)
            if (tokenData.valid && tokenData.data.userId == user.id) {
                if (tokenData.data.timestamp > channel.updatedAt) {
                    const checkPermission = tokenData.data.permissions.admin || tokenData.data.permissions.seemessageHistory
                    if (checkPermission) {
                        const {messages,newCursor}=await dbHelperFetchMessage(channelId,cursor);
                        return { success: true,messages,cursor:newCursor};
                    }
                }
            }
        }

        // Fetch user's server profile
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
            throw new Error("User is not a member of this server.");
        }

        // If the user is the owner of the server or has admin permissions, allow sending the message
        if (channel.category.server.ownerId === user.id || userServerProfile.roles.some(role => role.role.adminPermission)) {
            const {messages,newCursor}=await dbHelperFetchMessage(channelId,cursor);
            const newToken = await generateToken(channelId, user.id, { permission: { admin: true } }, tokenData?.data || null)
            return { success: true,messages,cursor:newCursor, token: { [channelId]: newToken } };
        }

        // Check channel, category, and server roles for sending messages
        const userServerRoleIds = userServerProfile.roles.map(role => role.id);
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

        // Permission check for sending messages
        const hasSeeMessageHistoryPermission = checkSeeMessageHistoryPermission(channelWithRoles);

        if (hasSeeMessageHistoryPermission) {
            const {messages,newCursor}=await dbHelperFetchMessage(channelId,cursor);
            const newToken = await generateToken(channelId, user.id, { permission: { seemessageHistory: true } }, tokenData?.data || null)
            return { success: true,messages,cursor:newCursor, token: { [channelId]: newToken } };
        }

        // If no permissions match, deny sending the message
        throw new Error("You do not have permission see old message");
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { success: false, error: error.message };
    }
};

export const sendMessage = async (serverId, channelId, content, token = null) => {
    try {

        // Validate inputs
        if (!serverId || !channelId || !content.trim()) {
            throw new Error("Please provide all required fields.");
        }

        // Check if the user is authenticated
        const user = await isAuthUser();
        if (!user) {
            throw new Error("User is not authenticated.");
        }

        // Check if the channel exists
        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                category: { serverId }
            },
            include: {
                category: { include: { server: true } }
            }
        });

        if (!channel) {
            throw new Error("Channel not found.");
        }

        let tokenData = null
        if (token) {
            tokenData = decodeToken(token, channelId)
            if (tokenData.valid && tokenData.data.userId == user.id) {
                if (tokenData.data.timestamp > channel.updatedAt) {
                    const checkPermission = tokenData.data.permissions.admin || tokenData.data.permissions.sendMessage
                    if (checkPermission) {
                        await dbHelperTokenCreateMessage(channelId, content, user, serverId);
                        return { success: true, message: "Message sent successfully." };
                    }
                }
            }
        }

        // Fetch user's server profile
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
            throw new Error("User is not a member of this server.");
        }


        // If the user is the owner of the server or has admin permissions, allow sending the message
        if (channel.category.server.ownerId === user.id || userServerProfile.roles.some(role => role.role.adminPermission)) {
            await dbHelperCreateMessage(channelId, content.trim(), userServerProfile.id);
            const newToken = await generateToken(channelId, user.id, { permission: { admin: true } }, tokenData?.data || null)
            return { success: true, message: "Message sent successfully.", token: { [channelId]: newToken } };
        }

        // Check channel, category, and server roles for sending messages
        const userServerRoleIds = userServerProfile.roles.map(role => role.id);
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

        // Permission check for sending messages
        const hasSendMessagePermission = checkSendMessagePermission(channelWithRoles);
        if (hasSendMessagePermission) {
            await dbHelperCreateMessage(channelId, content.trim(), userServerProfile.id);
            const newToken = await generateToken(channelId, user.id, { permission: { sendMessage: true } }, tokenData?.data)
            return { success: true, message: "Message sent successfully.", token: { [channelId]: newToken } };
        }

        // If no permissions match, deny sending the message
        throw new Error("You do not have permission to send a message in this channel.");
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error(error.message || "Something went wrong while sending the message.");
    }
};


// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"

// db helper functions


// Helper function to see message history
const dbHelperFetchMessage=async(channelId,cursor=null)=>{
    try {
        // const limit = 20;
        let whereClause = { channelId };

        if (cursor) {
            whereClause.id = { lt: cursor }; // Fetch older messages
        }

        const messages = await prisma.channelMessage.findMany({
            where: whereClause,
            orderBy: { timestamp: "desc" },
            take: 20,
        });
        
        // Manually fetch related `serverProfile` data
        const serverProfileIds = messages.map(msg => msg.serverProfileId);
        
        const serverProfiles = await prisma.serverProfile.findMany({
            where: { id: { in: serverProfileIds } }
        });
        
        // Map `serverProfile` data to messages
        const messagesWithProfiles = messages.map(msg => ({
            ...msg,
            serverProfile: serverProfiles.find(sp => sp.id === msg.serverProfileId) || null
        }));

        const newCursor = messages.length > 0 ? messages[messages.length - 1].id : null;
        return { success: true, messages:messagesWithProfiles, newCursor };
    } catch (error) {
        console.error("Error seeing message history:", error);
        throw new Error("Error seeing message history.");
    }
}

// Helper function to create the message
const dbHelperCreateMessage = async (channelId, content, serverProfileId) => {
    try {
        const sendMessage = await prisma.channelMessage.create({
            data: {
                channelId,
                content,
                serverProfileId
            }
        });
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: { id: sendMessage.serverProfileId }
        });
        console.log(sendMessage,userServerProfile)
        sendMessage.serverProfile=userServerProfile
        console.log(sendMessage)
        console.log("Message created:", sendMessage);
        const response = await fetch(`${webSocketServer}/send-message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ channelId, message:sendMessage }),
          });
          console.log(response)
        // const io = getIo();
        // io.of("/channel").to(channelId).emit("message", sendMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Error creating message.");
    }
};


//token based function
const dbHelperTokenCreateMessage = async (channelId, content, user, serverId) => {
    try {
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            }
        });
        if (!userServerProfile) {
            throw new Error("User is not a member of this server.");
        }
        const sendMessage = await prisma.channelMessage.create({
            data: {
                channelId,
                content,
                serverProfileId: userServerProfile.id
            }
        });
        sendMessage.serverProfile=userServerProfile
        console.log("Message created with help of token:", sendMessage);
        const response = await fetch(`${process.env.WEB_SOCKET_SERVER}/send-message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ channelId, message:sendMessage }),
          });
          console.log(response)
        // const io = getIo();
        // io.of("/channel").to(channelId).emit("message", sendMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Error creating message.");
    }
}

// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"




// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"

// helper functions

// Helper function to check send message permissions
const checkSendMessagePermission = (channelWithRoles) => {
    // Check if the user has permission to send messages in the channel
    const hasPermission =
        channelWithRoles.defaultChannelRole.sendMessage === "ALLOW" ||
        (channelWithRoles.defaultChannelRole.sendMessage === "NEUTRAL" &&
            (channelWithRoles.category.defaultCategoryRole.sendMessage === "ALLOW" ||
                channelWithRoles.category.server.defaultServerRole.sendMessage));

    // Check if user has any custom channel role allowing sendMessage
    const hasCustomRolePermission = channelWithRoles.channelRoles.some(role => {
        if (role.sendMessage === "ALLOW") return true;
        if (role.sendMessage === "NEUTRAL") {
            const categoryRole = channelWithRoles.category.categoryRoles.find(
                categoryRole => categoryRole.serverRoleId === role.serverRoleId
            );
            if (categoryRole) {
                return categoryRole.sendMessage === "ALLOW" || (categoryRole.sendMessage === "NEUTRAL" && role.serverRole.sendMessage);
            }
        }
        return false;
    });

    return hasPermission || hasCustomRolePermission;
};
const checkSeeMessageHistoryPermission = (channelWithRoles) => {
    // Check if the user has permission to send messages in the channel
    const hasPermission =
        channelWithRoles.defaultChannelRole.seemessageHistory === "ALLOW" ||
        (channelWithRoles.defaultChannelRole.seemessageHistory === "NEUTRAL" &&
            (channelWithRoles.category.defaultCategoryRole.seemessageHistory === "ALLOW" ||
                channelWithRoles.category.server.defaultServerRole.seemessageHistory));

    // Check if user has any custom channel role allowing sendMessage
    const hasCustomRolePermission = channelWithRoles.channelRoles.some(role => {
        if (role.seemessageHistory === "ALLOW") return true;
        if (role.seemessageHistory === "NEUTRAL") {
            const categoryRole = channelWithRoles.category.categoryRoles.find(
                categoryRole => categoryRole.serverRoleId === role.serverRoleId
            );
            if (categoryRole) {
                return categoryRole.seemessageHistory === "ALLOW" || (categoryRole.seemessageHistory === "NEUTRAL" && role.serverRole.seemessageHistory);
            }
        }
        return false;
    });

    return hasPermission || hasCustomRolePermission;
};

// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"
// "*****************************************************************"