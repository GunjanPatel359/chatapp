"use server"

import prisma from "@/lib/db"

//temp invite inspection needed
export const inviteServer = async (serverId, userId) => {
    try {
        // Check if serverId and userId are provided
        if (!serverId || !userId) {
            return { success: false, message: "Please provide serverId and userId" };
        }

        const user=await prisma.user.findUnique({
            where: {
                id:userId
            }
        })

        if(!user){
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
                name:user.username,
                imageUrl:user?.avatarUrl || null 
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
