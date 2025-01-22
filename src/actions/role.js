"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

const helperCreateServerRole=async(serverId,role,order)=>{
    const newRole = await prisma.serverRole.create({
        data: {
            serverId: serverId,
            name: role.name,
            order
        },
    });
    return { success: true, message: "Role created successfully.", data: newRole };
}

// Helper function for updating roles
const helperUpdateServerRole = async (roleId, role) => {
    const updatedRole = await prisma.serverRole.update({
        where: { id: roleId },
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
    });
    console.log(updatedRole);
    return { success: true, message: "Role updated successfully." };
};

// Helper function to assign the role
const helperAssignServerRole = async (userServerProfileId, roleId) => {
    const roleAssignment = await prisma.userRoleAssignment.create({
        data: {
            serverProfileId: userServerProfileId,
            roleId,
        },
    });
    console.log("Role Assigned:", roleAssignment);
    return { success: true, message: "Role assigned successfully." };
};

//////////////////////////////////////////////////

export const createServerRole = async (serverId, role) => {
    try {
        // Validate inputs
        if (!serverId || !role?.name) {
            throw new Error("Please provide a valid server ID and role name.");
        }

        // Authenticate the user
        const user = await isAuthUser();
        if (!user) {
            throw new Error("User not found. Please log in.");
        }

        // Fetch user server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId,
                },
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!userServerProfile) {
            throw new Error("User server profile not found.");
        }

        // Fetch server details and verify user's association
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            select:{
                roles:true
            }
        });
        if (!server) {
            throw new Error("Server not found.");
        }
        if (server.ownerId === user.id) {
            // Create role directly for server owner
            return await helperCreateServerRole(serverId,role,server.roles.length)
        }

        // Check permissions for non-owners
        const hasPermission = userServerProfile.roles.some(
            (r) => r.role.adminPermission || r.role.manageRoles
        );
        if (!hasPermission) {
            throw new Error("You do not have permission to manage roles.");
        }

        return await helperCreateServerRole(serverId,role,server.roles.length)
    } catch (error) {
        console.error("Error in createServerRole:", error.message || error);
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
};

//testing needed
export const editServerRole = async (serverId, roleId, role) => {
    try {
        // Validate inputs
        if (!serverId || !roleId || !role?.name) {
            throw new Error("Server ID, role ID, and role details are required.");
        }

        // Authenticate user
        const user = await isAuthUser();
        if (!user) throw new Error("User not found.");

        // Fetch user's server profile
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: { userId_serverId: { userId: user.id, serverId } },
            include: { roles: { include: { role: true } } }
        });
        if (!userServerProfile) throw new Error("User server profile not found.");

        const roleToAssign = await prisma.serverRole.findUnique({ where: { id: roleId } });
        if (!roleToAssign) throw new Error("Role not found.");

        // Fetch server details
        const server = await prisma.server.findUnique({
            where: { id: serverId }
        });
        if (!server) throw new Error("Server not found.");

        // Check if the user is the server owner
        if (server.ownerId === user.id) {
            return await helperUpdateServerRole(roleId, role);
        }

        // Validate permissions
        const hasPermission = userServerProfile.roles.some(
            ({ role }) => role.adminPermission || role.manageRoles
        );
        if (!hasPermission) throw new Error("You do not have permission to edit this role.");

        const orderedUserRoles = userServerProfile.roles.sort((a, b) => a.role.order - b.role.order)

        const highestRoleWithPermission = orderedUserRoles.find(
            (role) => role.role.adminPermission || role.role.manageRoles
        );
        if (!highestRoleWithPermission) {
            throw new Error("You do not have permission to manage this role.");
        }

        // Validate role hierarchy: cannot assign roles higher or equal to the user's highest role
        if (roleToAssign.order <= highestRoleWithPermission.role.order) {
            throw new Error("You cannot assign roles higher or equal to your own.");
        }
        // Perform role update
        return await helperUpdateServerRole(roleId, role);
    } catch (error) {
        console.error("editServerRole Error:", error.message);
        throw new Error(error.message || "An error occurred while editing the role.");
    }
};

//testing needed
export const addMemberToServerRole = async (serverId, roleId, userServerProfileId) => {
    try {
        if (!serverId || !roleId || !userServerProfileId) {
            throw new Error("serverId, roleId, and userServerProfileId are required.");
        }

        const user = await isAuthUser();
        if (!user) {
            throw new Error("User is not authenticated.");
        }

        // Fetch the user's server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: { userId_serverId: { userId: user.id, serverId } },
            include: { roles: { include: { role: true } } },
        });
        if (!userServerProfile) throw new Error("User server profile not found.");

        // Check if the role is already assigned
        const isRoleAlreadyAssigned = await prisma.userRoleAssignment.findFirst({
            where: { serverProfileId: userServerProfileId, roleId },
        });
        if (isRoleAlreadyAssigned) {
            throw new Error("Role is already assigned to the user.");
        }

        // Fetch the server and include its roles
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            select: {
                roles: true
            }
        });
        if (!server) throw new Error("Server not found.");
        // Validate if the role exists in the server
        const roleExistsInServer = server.roles.some((role) => role.id === roleId);
        if (!roleExistsInServer) {
            throw new Error("The specified role does not belong to this server.");
        }

        // If the user is the server owner, directly assign the role
        if (server.ownerId === user.id) {
            return await helperAssignServerRole(userServerProfileId, roleId);
        }

        // Order the user's roles by hierarchy
        const orderedUserRoles = userServerProfile.roles
            .sort((a, b) => a.role.order - b.role.order);

        // Find the user's highest role with permissions
        const highestRoleWithPermission = orderedUserRoles.find(
            (role) => role.role.adminPermission || role.role.manageRoles
        );
        if (!highestRoleWithPermission) {
            throw new Error("You do not have permission to manage this role.");
        }

        // Fetch the role to be assigned
        const roleToAssign = await prisma.serverRole.findUnique({ where: { id: roleId } });
        if (!roleToAssign) throw new Error("Role not found.");

        // Validate role hierarchy: cannot assign roles higher or equal to the user's highest role
        if (roleToAssign.order <= highestRoleWithPermission.role.order) {
            throw new Error("You cannot assign roles higher or equal to your own.");
        }

        // Assign the role
        return await helperAssignServerRole(userServerProfileId, roleId);
    } catch (error) {
        console.error("addMemberToServerRole Error:", error.message);
        throw new Error(error.message || "An error occurred while assigning the role.");
    }
};

// testing needed
export const getServerRoles = async (serverId) => {
    try {
        if (!serverId) {
            throw new Error("Server ID is required.");
        }

        const user = await isAuthUser();
        if (!user) {
            throw new Error("You are not logged in.");
        }

        // Fetch user's server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: { userId: user.id, serverId },
            },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });

        if (!userServerProfile) {
            throw new Error("You are not a member of this server.");
        }

        // Fetch server details including roles
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: { roles: true },
        });

        if (!server) {
            throw new Error("Server not found.");
        }

        // If the user is the server owner, return all roles
        if (server.ownerId == user.id) {
            return { success: true, roles: server.roles };
        }

        // Validate user permissions
        const hasPermission = userServerProfile.roles.some(
            (role) => role.adminPermission || role.manageRoles
        );

        if (!hasPermission) {
            throw new Error("You do not have permission to view roles.");
        }

        // Return server roles
        return { success: true, roles: server.roles };
    } catch (error) {
        console.error("getServerRoles Error:", error.message);
        throw new Error("Failed to retrieve server roles. Please try again later.");
    }
};


//working

// test needed
export const addCategoryRole = async (serverId, categoryId, roleId) => {
    try {
        if (!serverId || !categoryId || !roleId) {
            throw new Error("please provide serverId,categoryId,roleId")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("You are not logged in")
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
        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
            },
            include: {
                categories: {
                    where: {
                        id: categoryId
                    }
                }
            }
        })
        const verifyingCategoryRole = await prisma.categoryRole.findUnique({
            where: {
                categoryId_roleId: {
                    categoryId: categoryId,
                    roleId: roleId,
                    serverId: serverId
                }
            }
        })
        if (verifyingCategoryRole) {
            throw new Error("Category role already exists")
        }
        if (server.categories.length === 0) {
            throw new Error("No matching categories found in this server.");
        }
        if (server.ownerId == user.id) {
            const addCategoryRole = await prisma.categoryRole.create({
                data: {
                    categoryId: categoryId,
                    serverRoleId: roleId
                }
            })
            console.log(addCategoryRole)
            return { success: true, message: "role added to category" }
        }
        if (userServerProfile.roles.length == 0) {
            throw new Error("You do not have any permission")
        }
        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission)
        if (isAdmin) {
            const addCategoryRole = await prisma.categoryRole.create({
                data: {
                    categoryId: categoryId,
                    serverRoleId: roleId
                }
            })
            console.log(addCategoryRole)
            return { success: true, message: "role added to category" }
        }
        const userServerRolesId = userServerProfile.roles.map((item) => item.roleId)
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: {
                            in: userServerRolesId.push(roleId)
                        },
                        manageRoles: {
                            in: ["ALLOW", "NEUTRAL"],
                        }
                    },
                    include: {
                        serverRole: true
                    }
                }
            }
        })
        if (!category || category.categoryRoles.length === 0) {
            throw new Error("You do not have permission to add roles");
        }
        const categoryRoles = category.categoryRoles.sort((a, b) => a.serverRole.order - b.serverRole.order)

        let manageRoleFoundBeforeTarget = false;
        for (const role of categoryRoles) {
            const { serverRoleId, manageRoles } = role;

            if (serverRoleId === roleId) {
                if (!manageRoleFoundBeforeTarget) {
                    throw new Error("You do not have permission to add this role");
                }
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                manageRoleFoundBeforeTarget = true;
            }

            if (manageRoles == "ALLOW" && userServerRolesId.includes(serverRoleId)) {
                manageRoleFoundBeforeTarget = true;
            }
        }
        if (!manageRoleFoundBeforeTarget) {
            throw new Error("You do not have permission to add this role");
        }
        const addCategoryRole = await prisma.categoryRole.create({
            data: {
                categoryId,
                roleId,
            }
        })
        console.log(addCategoryRole)
        return { success: true, message: "category role added successfully" }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

// test needed
export const updateCategoryRole = async (serverId, categoryId, categoryRoleId, updates) => {
    try {
        if (!serverId && !categoryId && !categoryRoleId && !updates) {
            throw new Error("please provide serverId,categoryId,roleId,updates")
        }
        const user = await isAuthUser()
        if (!user) {
            throw new Error("You are not logged in")
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
        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
            },
            include: {
                categories: {
                    where: {
                        id: categoryId
                    }
                }
            }
        })
        if (server.categories.length === 0) {
            throw new Error("No matching categories found in this server.");
        }
        if (server.ownerId == user.id) {
            const updateCategoryRole = await prisma.categoryRole.update({
                where: {
                    id: categoryRoleId
                },
                data: {
                    viewChannel: updates?.viewChannel || "NEUTRAL",
                    manageChannels: updates?.manageChannels || "NEUTRAL",
                    manageRoles: updates?.manageRoles || "NEUTRAL",
                    createInvite: updates?.createInvite || "NEUTRAL",
                    sendMessage: updates?.sendMessage || "NEUTRAL",
                    attachFiles: updates?.attachFiles || "NEUTRAL",
                    manageMessage: updates?.manageMessage || "NEUTRAL",
                    seemessageHistory: updates?.seemessageHistory || "NEUTRAL",
                    connect: updates?.connect || "NEUTRAL",
                    speak: updates?.speak || "NEUTRAL",
                    video: updates?.video || "NEUTRAL",
                    muteMembers: updates?.muteMembers || "NEUTRAL",
                    deafenMembers: updates?.deafenMembers || "NEUTRAL",
                }
            })
            console.log(updateCategoryRole)
            return { success: true, message: "role added to category" }
        }
        if (userServerProfile.roles.length == 0) {
            throw new Error("You do not have any permission")
        }
        const isAdmin = userServerProfile.roles.find((item) => item.role.adminPermission)
        if (isAdmin) {
            const updateCategoryRole = await prisma.categoryRole.update({
                where: {
                    id: categoryRoleId
                },
                data: {
                    viewChannel: updates?.viewChannel || "NEUTRAL",
                    manageChannels: updates?.manageChannels || "NEUTRAL",
                    manageRoles: updates?.manageRoles || "NEUTRAL",
                    createInvite: updates?.createInvite || "NEUTRAL",
                    sendMessage: updates?.sendMessage || "NEUTRAL",
                    attachFiles: updates?.attachFiles || "NEUTRAL",
                    manageMessage: updates?.manageMessage || "NEUTRAL",
                    seemessageHistory: updates?.seemessageHistory || "NEUTRAL",
                    connect: updates?.connect || "NEUTRAL",
                    speak: updates?.speak || "NEUTRAL",
                    video: updates?.video || "NEUTRAL",
                    muteMembers: updates?.muteMembers || "NEUTRAL",
                    deafenMembers: updates?.deafenMembers || "NEUTRAL",
                }
            })
            console.log(updateCategoryRole)
            return { success: true, message: "role added to category" }
        }
        const userServerRolesId = userServerProfile.roles.map((item) => item.roleId)
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                categoryRoles: {
                    where: {
                        manageRoles: {
                            in: ["ALLOW", "NEUTRAL"],
                        }
                    },
                    include: {
                        serverRole: true
                    }
                }
            }
        })
        if (!category || category.categoryRoles.length === 0) {
            throw new Error("You do not have permission to add roles");
        }
        const categoryRoles = category.categoryRoles.sort((a, b) => a.serverRole.order - b.serverRole.order)

        let manageRoleFoundBeforeTarget = false;
        for (const role of categoryRoles) {
            const { serverRoleId, manageRoles, id } = role;

            if (id === categoryRoleId) {
                if (!manageRoleFoundBeforeTarget) {
                    throw new Error("You do not have permission to add this role");
                }
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles && userServerRolesId.includes(serverRoleId)) {
                manageRoleFoundBeforeTarget = true;
            }

            if (manageRoles == "ALLOW" && userServerRolesId.includes(serverRoleId)) {
                manageRoleFoundBeforeTarget = true;
            }
        }
        if (!manageRoleFoundBeforeTarget) {
            throw new Error("You do not have permission to add this role");
        }
        const updateCategoryRole = await prisma.categoryRole.update({
            where: {
                id: categoryRoleId
            },
            data: {
                viewChannel: updates?.viewChannel || "NEUTRAL",
                manageChannels: updates?.manageChannels || "NEUTRAL",
                manageRoles: updates?.manageRoles || "NEUTRAL",
                createInvite: updates?.createInvite || "NEUTRAL",
                sendMessage: updates?.sendMessage || "NEUTRAL",
                attachFiles: updates?.attachFiles || "NEUTRAL",
                manageMessage: updates?.manageMessage || "NEUTRAL",
                seemessageHistory: updates?.seemessageHistory || "NEUTRAL",
                connect: updates?.connect || "NEUTRAL",
                speak: updates?.speak || "NEUTRAL",
                video: updates?.video || "NEUTRAL",
                muteMembers: updates?.muteMembers || "NEUTRAL",
                deafenMembers: updates?.deafenMembers || "NEUTRAL",
            }
        })
        console.log(updateCategoryRole)
        return { success: true, message: "role added to category" }
    } catch (error) {
        console.error("Error updating CategoryRole:", error.message);
        throw new Error("Unable to update category role");
    }
};

//working
export const addChannelRole = async (serverId, categoryId, channelId, roleId) => {
    try {

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}