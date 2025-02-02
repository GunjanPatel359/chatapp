"use server"

import prisma from "@/lib/db"

//temp invite inspection needed
export const inviteServer = async(serverId,userId)=>{
    try {
        if(!serverId && !userId){
            throw new Error("please provide serverId and userId")
        }
        const userServerProfile=await prisma.serverProfile.findUnique({
            where:{
                userId_serverId:{
                    serverId:serverId,
                    userId:userId,
                },
                isDeleted:false
            }
        })
        console.log(userServerProfile)
        if(userServerProfile){
            throw new Error("user is already in server ||||||||||")
        }
        const newProfile=await prisma.serverProfile.create({
            data:{
                serverId:serverId,
                userId:userId
            }
        })
        if(!newProfile){
            throw new Error("failed to create server profile")
        }
        return {success:true,message:"user joined"}
    } catch (error) {
        // console.log(error)
        throw new Error(`inviteServer: ${error}`)
    }
}