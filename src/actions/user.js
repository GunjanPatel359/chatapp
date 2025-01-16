"use server"
import prisma from "@/lib/db";
import { isAuthUser } from "@/lib/authMiddleware"

export const getAllUserJoinedServer = async () => {
    try {
        const user = await isAuthUser()
        if (!user) {
            throw new Error("Please login to continue")
        }
        const joinedServer = await prisma.user.findFirst({
            where: {
                id: user.id
            },
            include: {
                serverProfiles: {
                    include: {
                        server: true
                    }
                }
            }
        })
        return { success: true, joinedServer: JSON.parse(JSON.stringify(joinedServer.serverProfiles)) }
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

//improvement needed
export const getServer = async (serverId) =>{
    try {
        if(!serverId){
            throw new Error("Please provide a server id")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("Please login to continue")
            }
        const server=await prisma.server.findFirst({
            where: {
                id: serverId
            },
            include: {
                categories:{
                    include:{
                        channels:true
                    }
                }
            }
        })
        if(!server){
            throw new Error("Server not found")
        }
        return {success:true,server:JSON.parse(JSON.stringify(server))}
    } catch (error) {
        throw new Error(error);
    }
}