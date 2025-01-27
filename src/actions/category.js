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
                    serverId,
                    defaultCategoryRole:{
                        create:{}
                    }
                },
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
                serverId,
                defaultCategoryRole:{
                    create:{}
                }
            }
        })
        console.log(category)
        return { success: true, message: "category created successfully" }
    } catch (error) {
        console.log(error)
        throw new Error("createCategory", error)
    }
}

// in test
export const updateCategory = async (serverId,categoryId,update)=>{
    try {
        if(!serverId || !categoryId || !update.name){
            throw new Error("serverId and categoryId are required")
        }
        const user=await isAuthUser()
        if(!user){
            throw new Error("you are not logged in")
        }
        const userServerProfile=await prisma.serverProfile.findUnique({
            where:{
                userId_serverId:{
                    userId:user.id,
                    serverId
                }
            },
            include:{
                server:true,
                roles:{
                    include:{
                        role:true
                    }
                }
            }
        })
        if(!userServerProfile){
            throw new Error("you are not a member of this server")
        }
        const verifyCategory=await prisma.category.findUnique({
            where:{
                id:categoryId,
                serverId
            }
        })
        if(!verifyCategory){
            throw new Error("category not found")
        }
        if(userServerProfile.server.ownerId==user.id){
            const updateCategory=await prisma.category.update({
                where:{
                    id:categoryId
                },
                data:{
                    name:update.name
                }
            })
            console.log(updateCategory)
            return {success:true,message:"category updated successfully"}
        }
        const isUserVerify=userServerProfile.roles.some((item)=>item.role.adminPermission)
        if(!isUserVerify){
            throw new Error("you dont have permission to delete this category")
        }
        const updateCategory=await prisma.category.delete({
            where:{
                id:categoryId
            }
        })
        console.log(updateCategory)
        return {success:true,message:"category updated successfully"}
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const deleteCategory = async (serverId, categoryId) => {
    try {
        if(!serverId || !categoryId){
            throw new Error("serverId and categoryId are required")
        }
        const user=await isAuthUser()
        if(!user){
            throw new Error("you are not logged in")
        }
        const userServerProfile=await prisma.serverProfile.findUnique({
            where:{
                userId_serverId:{
                    userId:user.id,
                    serverId
                }
            },
            include:{
                server:true,
                roles:{
                    include:{
                        role:true
                    }
                }
            }
        })
        if(!userServerProfile){
            throw new Error("you are not a member of this server")
        }
        const verifyCategory=await prisma.category.findUnique({
            where:{
                id:categoryId,
                serverId
            }
        })
        if(!verifyCategory){
            throw new Error("category not found")
        }
        if(userServerProfile.server.ownerId==user.id){
            const deleteCategory=await prisma.category.delete({
                where:{
                    id:categoryId
                }
            })
            console.log(deleteCategory)
            return {success:true,message:"category deleted successfully"}
        }
        const isUserVerify=userServerProfile.roles.some((item)=>item.role.adminPermission)
        if(!isUserVerify){
            throw new Error("you dont have permission to delete this category")
        }
        const deleteCategory=await prisma.category.delete({
            where:{
                id:categoryId
            }
        })
        console.log(deleteCategory)
        return {success:true,message:"category deleted successfully"}
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}