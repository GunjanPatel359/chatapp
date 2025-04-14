"use server"

import { isAuthUser } from "@/lib/authMiddleware";
import prisma from "@/lib/db"

function convertToDays(duration){
    const timeUnit = duration.slice(-1); // Last character (m, h, d)
    const value = parseInt(duration.slice(0, -1), 10); // Numeric part
  
    switch (timeUnit) {
      case 'm': // minutes
        return value / (24 * 60);
      case 'h': // hours
        return value / 24;
      case 'd': // days
        return value;
      default:
        throw new Error('Invalid time format');
    }
  }
  

//temp invite inspection needed
export const createInvite = async (serverId,expire=null,limit=null) => {
    try {
        if (!serverId) {
            return { success: false, message: "Server ID is required" };
        }
        convertToDays(expire);
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You must be logged in to create an invite" };
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                serverId: serverId,
                userId: user.id
            },
            include: {
                server: {
                    include:{
                        defaultServerRole:true
                    }
                },
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        })

        if (userServerProfile.inviteOn == false) {
            return { success: false, message: "Invite is disabled for this server" };
        }

        if (userServerProfile.server.ownerId == user.id || userServerProfile.roles.some((role) => role.role.adminPermission)) {
            const invite = await prisma.invites.create({
                data: {
                  server: {
                    connect: { id: serverId },
                  },
                  serverProfile: {
                    connect: { id: userServerProfile.id },
                  },
                  inviteString: `${Math.random().toString(36).substring(2, 10)}-${Date.now()}`,
                  expiresAt: expire
                    ? new Date(Date.now() + convertToDays(expire) * 24 * 60 * 60 * 1000)
                    : new Date('9999-12-31T23:59:59.999Z'),
                  limitMember: limit === 'no-limit' ? 90000 : parseInt(limit, 10),
                },
              });
              
            console.log(invite)
            return { success: true, message: "Invite created successfully", invite: invite }
        }
        if(userServerProfile.server.defaultServerRole.createInvite){
            const invite = await prisma.invites.create({
                data: {
                  server: {
                    connect: { id: serverId },
                  },
                  serverProfile: {
                    connect: { id: userServerProfile.id },
                  },
                  inviteString: `${Math.random().toString(36).substring(2, 10)}-${Date.now()}`,
                  expiresAt: expire
                    ? new Date(Date.now() + convertToDays(expire) * 24 * 60 * 60 * 1000)
                    : new Date('9999-12-31T23:59:59.999Z'),
                  limitMember: limit === 'no-limit' ? 90000 : parseInt(limit, 10),
                },
              });
            console.log(invite)
            return { success: true, message: "Invite created successfully", invite: invite }
        }

        if(userServerProfile.roles.some((role)=>role.role.createInvite)){
            const invite = await prisma.invites.create({
                data: {
                  server: {
                    connect: { id: serverId },
                  },
                  serverProfile: {
                    connect: { id: userServerProfile.id },
                  },
                  inviteString: `${Math.random().toString(36).substring(2, 10)}-${Date.now()}`,
                  expiresAt: expire
                    ? new Date(Date.now() + convertToDays(expire) * 24 * 60 * 60 * 1000)
                    : new Date('9999-12-31T23:59:59.999Z'),
                  limitMember: limit === 'no-limit' ? 90000 : parseInt(limit, 10),
                },
              });
            console.log(invite)
            return { success: true, message: "Invite created successfully", invite: invite }
        }
        
        return { success: false, message: "You do not have permission to create an invite"}
    } catch (error) {
        console.error("Error in inviteServer:", error);
        return { success: false, message: `createInvite: ${error.message || "Something went wrong"}` };
    }
}

export const serverInviteInfo = async(serverId)=>{
    try {
        if(!serverId){
            return { success: false, message: "Server ID is required" }
        }
        const user=await isAuthUser()
        if(!user){
            return { success: false, message: "You are not logged in" }
        }
        const userServerProfile=await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId
            },
            include:{
                server:true,
                roles: {
                    include:{
                        role: true
                    }
                }
            }
        })
        if(user.id==userServerProfile.server.ownerId || userServerProfile.roles.some((role)=>role.role.adminPermission)){
            const invites=await prisma.invites.findMany({
                where: {
                    serverId: serverId
                },
                include:{
                    serverProfile:{
                        include:{
                            user:{
                                select:{
                                    username:true
                                }
                            }
                        }
                    }
                }
            })
            return { success: true, message: "Invite info", invites }
        }
        return { success: false, message: "You do not have permission to view invite info" }

    } catch (error) {
        console.error("Error in inviteServer:", error);
        return { success: false, message: `createInvite: ${error.message || "Something went wrong"}` };
    }
}

export const joinServer = async (invitestring) => {
    try {
        // Check if the invite string is provided
        if (!invitestring) {
            return { success: false, message: "Invalid invite string" };
        }

        // Check if the user is authenticated
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You must be logged in to join a server" };
        }

        // Fetch the invite from the database
        const invite = await prisma.invites.findFirst({
            where: {
                inviteString: invitestring,
                inviteOn: true,  // Only check for active invites
            },
        });

        // If the invite doesn't exist or is invalid
        if (!invite) {
            return { success: false, message: "Invalid invite string" };
        }

        // Check if the invite has expired
        if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
            return { success: false, message: "This invite has expired" };
        }

        // Check if the invite has exceeded its usage limit
        if (invite.currentCount >= invite.limitMember) {
            return { success: false, message: "This invite has reached its maximum usage limit" };
        }

        // Get the serverId from the invite
        const serverId = invite.serverId;

        // Check if the user is already a member of the server
        const userProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: serverId,
            },
        });

        if (userProfile) {
            return { success: false, message: "You are already a member of this server" };
        }

        // If no issues, proceed to add the user to the server (you can insert this logic based on your schema)
        // For example, creating a new server profile for the user
        await prisma.serverProfile.create({
            data: {
                bannerUrl:user.bannerUrl || "",
                imageUrl:user.avatarUrl || "",
                description:user.description || "",
                name:user.username,
                pronoun:user.pronoun || "",
                userId: user.id,
                serverId: serverId,
            },
        });

        // Update the invite's usage count
        await prisma.invites.update({
            where: { id: invite.id },
            data: { currentCount: invite.currentCount + 1 },
        });

        return { success: true, message: "You have successfully joined the server!" };

    } catch (error) {
        console.error("Error in joinServer:", error);
        return { success: false, message: `joinServer: ${error.message || "Something went wrong"}` };
    }
};


export const inviteServer = async (serverId, userId) => {
    try {
        // Check if serverId and userId are provided
        if (!serverId || !userId) {
            return { success: false, message: "Please provide serverId and userId" };
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Check if user is already part of the server
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    serverId: serverId,
                    userId: userId,
                },
                isDeleted: false
            }
        });

        if (userServerProfile) {
            return { success: false, message: "User is already in the server" };
        }

        // Add user to the server
        const newProfile = await prisma.serverProfile.create({
            data: {
                serverId: serverId,
                userId: userId,
                name: user.username,
                imageUrl: user?.avatarUrl || null
            }
        });

        if (!newProfile) {
            return { success: false, message: "Failed to create server profile" };
        }

        return { success: true, message: "User successfully joined the server" };

    } catch (error) {
        console.error("Error in inviteServer:", error);
        return { success: false, message: `inviteServer: ${error.message || "Something went wrong"}` };
    }
};
