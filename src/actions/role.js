"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

const helperUpdateDefaultServerRole = async (defaultRoleId, updates) => {
    const updatedRole = await prisma.defaultServerRole.update({
        where: { id: defaultRoleId },
        data: {
            viewChannel: updates?.viewChannel || false,
            createInvite: updates?.createInvite || false,
            sendMessage: updates?.sendMessage || false,
            attachFiles: updates?.attachFiles || false,
            seemessageHistory: updates?.seemessageHistory || false,
            connect: updates?.connect || false,
            speak: updates?.speak || false,
            video: updates?.video || false,
        }
    })
    return { success: true, message: "updated everyone role successfully", updatedRole }
}

const helperUpdateDefaultCategoryRole = async (defaultRoleId, updates) => {
    const updatedRole = await prisma.defaultCategoryRole.update({
        where: { id: defaultRoleId },
        data: {
            viewChannel: updates?.viewChannel || "NEUTRAL",
            sendMessage: updates?.sendMessage || "NEUTRAL",
            attachFiles: updates?.attachFiles || "NEUTRAL",
            seemessageHistory: updates?.seemessageHistory || "NEUTRAL",
            connect: updates?.connect || "NEUTRAL",
            speak: updates?.speak || "NEUTRAL",
            video: updates?.video || "NEUTRAL",
        }
    })
    return { success: true, message: "updated category role successfully", updatedRole }
}

const helperUpdateDefaultChannelRole = async (defaultRoleId, updates) => {
    const updatedRole = await prisma.defaultChannelRole.update({
        where: { id: defaultRoleId },
        data: {
            viewChannel: updates?.viewChannel || "NEUTRAL",
            sendMessage: updates?.sendMessage || "NEUTRAL",
            attachFiles: updates?.attachFiles || "NEUTRAL",
            seemessageHistory: updates?.seemessageHistory || "NEUTRAL",
            connect: updates?.connect || "NEUTRAL",
            speak: updates?.speak || "NEUTRAL",
            video: updates?.video || "NEUTRAL",
        }
    })
    return { success: true, message: "updated channel role successfully", updatedRole }
}

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

const helperCreateServerRole = async (serverId, role, order) => {
    const newRole = await prisma.serverRole.create({
        data: {
            serverId: serverId,
            name: role.name.trim(),
            viewChannel: role?.viewChannel || true,
            manageChannels: role?.manageChannels || false,
            manageRoles: role?.manageRoles || false,
            createInvite: role?.createInvite || false,
            kickMembers: role?.kickMembers || false,
            banMembers: role?.banMembers || false,
            timeOutMembers: role?.timeOutMembers || false,
            sendMessage: role?.sendMessage || true,
            attachFiles: role?.attachFiles || false,
            manageMessage: role?.manageMessage || false,
            seemessageHistory: role?.seemessageHistory || false,
            connect: role?.connect || false,
            speak: role?.speak || false,
            video: role?.video || false,
            muteMembers: role?.muteMembers || false,
            deafenMembers: role?.deafenMembers || false,
            adminPermission: role?.adminPermission || false,
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
            name: role.name.trim(),
            viewChannel: role?.viewChannel || true,
            manageChannels: role?.manageChannels || false,
            manageRoles: role?.manageRoles || false,
            createInvite: role?.createInvite || false,
            kickMembers: role?.kickMembers || false,
            banMembers: role?.banMembers || false,
            timeOutMembers: role?.timeOutMembers || false,
            sendMessage: role?.sendMessage || true,
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
const helperAddCategoryRole = async (categoryId, roleId) => {
    const addCategoryRole = await prisma.categoryRole.create({
        data: {
            categoryId: categoryId,
            serverRoleId: roleId
        },
        include: {
            serverRole: true
        }
    })
    console.log(addCategoryRole)
    return { success: true, message: "role added to category", category: addCategoryRole }
}

const helperUpdateCategoryRole = async (categoryRoleId, updates) => {
    const updateCategoryRole = await prisma.categoryRole.update({
        where: {
            id: categoryRoleId,
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
        },
        include: {
            serverRole: {
                select: {
                    name: true,
                    id: true,
                    order: true,
                }
            }
        }
    })
    console.log(updateCategoryRole)
    return { success: true, message: "role added to category", updatedRole: updateCategoryRole }
}

const helperRemoveCategoryRole = async (categoryRoleId) => {
    const removeCategoryRole = await prisma.categoryRole.delete({
        where: {
            id: categoryRoleId
        }
    })
    console.log(removeCategoryRole)
    return { success: true, message: "role removed from category" }
}

const helperAddChannelRole = async (channelId, roleId) => {
    const addChannelRole = await prisma.channelRole.create({
        data: {
            channelId: channelId,
            serverRoleId: roleId
        },
        include: {
            serverRole: true
        }
    })
    console.log(addChannelRole)
    return { success: true, message: "role added to server", channel: addChannelRole }
}

const helperUpdateChannelRole = async (channelRoleId, updates) => {
    const updateChannelRole = await prisma.channelRole.update({
        where: {
            id: channelRoleId
        },
        data: {
            viewChannel: updates?.viewChannel || "NEUTRAL",
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
        },
        include: {
            serverRole: {
                select: {
                    name: true,
                    id: true,
                    order: true,
                }
            }
        }
    })
    console.log(updateChannelRole)
    return { success: true, message: "role updated in channel", updatedRole: updateChannelRole }
}

const helperRemoveChannelRole = async (channelRoleId) => {
    const deleteChannelRole = await prisma.channelRole.delete({
        where: {
            id: channelRoleId
        }
    })
    console.log(deleteChannelRole)
    return { success: true, message: "role deleted from channel" }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

//testing needed
export const addMemberToServerRole = async (serverId, roleId, userServerProfileId) => {
    try {
        if (!serverId || !roleId || !userServerProfileId) {
            return { success: false, message: "serverId, roleId, and userServerProfileId are required." }
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User is not authenticated" }
        }
        console.log(user, user.id, serverId)
        // Fetch the user's server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: { userId_serverId: { userId: user.id, serverId }, isDeleted: false },
            include: { roles: { include: { role: true } } },
        });
        if (!userServerProfile) {
            return { success: false, message: "User server profile not found" }
        }

        // Check if the role is already assigned
        const isRoleAlreadyAssigned = await prisma.userRoleAssignment.findFirst({
            where: { serverProfileId: userServerProfileId, roleId },
        });
        if (isRoleAlreadyAssigned) {
            return { success: false, message: "Role is already assigned to the user." }
        }

        // Fetch the server and include its roles
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: {
                roles: true
            }
        });
        if (!server) {
            return { success: false, message: "Server not found." }
        }
        // Validate if the role exists in the server
        const roleExistsInServer = server.roles.some((role) => role.id == roleId);
        if (!roleExistsInServer) {
            return { success: false, message: "The specified role does not belong to this server." }
        }

        // If the user is the server owner, directly assign the role
        if (server.ownerId == user.id) {
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
            return { success: false, message: "You do not have permission to manage this role." }
        }

        // Fetch the role to be assigned
        const roleToAssign = await prisma.serverRole.findUnique({ where: { id: roleId } });
        if (!roleToAssign) {
            return { success: false, message: "Role not found." }
        }

        // Validate role hierarchy: cannot assign roles higher or equal to the user's highest role
        if (roleToAssign.order <= highestRoleWithPermission.role.order) {
            return { success: false, message: "You cannot assign roles higher or equal to your own." }
        }

        // Assign the role
        return await helperAssignServerRole(userServerProfileId, roleId);
    } catch (error) {
        console.error("addMemberToServerRole Error:", error.message);
        throw new Error(error.message || "An error occurred while assigning the role.");
    }
};

export const getCategoryRolesData = async (categoryId) => {
    try {
        if (!categoryId) {
            return { success: false, message: "Server Id is required" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }

        const cate = await prisma.category.findFirst({
            where: { id: categoryId },
        })
        if (!cate) {
            return { success: false, message: "Category not found" };
        }
        const serverId = cate.serverId

        // Fetch user's server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: { userId: user.id, serverId },
                isDeleted: false
            },
            include: {
                roles: {
                    include: { role: true },
                    orderBy: { role: { order: 'asc' } }
                },
            },
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server." };
        }

        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: { roles: { orderBy: { order: "asc" } } },
        });

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        // If the user is the server owner, return all roles
        if (server.ownerId == user.id) {
            const categoryRoles = await prisma.category.findFirst({
                where: { id: categoryId },
                include: {
                    categoryRoles: {
                        include: {
                            serverRole: {
                                select: {
                                    id: true,
                                    order: true,
                                    name: true
                                }
                            }
                        }
                    },
                    defaultCategoryRole: true
                }
            })
            return { success: true, serverRoles: server.roles, categoryRoles, userServerProfile, limit: 0 };
        }
        const userServerRolesId = userServerProfile.roles.map((role) => role.roleId)
        if (userServerRolesId.length == 0) {
            return { success: false, message: "You are not a member of this server." };
        }
        const adminPermission = userServerProfile.roles.some((role) => role.role.adminPermission)
        if (adminPermission) {
            const categoryRoles = await prisma.category.findFirst({
                where: { id: categoryId },
                include: {
                    categoryRoles: {
                        include: {
                            serverRole: {
                                select: {
                                    id: true,
                                    order: true
                                }
                            }
                        }
                    },
                    defaultCategoryRole: true
                }
            })
            return { success: true, serverRoles: server.roles, categoryRoles, userServerProfile, limit: 0 };
        }
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerRolesId] },
                    },
                    include: { serverRole: true },
                    orderBy: { serverRole: { order: 'asc' } }
                }
            }
        })
        const permission = category.categoryRoles.find((role) => role.manageRoles == "ALLOW" || (role.manageRoles == "NEUTRAL" && (role.serverRole.manageRoles)))

        if (permission) {
            const categoryRoles = await prisma.category.findFirst({
                where: { id: categoryId },
                include: {
                    categoryRoles: {
                        include: {
                            serverRole: {
                                select: {
                                    id: true,
                                    order: true
                                }
                            }
                        }
                    },
                    defaultCategoryRole: true
                }
            })
            return { success: true, serverRoles: server.roles, categoryRoles, userServerProfile, limit: permission.serverRole.order };
        }
        return { success: false, message: "You do not have permission to look" }
    } catch (error) {
        console.log(error)
        console.error("getCategoryRoles Error:", error.message);
        throw new Error("Failed to retrieve category roles. Please try again later.");
    }
}

export const getChannelRolesData = async (channelId) => {
    try {
        if (!channelId) {
            return { success: false, message: "Channel ID is required" }
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }

        const chan = await prisma.channel.findFirst({
            where: { id: channelId },
            include: { category: true }
        })
        if (!chan) {
            return { success: false, message: "Category not found" };
        }
        const serverId = chan.category.serverId
        const categoryId = chan.categoryId
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: { userId: user.id, serverId },
                isDeleted: false
            },
            include: {
                roles: {
                    include: { role: true },
                    orderBy: { role: { order: 'asc' } }
                },
            },
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server." };
        }

        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: { roles: { orderBy: { order: "asc" } } },
        });

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        if ((server.ownerId == user.id) || (userServerProfile.roles.some((role) => role.role.adminPermission))) {
            const channelRolesDelivered = await prisma.channel.findFirst({
                where: { id: channelId },
                include: {
                    channelRoles: {
                        include: {
                            serverRole: {
                                select: {
                                    id: true,
                                    order: true,
                                    name: true
                                }
                            }
                        }
                    },
                    defaultChannelRole: true
                }
            })
            return { success: true, serverRoles: server.roles, channelRoles: channelRolesDelivered, userServerProfile, limit: 0 };
        }

        const userServerRolesId = userServerProfile.roles.map((role) => role.roleId)
        if (userServerRolesId.length == 0) {
            return { success: false, message: "You are not a member of this server." };
        }

        let channelRoles = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                channelRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        let categoryRoles = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        // Filter and sort roles
        channelRoles.channelRoles = channelRoles.channelRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        categoryRoles.categoryRoles = categoryRoles.categoryRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        let visitedRoles = [];

        let per = Number.MAX_SAFE_INTEGER;

        for (const role of channelRoles.channelRoles) {
            const { serverRoleId, manageRoles } = role;

            visitedRoles.push(serverRoleId);

            if (manageRoles == "ALLOW") {
                per = Math.min(per, role.serverRole.order);
            }

            if (manageRoles == "NEUTRAL") {
                const temp = categoryRoles.categoryRoles.find((item) => item.serverRoleId == serverRoleId);
                if (temp) {
                    if (temp.manageRoles == "ALLOW" || (temp.manageRoles == "NEUTRAL" && temp.serverRole.manageRoles)) {
                        per = Math.min(per, role.serverRole.order);
                    }
                } else {
                    if (role.serverRole.manageRoles) {
                        per = Math.min(per, role.serverRole.order);
                    }
                }
            }
        }

        if (visitedRoles.length > 0) {
            categoryRoles.categoryRoles = categoryRoles.categoryRoles.filter(
                (item) => !visitedRoles.includes(item.serverRoleId)
            );
        }

        for (const role of categoryRoles.categoryRoles) {
            const { manageRoles } = role;

            if (manageRoles == "ALLOW") {
                per = Math.min(per, role.serverRole.order);
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                per = Math.min(per, role.serverRole.order);
            }
        }

        if (per != Number.MAX_SAFE_INTEGER) {
            const channelRoles = await prisma.channel.findFirst({
                where: { id: channelId },
                include: {
                    channelRoles: {
                        include: {
                            serverRole: {
                                select: {
                                    id: true,
                                    order: true,
                                    name: true
                                }
                            }
                        }
                    },
                    defaultChannelRole: true
                }
            })
            return { success: true, serverRoles: server.roles, channelRoles: channelRolesDelivered, userServerProfile, limit: per };
        }

        return { success: false, message: "Something went wrong" };

    } catch (error) {
        console.log(error)
        console.error("getChannelRoleData Error:", error.message);
        throw new Error("Failed to retrieve category roles. Please try again later.");
    }
}

export const updateDefaultServerRole = async (defaultRoleId, updates) => {
    try {
        console.log(defaultRoleId, updates)
        if (!defaultRoleId || !updates) {
            return { success: false, message: "Default role id is required" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }
        const defaultRole = await prisma.defaultServerRole.findFirst({
            where: {
                id: defaultRoleId
            },
            include: {
                server: {
                    select: {
                        ownerId: true
                    }
                }
            }
        })
        if (!defaultRole) {
            return { success: false, message: "Default role not found" }
        }
        const serverId = defaultRole.serverId
        if (!serverId) {
            return { success: false, message: "Server id is required" }
        }

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: { userId: user.id, serverId },
                isDeleted: false
            },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server." };
        }

        if (defaultRole.server.ownerId == user.id) {
            return await helperUpdateDefaultServerRole(defaultRoleId, updates)
        }

        // Validate user permissions
        const hasPermission = userServerProfile.roles.some(
            (role) => role.adminPermission || role.manageRoles
        );

        if (!hasPermission) {
            return { success: false, message: "You do not have permission to view roles." };
        }
        return await helperUpdateDefaultServerRole(defaultRoleId, updates)
    } catch (error) {
        console.error("updateDefaultServerRole Error:", error.message);
        throw new Error("Failed to update server default role. Please try again later.");
    }
}

export const updateDefaultCategoryRole = async (defaultRoleId, updates) => {
    try {
        if (!defaultRoleId || !updates) {
            return { success: false, message: "Default role id is required" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }
        const defaultRole = await prisma.defaultCategoryRole.findFirst({
            where: {
                id: defaultRoleId
            },
            include: {
                category: {
                    include: {
                        server: {
                            select: {
                                ownerId: true
                            }
                        },
                    }
                }
            }
        })
        if (!defaultRole) {
            return { success: false, message: "Default role not found" }
        }
        const serverId = defaultRole.category.serverId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (defaultRole.category.server.ownerId == user.id) {
            return await helperUpdateDefaultCategoryRole(defaultRoleId, updates)
        }

        if (!userServerProfile.roles.length) {
            return { success: false, message: "You do not have any permission" };
        }

        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission);
        if (isAdmin) {
            return await helperUpdateDefaultCategoryRole(defaultRoleId, updates);
        }

        const userServerRolesId = userServerProfile.roles.map((item) => item.roleId);

        const category = await prisma.category.findUnique({
            where: { id: defaultRole.categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerRolesId, categoryRoleId] },
                        manageRoles: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: { serverRole: true }
                }
            }
        });

        if (!category || category.categoryRoles.length === 0) {
            return { success: false, message: "You do not have permission to add roles" };
        }

        const checkPermission = category.categoryRoles.some((role) => role.manageRoles == "ALLOW" || (role.manageRoles == "NEUTRAL" && role.serverRole.manageRoles))
        if (!checkPermission) {
            return { success: false, message: "You do not have permission to add roles" };
        }
        return await helperUpdateDefaultCategoryRole(defaultRoleId, updates);
    } catch (error) {
        console.error("updateDefaultCategoryRole Error:", error.message);
        throw new Error("Failed to update category default role. Please try again later.");
    }
}

export const updateDefaultChannelRole = async (defaultRoleId, updates) => {
    try {
        if (!defaultRoleId || !updates) {
            return { success: false, message: "Default role id is required" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }
        console.log(defaultRoleId)
        const defaultRole = await prisma.defaultChannelRole.findFirst({
            where: {
                id: defaultRoleId
            },
            select: {
                channel: {
                    select: {
                        categoryId: true,
                        category: {
                            select: {
                                server: {
                                    select: {
                                        id: true,
                                        ownerId: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!defaultRole) {
            return { success: false, message: "Default role not found" }
        }
        const serverId = defaultRole.channel.category.server.id
        const categoryId = defaultRole.channel.categoryId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "User server profile not found" }
        }

        if (defaultRole.channel.category.server.ownerId == user.id || userServerProfile.roles.some((role) => role.role.adminPermission)) {
            return await helperUpdateDefaultChannelRole(defaultRoleId, updates);
        }

        ////////////////////////////////////////////////////////////////////

        const userServerProfileIds = userServerProfile.roles.map((item) => item.roleId);

        let channelRoles = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                channelRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        let categoryRoles = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        // Filter and sort roles
        channelRoles.channelRoles = channelRoles.channelRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        categoryRoles.categoryRoles = categoryRoles.categoryRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        let visitedRoles = [];
        let isVerify = false;

        for (const role of channelRoles.channelRoles) {
            const { serverRoleId, manageRoles } = role;

            visitedRoles.push(serverRoleId);

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL") {
                const temp = categoryRoles.categoryRoles.find((item) => item.serverRoleId == serverRoleId);
                if (temp) {
                    if (temp.manageRoles == "ALLOW" || (temp.manageRoles == "NEUTRAL" && temp.serverRole.manageRoles)) {
                        isVerify = true;
                        break;
                    }
                } else {
                    if (role.serverRole.manageRoles) {
                        isVerify = true;
                        break;
                    }
                }
            }
        }

        if (isVerify) {
            return await helperUpdateDefaultChannelRole(defaultRoleId, updates);
        }

        if (visitedRoles.length > 0) {
            categoryRoles.categoryRoles = categoryRoles.categoryRoles.filter(
                (item) => !visitedRoles.includes(item.serverRoleId)
            );
        }

        if (categoryRoles.categoryRoles.length == 0) {
            return { success: false, message: "Permission denied" };
        }

        for (const role of categoryRoles.categoryRoles) {
            const { manageRoles } = role;

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                isVerify = true;
                break;
            }
        }

        if (isVerify) {
            return await helperUpdateDefaultChannelRole(defaultRoleId, updates);
        }

        return { success: false, message: "You do not have permission" };

    } catch (error) {
        console.error("updateDefaultChannelRole Error:", error.message);
        throw new Error("Failed to update channel default role. Please try again later.");
    }
}

// testing needed
export const getServerRoles = async (serverId) => {
    try {
        if (!serverId) {
            return { success: false, message: "Server Id is required" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }

        // Fetch user's server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: { userId: user.id, serverId },
                isDeleted: false
            },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server." };
        }

        // Fetch server details including roles
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: {
                roles: {
                    orderBy: {
                        order: "asc"
                    },
                    include:{
                        UserRoleAssignment:{ 
                            include:{
                                serverProfile:true
                            }
                        }
                    }
                },
                defaultServerRole: true
            },
        });
        console.log(server) 

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        // If the user is the server owner, return all roles
        if (server.ownerId == user.id) {
            return { success: true, roles: server.roles, defaultServerRole: server.defaultServerRole };
        }

        // Validate user permissions
        const hasPermission = userServerProfile.roles.some(
            (role) => role.adminPermission || role.manageRoles
        );

        if (!hasPermission) {
            return { success: false, message: "You do not have permission to view roles." };
        }

        // Return server roles
        return { success: true, roles: server.roles, defaultServerRole: server.defaultServerRole };
    } catch (error) {
        console.error("getServerRoles Error:", error.message);
        throw new Error("Failed to retrieve server roles. Please try again later.");
    }
};

export const createServerRole = async (serverId, role) => {
    try {
        // Validate inputs
        if (!serverId || !role?.name.trim()) {
            return { success: false, message: "Please provide a valid server ID and role name." };
        }

        // Authenticate the user
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User not found. Please log in." };
        }

        // Fetch user server profile with roles
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId,
                },
                isDeleted: false
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
            return { success: false, message: "User server profile not found." };
        }

        // Fetch server details and verify user's association
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: {
                roles: true
            }
        });

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        console.log(server, user);

        if (server.ownerId == user.id) {
            // Create role directly for server owner
            return await helperCreateServerRole(serverId, role, server.roles.length);
        }

        // Check permissions for non-owners
        const isAdmin = userServerProfile.roles.some(
            (r) => r.role.adminPermission
        );

        if (isAdmin) {
            return await helperCreateServerRole(serverId, role, server.roles.length);
        }

        role.adminPermission = false;
        const isManageRole = userServerProfile.roles.some(
            (r) => r.role.manageRoles
        );

        if (isManageRole) {
            return await helperCreateServerRole(serverId, role, server.roles.length);
        }

        return { success: false, message: "You do not have permission to manage roles." };
    } catch (error) {
        console.error("Error in createServerRole:", error.message || error);
        throw new Error(error.message || "An unexpected error occurred.");
    }
};

//testing needed
export const editServerRole = async (serverId, roleId, role) => {
    try {
        console.log(role)
        // Validate inputs
        if (!serverId || !roleId || !role?.name.trim()) {
            return { success: false, message: "Server ID, role ID, and role details are required." };
        }

        // Authenticate user
        const user = await isAuthUser();
        if (!user) return { success: false, message: "User not found." };

        // Fetch user's server profile
        const userServerProfile = await prisma.serverProfile.findUnique({
            where: { userId_serverId: { userId: user.id, serverId }, isDeleted: false },
            include: { roles: { include: { role: true } } }
        });

        if (!userServerProfile) return { success: false, message: "User server profile not found." };

        const roleToAssign = await prisma.serverRole.findUnique({ where: { id: roleId } });
        if (!roleToAssign) return { success: false, message: "Role not found." };

        // Fetch server details
        const server = await prisma.server.findUnique({
            where: { id: serverId }
        });

        if (!server) return { success: false, message: "Server not found." };

        // Check if the user is the server owner
        if (server.ownerId == user.id) {
            return await helperUpdateServerRole(roleId, role);
        }

        // Validate permissions
        const hasPermission = userServerProfile.roles.some(
            ({ role }) => role.adminPermission || role.manageRoles
        );

        if (!hasPermission) return { success: false, message: "You do not have permission to edit this role." };

        const orderedUserRoles = userServerProfile.roles.sort((a, b) => a.role.order - b.role.order);

        const isAdmin = orderedUserRoles.find(
            (role) => role.role.adminPermission
        );

        if (isAdmin) {
            return await helperUpdateServerRole(roleId, role);
        }

        const isManageRole = orderedUserRoles.find(
            (role) => role.role.manageRoles
        );

        role.adminPermission = false;
        if (isManageRole && roleToAssign.order > isManageRole.role.order) {
            return await helperUpdateServerRole(roleId, role);
        }

        return { success: false, message: "You do not have sufficient permissions to edit this role." };
    } catch (error) {
        console.error("editServerRole Error:", error.message);
        throw new Error(error.message || "An error occurred while editing the role.");
    }
};

export const removeServerRole = async () => {
    try {

    } catch (error) {
        console.error("removeServerRole Error:", error.message);
        throw new Error(error.message || "An error occurred while editing the role.");
    }
}


// test needed
export const addCategoryRole = async (categoryId, roleId) => {
    try {
        if (!categoryId || !roleId) {
            return { success: false, message: "Please provide serverId, categoryId, roleId" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }

        const categoryCheck = await prisma.category.findFirst({
            where: {
                id: categoryId
            }
        })

        if (!categoryCheck) {
            return { success: false, message: "Category not found" };
        }

        const serverId = categoryCheck.serverId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: { categories: { where: { id: categoryId } } }
        });

        // Check if category exists
        if (server.categories?.length == 0) {
            return { success: false, message: "No matching categories found in this server." };
        }

        const serverRoleCheck = await prisma.serverRole.findFirst({
            where: {
                id: roleId
            }
        });

        if (!serverRoleCheck) {
            return { success: false, message: "Role not found" };
        }

        // Verify if category-role exists
        const verifyingCategoryRole = await prisma.categoryRole.findFirst({
            where: {
                categoryId: categoryId,
                serverRoleId: roleId
            }
        });

        if (verifyingCategoryRole) {
            return { success: false, message: "Category role already exists" };
        }

        // If user is owner, skip permission checks
        if (server.ownerId == user.id) {
            return await helperAddCategoryRole(categoryId, roleId);
        }

        // Permission checks for other users
        if (!userServerProfile.roles.length) {
            return { success: false, message: "You do not have any permission" };
        }

        // Check if the user has admin or manageRoles permission
        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission);
        if (isAdmin) {
            return await helperAddCategoryRole(categoryId, roleId);
        }

        const userServerRolesId = userServerProfile.roles.map((item) => item.roleId);

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerRolesId] },
                        manageRoles: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: { serverRole: true }
                }
            }
        });

        if (!category || category.categoryRoles.length == 0) {
            return { success: false, message: "You do not have permission to add this role" };
        }

        // Sorting by serverRole order
        const categoryRoles = category.categoryRoles.sort((a, b) => a.serverRole.order - b.serverRole.order);
        if (serverRoleCheck.order < categoryRoles[0].serverRole.order) {
            return { success: false, message: "You do not have permission to add this role" };
        }

        let manageRoleFoundBeforeTarget = false;

        for (const role of categoryRoles) {
            const { serverRoleId, manageRoles } = role;

            if (serverRoleId == roleId) {
                break;
            }

            if (manageRoles == "ALLOW" || (manageRoles == "NEUTRAL" && role.serverRole.manageRoles)) {
                manageRoleFoundBeforeTarget = true;
                break;
            }
        }

        if (!manageRoleFoundBeforeTarget) {
            return { success: false, message: "You do not have permission to add this role" };
        }

        return await helperAddCategoryRole(categoryId, roleId);

    } catch (error) {
        console.log(`Error in addCategoryRole: ${error.message}`);
        throw new Error(error.message || "An error occurred while adding the category role.");
    }
};

// test needed
export const updateCategoryRole = async (categoryId, categoryRoleId, updates) => {
    try {
        if (!categoryId || !categoryRoleId || !updates) {
            return { success: false, message: "Please provide serverId, categoryId, roleId, and updates" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }

        const categoryCheck = await prisma.category.findFirst({
            where: {
                id: categoryId
            }
        })

        if (!categoryCheck) {
            return { success: false, message: "Category not found" };
        }

        const serverId = categoryCheck.serverId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        const server = await prisma.server.findUnique({
            where: { id: serverId },
            include: {
                categories: {
                    where: { id: categoryId }
                }
            }
        });

        if (server.categories.length === 0) {
            return { success: false, message: "No matching categories found in this server." };
        }

        const verifyCategoryRoleExist = await prisma.categoryRole.findUnique({
            where: { id: categoryRoleId, categoryId }
        });

        if (!verifyCategoryRoleExist) {
            return { success: false, message: "Category Role does not exist" };
        }

        if (server.ownerId == user.id) {
            return await helperUpdateCategoryRole(categoryRoleId, updates);
        }

        if (!userServerProfile.roles.length) {
            return { success: false, message: "You do not have any permission" };
        }

        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission);
        if (isAdmin) {
            return await helperUpdateCategoryRole(categoryRoleId, updates);
        }

        const userServerRolesId = userServerProfile.roles.map((item) => item.roleId);

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerRolesId, categoryRoleId] },
                        manageRoles: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: { serverRole: true }
                }
            }
        });

        if (!category || category.categoryRoles.length === 0) {
            return { success: false, message: "You do not have permission to add roles" };
        }

        const categoryRoles = category.categoryRoles.sort((a, b) => a.serverRole.order - b.serverRole.order);

        let manageRoleFoundBeforeTarget = false;
        for (const role of categoryRoles) {
            const { manageRoles, id } = role;

            if (id == categoryRoleId) {
                if (!manageRoleFoundBeforeTarget) {
                    return { success: false, message: "You do not have permission to add this role" };
                }
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                manageRoleFoundBeforeTarget = true;
            }

            if (manageRoles == "ALLOW") {
                manageRoleFoundBeforeTarget = true;
            }
        }

        if (!manageRoleFoundBeforeTarget) {
            return { success: false, message: "You do not have permission to add this role" };
        }

        return await helperUpdateCategoryRole(categoryRoleId, updates);
    } catch (error) {
        console.error("Error updating CategoryRole:", error.message);
        throw new Error("Unable to update category role");
    }
};

export const removeCategoryRole = async (categoryId, categoryRoleId) => {
    try {
        if (!categoryId || !categoryRoleId) {
            return { success: false, message: "Server ID, Category ID, and Category Role ID are required" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User is not authenticated" };
        }

        const categoryCheck = await prisma.category.findFirst({
            where: {
                id: categoryId
            }
        })

        if (!categoryCheck) {
            return { success: false, message: "Category not found" };
        }

        const serverId = categoryCheck.serverId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "User is not in the server" };
        }

        const isCategoryExist = await prisma.category.findFirst({
            where: { id: categoryId, serverId },
            include: { server: true }
        });

        if (!isCategoryExist) {
            return { success: false, message: "Category does not exist" };
        }

        const categoryRole = await prisma.categoryRole.findFirst({
            where: { id: categoryRoleId, categoryId }
        });

        if (!categoryRole) {
            return { success: false, message: "Category Role does not exist" };
        }

        if (isCategoryExist.server.ownerId == user.id) {
            return await helperRemoveCategoryRole(categoryRoleId);
        }

        const isAdmin = userServerProfile.roles.some((role) => role.role.adminPermission);
        if (isAdmin) {
            return await helperRemoveCategoryRole(categoryRoleId);
        }

        const userServerRolesId = userServerProfile.roles.map((item) => item.roleId);
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerRolesId, categoryRoleId] },
                        manageRoles: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: { serverRole: true }
                }
            }
        });

        if (!category || category.categoryRoles.length === 0) {
            return { success: false, message: "You do not have permission to remove roles" };
        }

        const categoryRoles = category.categoryRoles.sort((a, b) => a.serverRole.order - b.serverRole.order);
        let manageRoleFoundBeforeTarget = false;

        for (const role of categoryRoles) {
            const { manageRoles, id } = role;

            if (id == categoryRoleId) {
                if (!manageRoleFoundBeforeTarget) {
                    return { success: false, message: "You do not have permission to remove this role" };
                }
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                manageRoleFoundBeforeTarget = true;
            }

            if (manageRoles == "ALLOW") {
                manageRoleFoundBeforeTarget = true;
            }
        }

        if (!manageRoleFoundBeforeTarget) {
            return { success: false, message: "You do not have permission to remove this role" };
        }

        return await helperRemoveCategoryRole(categoryRoleId);
    } catch (error) {
        console.error("Error in removeCategoryRole:", error);
        throw new Error(error.message || "Something went wrong");
    }
};


// remaining
export const addChannelRole = async (channelId, roleId) => {
    try {
        if (!channelId || !roleId) {
            return { success: false, message: "Please provide all the fields" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User not defined" };
        }

        const chan = await prisma.channel.findFirst({
            where: { id: channelId },
            include: { category: true }
        })
        if (!chan) {
            return { success: false, message: "Category not found" };
        }
        const serverId = chan.category.serverId
        const categoryId = chan.categoryId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId,
                },
                isDeleted: false
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
            return { success: false, message: "You are not a member of this server" };
        }

        const verifyServerRole = await prisma.serverRole.findFirst({
            where: {
                id: roleId
            }
        });

        if (!verifyServerRole) {
            return { success: false, message: "Role not found" };
        }

        const verifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                category: {
                    id: categoryId,
                    serverId: serverId, // Ensure the category belongs to the server
                },
            },
        });

        if (!verifyChannel) {
            return { success: false, message: "Channel does not belong to the specified server" };
        }

        const categoryRoleAlreadyExistVerify = await prisma.channelRole.findFirst({
            where: {
                channelId,
                serverRoleId: roleId
            }
        });
        if (categoryRoleAlreadyExistVerify) {
            return { success: false, message: "Role already exists in this channel" };
        }

        const server = await prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            return { success: false, message: "Server not found" };
        }

        // If user is the server owner, allow action
        if (server.ownerId == user.id) {
            return await helperAddChannelRole(channelId, roleId);
        }

        if (!userServerProfile.roles.length) {
            return { success: false, message: "You do not have any roles" };
        }

        // If user has admin permission, allow action
        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission);
        if (isAdmin) {
            return await helperAddChannelRole(channelId, roleId);
        }

        const userServerProfileIds = userServerProfile.roles.map((item) => item.roleId);

        let channelRoles = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                channelRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        let categoryRoles = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        // Filter and sort roles
        channelRoles.channelRoles = channelRoles.channelRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        categoryRoles.categoryRoles = categoryRoles.categoryRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        console.log(channelRoles, categoryRoles);

        let visitedRoles = [];
        let isVerify = false;

        for (const role of channelRoles.channelRoles) {
            const { serverRoleId, manageRoles } = role;
            if (role.serverRole.order >= verifyServerRole.order) {
                break;
            }

            visitedRoles.push(serverRoleId);

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL") {
                const temp = categoryRoles.categoryRoles.find((item) => item.serverRoleId == serverRoleId);
                if (temp) {
                    if (temp.manageRoles == "ALLOW" || (temp.manageRoles == "NEUTRAL" && temp.serverRole.manageRoles)) {
                        isVerify = true;
                        break;
                    }
                } else {
                    if (role.serverRole.manageRoles) {
                        isVerify = true;
                        break;
                    }
                }
            }
        }

        if (isVerify) {
            return await helperAddChannelRole(channelId, roleId);
        }

        if (visitedRoles.length > 0) {
            categoryRoles.categoryRoles = categoryRoles.categoryRoles.filter(
                (item) => !visitedRoles.includes(item.serverRoleId)
            );
        }

        if (categoryRoles.categoryRoles.length == 0) {
            return { success: false, message: "Permission denied" };
        }

        for (const role of categoryRoles.categoryRoles) {
            const { manageRoles } = role;
            if (role.serverRole.order >= verifyServerRole.order) {
                break;
            }

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                isVerify = true;
                break;
            }
        }

        if (isVerify) {
            return await helperAddChannelRole(channelId, roleId);
        }

        return { success: false, message: "Something went wrong" };
    } catch (error) {
        console.error("Error in addChannelRole:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export const updateChannelRole = async (channelId, channelRoleId, updates) => {
    try {
        if (!channelId || !channelRoleId || !updates) {
            return { success: false, message: "Please provide all the fields" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User not defined" };
        }

        const chan = await prisma.channel.findFirst({
            where: { id: channelId },
            include: { category: true }
        })
        if (!chan) {
            return { success: false, message: "Category not found" };
        }
        const serverId = chan.category.serverId
        const categoryId = chan.categoryId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId,
                },
                isDeleted: false
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
            return { success: false, message: "You are not a member of this server" };
        }

        const verifyServerRole = await prisma.channelRole.findFirst({
            where: {
                id: channelRoleId
            },
            include: {
                serverRole: true
            }
        });

        if (!verifyServerRole) {
            return { success: false, message: "Role not found" };
        }

        const verifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                category: {
                    id: categoryId,
                    serverId: serverId, // Ensure the category belongs to the server
                },
            },
        });

        if (!verifyChannel) {
            return { success: false, message: "Channel does not belong to the specified server" };
        }

        const channelRole = await prisma.channelRole.findFirst({
            where: {
                id: channelRoleId,
                channelId,
            }
        });
        if (!channelRole) {
            return { success: false, message: "Role does not exist in this channel" };
        }

        const server = await prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            return { success: false, message: "Server not found" };
        }

        // If user is the server owner, allow action
        if (server.ownerId == user.id) {
            return await helperUpdateChannelRole(channelRoleId, updates);
        }

        if (!userServerProfile.roles.length) {
            return { success: false, message: "You do not have any roles" };
        }

        // If user has admin permission, allow action
        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission);
        if (isAdmin) {
            return await helperUpdateChannelRole(channelRoleId, updates);
        }

        const userServerProfileIds = userServerProfile.roles.map((item) => item.roleId);

        let channelRoles = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                channelRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        let categoryRoles = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        // Filter and sort roles
        channelRoles.channelRoles = channelRoles.channelRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        categoryRoles.categoryRoles = categoryRoles.categoryRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        let visitedRoles = [];
        let isVerify = false;

        for (const role of channelRoles.channelRoles) {
            const { serverRoleId, manageRoles } = role;
            if (role.serverRole.order >= verifyServerRole.serverRole.order) {
                break;
            }

            visitedRoles.push(serverRoleId);

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL") {
                const temp = categoryRoles.categoryRoles.find((item) => item.serverRoleId == serverRoleId);
                if (temp) {
                    if (temp.manageRoles == "ALLOW" || (temp.manageRoles == "NEUTRAL" && temp.serverRole.manageRoles)) {
                        isVerify = true;
                        break;
                    }
                } else {
                    if (role.serverRole.manageRoles) {
                        isVerify = true;
                        break;
                    }
                }
            }
        }

        if (isVerify) {
            return await helperUpdateChannelRole(channelRoleId, updates);
        }

        if (visitedRoles.length > 0) {
            categoryRoles.categoryRoles = categoryRoles.categoryRoles.filter(
                (item) => !visitedRoles.includes(item.serverRoleId)
            );
        }

        if (categoryRoles.categoryRoles.length == 0) {
            return { success: false, message: "Permission denied" };
        }

        for (const role of categoryRoles.categoryRoles) {
            const { manageRoles } = role;
            if (role.serverRole.order >= verifyServerRole.serverRole.order) {
                break;
            }

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                isVerify = true;
                break;
            }
        }

        if (isVerify) {
            return await helperUpdateChannelRole(channelRoleId, updates);
        }

        return { success: false, message: "Something went wrong" };
    } catch (error) {
        console.error("Error in updateChannelRole:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export const removeChannelRole = async (channelId, channelRoleId) => {
    try {
        if (!channelId || !channelRoleId) {
            return { success: false, message: "Server ID, Category ID, Channel ID, Channel Role ID are required" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User is not authenticated" };
        }

        const chan = await prisma.channel.findFirst({
            where: { id: channelId },
            include: { category: true }
        })
        if (!chan) {
            return { success: false, message: "Category not found" };
        }
        const serverId = chan.category.serverId
        const categoryId = chan.categoryId


        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
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
            return { success: false, message: "User is not a member of the server" };
        }

        const isVerifyChannel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                categoryId: categoryId,
            },
            include: {
                category: true
            }
        });

        if (!isVerifyChannel) {
            return { success: false, message: "Channel not found" };
        }

        if (isVerifyChannel.category.serverId != serverId) {
            return { success: false, message: "Channel is not in the server" };
        }

        const channelRole = await prisma.channelRole.findFirst({
            where: {
                id: channelRoleId,
                channelId,
            }
        });

        if (!channelRole) {
            return { success: false, message: "Role does not exist in this channel" };
        }

        const server = await prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            return { success: false, message: "Server not found" };
        }

        // If user is the server owner, allow action
        if (server.ownerId == user.id) {
            return await helperRemoveChannelRole(channelRoleId);
        }

        if (!userServerProfile.roles.length) {
            return { success: false, message: "You do not have any roles" };
        }

        // If user has admin permission, allow action
        const isAdmin = userServerProfile.roles.some((item) => item.role.adminPermission);
        if (isAdmin) {
            return await helperRemoveChannelRole(channelRoleId);
        }

        const userServerProfileIds = userServerProfile.roles.map((item) => item.roleId);

        let channelRoles = await prisma.channel.findFirst({
            where: { id: channelId },
            include: {
                channelRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds, channelRole.serverRoleId] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        let categoryRoles = await prisma.category.findFirst({
            where: { id: categoryId },
            include: {
                categoryRoles: {
                    where: {
                        serverRoleId: { in: [...userServerProfileIds, channelRole.serverRoleId] },
                    },
                    include: { serverRole: true },
                },
            },
        });

        // Filter and sort roles
        channelRoles.channelRoles = channelRoles.channelRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        categoryRoles.categoryRoles = categoryRoles.categoryRoles
            .sort((a, b) => a.serverRole.order - b.serverRole.order);

        let visitedRoles = [];
        let isVerify = false;

        for (const role of channelRoles.channelRoles) {
            const { serverRoleId, manageRoles } = role;
            if (serverRoleId == channelRole.serverRoleId) {
                break;
            }

            visitedRoles.push(serverRoleId);

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL") {
                const temp = categoryRoles.categoryRoles.find((item) => item.serverRoleId == serverRoleId);
                if (temp) {
                    if (temp.manageRoles == "ALLOW" || (temp.manageRoles == "NEUTRAL" && temp.serverRole.manageRoles)) {
                        isVerify = true;
                        break;
                    }
                } else {
                    if (role.serverRole.manageRoles) {
                        isVerify = true;
                        break;
                    }
                }
            }
        }

        if (isVerify) {
            return await helperRemoveChannelRole(channelRoleId);
        }

        if (visitedRoles.length > 0) {
            categoryRoles.categoryRoles = categoryRoles.categoryRoles.filter(
                (item) => !visitedRoles.includes(item.serverRoleId)
            );
        }

        if (categoryRoles.categoryRoles.length == 0) {
            return { success: false, message: "Permission denied" };
        }

        for (const role of categoryRoles.categoryRoles) {
            const { serverRoleId, manageRoles } = role;
            if (serverRoleId == channelRole.serverRoleId) {
                break;
            }

            if (manageRoles == "ALLOW") {
                isVerify = true;
                break;
            }

            if (manageRoles == "NEUTRAL" && role.serverRole.manageRoles) {
                isVerify = true;
                break;
            }
        }

        if (isVerify) {
            return await helperRemoveChannelRole(channelRoleId);
        }

        return { success: false, message: "Something went wrong" };
    } catch (error) {
        console.error("Error in deleteChannelRole:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
};


//testing needed //improvement needed
export const reorderServerRole = async (serverId, serverRoleOrder) => {
    try {
        // Check if serverId and serverRoleOrder are valid
        console.log(serverRoleOrder)
        if (!serverId || serverRoleOrder.length === 0 || !Array.isArray(serverRoleOrder)) {
            return { success: false, message: "serverId or serverRoleOrder is missing or invalid" };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User not authenticated" };
        }

        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of the server" };
        }

        const server = await prisma.server.findFirst({
            where: {
                id: serverId,
            },
            include: {
                roles: true
            }
        });

        if (!server) {
            return { success: false, message: "Server not found" };
        }

        const serverRoleIds = server.roles.map((role) => role.id);
        const setA = new Set(serverRoleOrder);
        const setB = new Set(serverRoleIds);
        const difference = [...setA].filter(id => !setB.has(id)).concat([...setB].filter(id => !setA.has(id)));

        if (difference.length !== 0) {
            return { success: false, message: "Invalid role IDs" };
        }

        // Check if the user is authorized (server owner or admin)
        if (server.ownerId === user.id || userServerProfile?.roles.some((role) => role.role.adminPermission)) {
            const reorderServerRole = await prisma.$transaction(
                serverRoleOrder.map((roleId, index) =>
                    prisma.serverRole.update({
                        where: { id: roleId },
                        data: { order: index }
                    })
                )
            );

            return { success: true, reorderServerRole: JSON.parse(JSON.stringify(reorderServerRole)) };
        }

        // If user does not have required permissions, check for 'manageRoles' permissions
        if (!userServerProfile?.roles.length) {
            return { success: false, message: "You are not authorized to reorder roles" };
        }

        if (!userServerProfile.roles.some((role) => role.role.manageRoles)) {
            return { success: false, message: "You are not authorized to reorder roles" };
        }

        const rolesWithManageRole = userServerProfile.roles.filter(role => role.role.manageRoles).sort((a, b) => a.order - b.order)[0];
        const serverRoleOriginalOrder = server.roles.sort((a, b) => a.order - b.order);
        let i = 0;

        // Check if the reorder respects the original role order
        while (i <= rolesWithManageRole.role.order) {
            if (serverRoleOrder[i] !== serverRoleOriginalOrder[i].id) {
                return { success: false, message: "Invalid role IDs" };
            }
            i++;
        }

        // Proceed with role reordering
        const reorderServerRole = await prisma.$transaction(
            serverRoleOrder.map((roleId, index) =>
                prisma.serverRole.update({
                    where: { id: roleId },
                    data: { order: index }
                })
            )
        );

        return { success: true, reorderServerRole: JSON.parse(JSON.stringify(reorderServerRole)) };

    } catch (error) {
        console.error("Error in reorderServerRole:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
};


export const getServerRoleInfo = async (serverId, roleId) => {
    try {
        if (!serverId || !roleId) {
            return { success: false, message: "serverId and roleId is required" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "please login to continue" }
        }

        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            },
            include: {
                roles: {
                    where: {
                        id: roleId
                    }
                }
            }
        });
        if (!server || server.roles.length === 0) {
            return { success: false, message: "server not found or role not found" };
        }

        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                serverId: serverId,
                userId: user.id,
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    },
                    orderBy: {
                        role: {
                            order: "asc"
                        }
                    }
                }
            }
        })
        if (!userServerProfile) {
            return { success: false, message: "user server profile not found" }
        }
        if (user.id == server.ownerId || userServerProfile.roles.some((role) => role.role.adminPermission || role.role.manageRoles)) {
            const role = await prisma.serverRole.findFirst({
                where: {
                    id: roleId,
                },
                include: {
                    UserRoleAssignment: {
                        include: {
                            serverProfile: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            })
            return { success: true, role }
        }
        return { success: false, message: "you do not have permission to view this role" }

    } catch (error) {
        console.error("Error in getServerRoleInfo:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
}

export const getDefaultServerRoleInfo = async (serverId, defaultRoleId) => {
    try {
        if (!serverId || !defaultRoleId) {
            return { success: false, message: "serverId and roleId is required" }
        }
        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "please login to continue" }
        }

        const defaultServerRoleCheck = await prisma.defaultServerRole.findFirst({
            where: {
                id: defaultRoleId,
                serverId: serverId
            }
        })

        if (!defaultServerRoleCheck) {
            return { success: false, message: "server role not found" }
        }

        const server = await prisma.server.findFirst({
            where: {
                id: serverId
            }
        });
        if (!server) {
            return { success: false, message: "server not found or role not found" };
        }

        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                serverId: serverId,
                userId: user.id,
                isDeleted: false
            },
            include: {
                roles: {
                    include: {
                        role: true
                    },
                    orderBy: {
                        role: {
                            order: "asc"
                        }
                    }
                }
            }
        })
        if (!userServerProfile) {
            return { success: false, message: "user server profile not found" }
        }
        if (user.id == server.ownerId || userServerProfile.roles.some((role) => role.role.adminPermission || role.role.manageRoles)) {
            return { success: true, role: defaultServerRoleCheck }
        }
        return { success: false, message: "you do not have permission to view this role" }
    } catch (error) {
        console.error("Error in getDefaultServerRoleInfo:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
}
