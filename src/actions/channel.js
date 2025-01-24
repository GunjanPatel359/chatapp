"use server"

import { isAuthUser } from "@/lib/authMiddleware";
import prisma from "@/lib/db";

export const createChannel=async(serverId,categoryId,data)=>{
    try {
        if(!serverId || !categoryId || !data.name || !data.description){
            throw new Error('Server ID and Category ID are required')
        }
        const user=await isAuthUser()
        if(!user){
            throw new Error('You must be logged in to create a channel')
        }
        const userServerProfile=await prisma.serverProfile.findUnique({
            where:{
                userId_serverId:{
                    userId:user.id,
                    serverId
                }
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
            throw new Error('You must be a member of the server to create a channel')
        }
        const isVerifyCategory=await prisma.category.findFirst({
            where:{
                id:categoryId,
                serverId
            }
        })
        if(!isVerifyCategory){
            throw new Error('Category does not exist')
        }
        const server=await prisma.server.findFirst({
            where:{
                id:serverId
            }
        })
        if(!server){
            throw new Error('Server does not exist')
        }
        if(server.ownerId==user.id){
            const createChannel=await prisma.channel.create({
                data:{
                    name:data.name,
                    description:data.description,
                    categoryId:categoryId,
                    defaultChannelRole:{
                        create:{}
                    }
                }
            })
            console.log(createChannel)
            return {success:true,message:"channel created successfully"}
        }
        const isAdmin=userServerProfile.roles.some((role)=>role.role.adminPermission)
        if(isAdmin){
            const createChannel=await prisma.channel.create({
                data:{
                    name:data.name,
                    description:data.description,
                    categoryId:categoryId,
                    defaultChannelRole:{
                        create:{}
                    }
                }
            })
            console.log(createChannel)
            return {success:true,message:"channel created successfully"}
        }
        // working
    } catch (error) {
        console.error("Error in removeCategoryRole:", error);
        throw new Error(error.message || "Something went wrong");
    }
}

export const updateChannel=async()=>{

}

export const deleteChannel=async()=>{
    
}