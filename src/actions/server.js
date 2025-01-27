"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

export const createServer = async (name, description, categories) => {
    try {
        if (!name || !description) {
            return { success: false, message: "name and description is required" }
        }

        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "Please login to continue" }
        }

        const server = await prisma.$transaction(async (prisma) => {
            // Create the server
            const createdServer = await prisma.server.create({
                data: {
                    name,
                    description,
                    ownerId: user.id,
                    categories: categories.length > 0
                        ? {
                            create: categories.map(category => ({
                                name: category.name.toUpperCase(),
                                channels: category.channels?.length > 0
                                    ? {
                                        create: category.channels.map(channel => ({
                                            name: channel.name.toLowerCase(),
                                            description:`${channel.name}`,
                                            type: "TEXT", // Ensure you pass the correct type
                                            defaultChannelRole: {
                                                create: {}
                                            }
                                        })),
                                    }
                                    : undefined,
                                defaultCategoryRole: {
                                    create: {} // This ensures a default category role is created
                                }
                            })),
                        }
                        : undefined,
                    defaultServerRole: {
                        create: {}
                    }
                },
            });

            // Create a server profile for the user
            await prisma.serverProfile.create({
                data: {
                    userId: user.id,
                    serverId: createdServer.id
                },
            });

            return createdServer;
        });

        return { success: true }
    } catch (error) {
        throw new Error(error)
    }
}