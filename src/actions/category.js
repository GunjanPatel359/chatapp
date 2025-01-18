"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

//test needed
export const createCategory = async (serverId, categoryData) => {
    try {
        if (!serverId) {
            throw new Error("please provide server ID")
        }
        if (!categoryData && !categoryData?.name) {
            throw new Error("please provide category data")
        }
        const user = await isAuthUser()
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
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
        if (!userServerProfile) throw new Error("you don't have permission to create a category")
        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                serverProfiles: {
                    some: {
                        id: userServerProfile.id
                    }
                }
            }
        })
        if (server.ownerId == user.id) {
            const category = await prisma.category.create({
                data: {
                    name: categoryData.name,
                    serverId
                }
            })
            console.log(category)
            return { success: true, message: "category created successfully" }
        }
        if (userServerProfile.roles?.length == 0) {
            throw new Error("you don't have permission to create a category")
        }
        const firstMatchingRole = userServerProfile.roles.find(role => role.role.adminPermission || role.role.manageChannels);
        if (firstMatchingRole == undefined) {
            throw new Error("you don't have permission to create a category")
        }
        const category = await prisma.category.create({
            data: {
                name: categoryData.name,
            }
        })
        console.log(category)
        return { success: true, message: "category created successfully" }
    } catch (error) {
        console.log(error)
        throw new Error("createCategory", error)
    }
}

