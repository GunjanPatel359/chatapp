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

        let img_url;

        // Check if formData exists and process the file upload
        if (formData) {
            const file = formData.get("file");

            if (file) {
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
                if(!response){
                    throw new Error("failed to upload the file")
                }
                if(response.error){
                    throw new Error(response.error)
                }
                console.log(response)
                img_url = response.data.url;
                console.log("Image URL:", img_url);
            }
        }

        // Check if the user is authenticated
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "Please login to continue" };
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
                            create: categories.map(category => ({
                                name: category.name.toUpperCase(),
                                channels: category.channels?.length > 0
                                    ? {
                                        create: category.channels.map(channel => ({
                                            name: channel.name.toLowerCase(),
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
                    userId: user.id,
                    serverId: createdServer.id
                },
            });

            return createdServer;
        });

        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Error occurred during server creation" };
    }
};
