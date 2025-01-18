"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

export const createServerRole = async (serverId, role) => {
    try {
        console.log(serverId, role)
        if (!role && !role?.name) {
            throw new Error("please provide all the details")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("user not found")
        }
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
        if (!userServerProfile) throw new Error("user server profile not found")
        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                serverProfiles: {
                    some: {
                        id: userServerProfile.id
                    }
                }
            },
        })
        if (!server) throw new Error("server not found")
        if (server.ownerId == user.id) {
            const newRole = await prisma.serverRole.create({
                data: {
                    serverId: serverId,
                    name: role.name
                }
            })
            console.log(newRole)
            console.log("no")
            return { success: true, message: "role created successfully" }
        }
        console.log(userServerProfile)

        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission) || false;
        const manageRole = userServerProfile.roles.some((role) => role.role.manageRoles) || false;

        if (isAdmin || manageRole) {
            const newRole = await prisma.serverRole.create({
                data: {
                    serverId: serverId,
                    name: role.name
                }
            })
            console.log(newRole)
            return { success: true, message: "role created successfully" }
        }
        throw new Error("you do not have permission to manage roles")
    } catch (error) {
        throw new Error(error)
    }
}

//testing needed
export const editServerRole = async (serverId, roleId, role) => {
    try {
        if (!serverId && !roleId && !role && !role?.name) {
            throw new Error("server id, role id and role details are required")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("user not found")
        }
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
        if (!userServerProfile) throw new Error("user server profile not found")
        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                serverProfiles: {
                    some: {
                        id: userServerProfile.id
                    }
                }
            },
            include: {
                roles: true
            }
        })
        if (!server) throw new Error("server not found")
        if (server.ownerId == user.id) {
            const updateRole = await prisma.serverRole.update({
                where: {
                    id: roleId
                },
                data: {
                    name: role.name,
                    viewChannel: role?.viewChannel || false,
                    manageChannels: role?.manageChannels || false,
                    manageRoles: role?.manageRoles || false,
                    manageServer: role?.manageServer || false,
                    createInvite: role?.createInvite || false,
                    kickMembers: role?.kickMembers || false,
                    banMembers: role?.banMembers || false,
                    timeOutMembers: role?.timeOutMembers || false,
                    sendMessage: role?.sendMessage || false,
                    attachFiles: role?.attachFiles || false,
                    manageMessage: role?.manageMessage || false,
                    seemessageHistory: role?.seemessageHistory || false,
                    connect: role?.connect || false,
                    speak: role?.speak || false,
                    video: role?.video || false,
                    muteMembers: role?.muteMembers || false,
                    deafenMembers: role?.deafenMembers || false,
                    adminPermission: role?.adminPermission || false,
                }
            })
            console.log(updateRole)
            console.log("no")
            return { success: true, message: "role updated successfully" }
        }
        if (userServerProfile.roles?.length == 0) {
            throw new Error("you do not have permission to edit this role")
        }
        const userServerRolesPermission = userServerProfile.roles.map(role => {
            if (role.role.adminPermission || role.role.manageRoles) {
                return role.role.id
            }
        }).filter(role => role !== undefined)
        // const permissionCheck=server.roles?.find((id)=>{
        //     if(roleId==id && userServerRolesPermission.includes(id)){
        //         return "error"
        //     }
        //     if(roleId==id){
        //         return "error"
        //     }
        //     if(userServerRolesPermission.includes(id)){
        //         return "success"
        //     }
        // })
        let permissionCheck = "";

        for (const id of server.roles || []) {
            if (roleId === id) {
                permissionCheck = "error";
                break;
            }
            if (userServerRolesPermission.includes(id)) {
                permissionCheck = "success";
                break
            }
        }
        if (permissionCheck == "error") {
            throw new Error("you can not edit your own or upper roles than you")
        }
        if (permissionCheck == "success") {
            const updateRole = await prisma.serverRole.update({
                where: {
                    id: roleId
                },
                data: {
                    name: role.name,
                    viewChannel: role?.viewChannel || false,
                    manageChannels: role?.manageChannels || false,
                    manageRoles: role?.manageRoles || false,
                    manageServer: role?.manageServer || false,
                    createInvite: role?.createInvite || false,
                    kickMembers: role?.kickMembers || false,
                    banMembers: role?.banMembers || false,
                    timeOutMembers: role?.timeOutMembers || false,
                    sendMessage: role?.sendMessage || false,
                    attachFiles: role?.attachFiles || false,
                    manageMessage: role?.manageMessage || false,
                    seemessageHistory: role?.seemessageHistory || false,
                    connect: role?.connect || false,
                    speak: role?.speak || false,
                    video: role?.video || false,
                    muteMembers: role?.muteMembers || false,
                    deafenMembers: role?.deafenMembers || false,
                    adminPermission: role?.adminPermission || false,
                }
            })
            console.log(updateRole)
            return { success: true, message: "role updated successfully" }
        }
        throw new Error("sonthing went wrong")
        // const userRoles=server.roles?.filter((id)=>{
        //     if(userServerProfile.roles.includes(id)){
        //         return userServerProfile.roles.find((item)=>item.id=id)
        //     }
        // })
        // const firstPermissionRole=userRoles.find((role)=>{
        //     if(role.manageRoles || role.adminPermission){
        //         return role
        //     }
        // })
    } catch (error) {
        throw new Error("editServerRole",error)
    }
}
//testing needed
export const addMemberToServerRole=async(serverId,roleId,userServerProfileId)=>{
    try {
        if(!serverId && !roleId && !userServerProfileId){
            throw new Error("serverId,roleId,userServerProfileId are required")
        }
        const user=await isAuthUser()
        if(!user){
            throw new Error("user is not authenticated")
        }
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
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
        if (!userServerProfile) throw new Error("user server profile not found")
        const checkAlreadyAssignedTheRole=userServerProfile.roles.map((item)=>item.id)
        if(checkAlreadyAssignedTheRole.includes(roleId)){
            throw new Error("role is already assigned to the user")
        }
        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                serverProfiles: {
                    some: {
                        id: userServerProfile.id
                    }
                }
            },
            include: {
                roles: true
            }
        })
        if (!server) throw new Error("server not found")
        if (server.ownerId == user.id) {
            const roleAssignment=await prisma.userRoleAssignment.create({
                data: {
                    userId: userServerProfile.id,
                    roleId: roleId,
                    serverId: serverId
                }
            })
            console.log(roleAssignment)
            console.log("so")
            return { success: true, message: "role assigned successfully" }
        }

        if (userServerProfile.roles?.length == 0) {
            throw new Error("you do not have permission to edit this role")
        }

        const userServerRolesPermission = userServerProfile.roles.map(role => {
            if (role.role.adminPermission || role.role.manageRoles) {
                return role.role.id
            }
        }).filter(role => role !== undefined)

        let permissionCheck = "";

        for (const id of server.roles || []) {
            if (roleId === id) {
                permissionCheck = "error";
                break;
            }
            if (userServerRolesPermission.includes(id)) {
                permissionCheck = "success";
                break;
            }
        }

        if (permissionCheck == "error") {
            throw new Error("you can not edit your own or upper roles than you")
        }
        if (permissionCheck == "success") {
            const roleAssignment=await prisma.userRoleAssignment.create({
                data: {
                    userId: userServerProfile.id,
                    roleId: roleId,
                    serverId: serverId
                }
            })
            console.log(roleAssignment)
            return { success: true, message: "role assigned successfully" }
        }
        throw new Error("somthing went wrong")
    } catch (error) {
        throw new Error("addMemberToServerRole",error)
    }
}

