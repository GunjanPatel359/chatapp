"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

function haveSameElements(arr1, arr2) {
    return arr1.length === arr2.length && new Set(arr1).size === new Set(arr2).size && [...new Set(arr1)].every(x => new Set(arr2).has(x));
}

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
                    serverId: serverId,
                },
                isDeleted:false
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
                },
                isDeleted:false
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
                },
                isDeleted:false
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

export const getCategory=async(serverId)=>{
    try {
        if(!serverId){
            throw new Error("server id is required")
        }
        const user=await isAuthUser()
        if(!user){
            throw new Error("you are not authenticated")
        }
        const userServerProfile=await prisma.serverProfile.findFirst({
            where:{
                userId:user.id,
                serverId,
                isDeleted:false
            },
            include:{
                roles:{
                    include:{
                        role:true
                    }
                }
            }
        })
        if(!userServerProfile){
            throw new Error("you dont have permission to access this server")
        }
        const server=await prisma.server.findFirst({
            where:{
                id:serverId
            },
            include:{
                categories:true
            }
        })
        if(!server){
            throw new Error("server not found")
        }
        if(server.ownerId==user.id){
           return {success:true,categories:JSON.parse(JSON.stringify(server))} 
        }
        const isAdmin=userServerProfile.roles.some((role)=>role.role.adminPermission)
        if(isAdmin){
            return {success:true,categories:JSON.parse(JSON.stringify(server))}
        }
        throw new Error("you do not have permission")
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const reorderCategory=async(serverId,categoryOrder)=>{
    try {
        if(!serverId || categoryOrder==[] || !Array.isArray(categoryOrder)){
            throw new Error("server id is required")
        }
        const user=await isAuthUser()
        if(!user){
            throw new Error("user not found")
        }
        const userServerProfile=await prisma.serverProfile.findFirst({
            where:{
                userId:user.id,
                serverId,
                isDeleted:false
            },
            include:{
                roles:{
                    include:{
                        role:true
                    }
                }
            }
        })
        if(!userServerProfile){
            throw new Error("you dont have permission to access this server")
        }
        const server=await prisma.server.findFirst({
            where:{
                id:serverId
            },
            include:{
                categories:true
            }
        })
        if(!server){
            throw new Error("server not found")
        }
        const categoryIds=server.categories.map((item)=>item.id)
        const valid=haveSameElements(categoryIds,categoryOrder)
        if(!valid){
            throw new Error("invalid categories")
        }
        if(server.ownerId!=user.id && !userServerProfile.roles.some((role)=>role.role.adminPermission)){
            throw new Error("you dont have permission to reorder categories")
        }
        const serverCategoryReorder = await prisma.server.update({
            where: {
                id: serverId
            },
            data: {
                categories: {
                    set: categoryOrder.map(id => ({ id })) // Reorder categories by setting them in the given order
                }
            }
        });
        console.log(serverCategoryReorder)
        return {success:true, reorderCategory:JSON.parse(JSON.stringify(serverCategoryReorder))}        
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}
