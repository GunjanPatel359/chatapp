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

export const serverSettingFetch=async(serverId)=>{
    try {
        if(!serverId){
            throw new Error("Please provide a server id")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("Please login to continue")
        }
        let serverSetting=await prisma.serverProfile.findUnique({
            where:{
                userId_serverId:{
                serverId:serverId,
                userId:user.id
                }
            },
            include:{
                roles:{
                    include:{
                        role:true
                    }
                },
                server:true
            }
        })
        if(!serverSetting){
            throw new Error("Server setting not found")
        }
        if(serverSetting.server.ownerId==user.id){
            return {success:true,serverSetting:JSON.parse(JSON.stringify(serverSetting)),user:JSON.parse(JSON.stringify(user))}
        }
        serverSetting.roles=serverSetting.roles.sort((a,b)=>a.role.order - b.role.order)
        const isVerifiedToLook = serverSetting.roles.some(
            (role) => role.role.adminPermission || role.role.manageRoles
        );
        if(!isVerifiedToLook){
            return {success:false,message:"You don't have permission to view this server"}
        }
        return {success:true,serverSetting:JSON.parse(JSON.stringify(serverSetting)),user:JSON.parse(JSON.stringify(user))}
    } catch (error) {
        console.log(error)
        throw new Error(`serverSettingFetch: ${error}`)
    }
}