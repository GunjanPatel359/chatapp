"use server"

import { isAuthUser } from "@/lib/authMiddleware"
import prisma from "@/lib/db"

function haveSameElements(arr1, arr2) {
    return arr1.length === arr2.length && new Set(arr1).size === new Set(arr2).size && [...new Set(arr1)].every(x => new Set(arr2).has(x));
}

export const basicCategoryDetails = async (categoryId) => {
    try {
        if (!categoryId) {
            return { success: false, message: "Channel ID is required" };
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            select: {
                name: true
            }
        })
        if (!category) {
            return { success: false, message: "Channel not found" };
        }
        return { success: true, category }
    } catch (error) {
        console.error("Error in basicCategoryDetails:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred" };
    }
}

export const getCategoryData = async (categoryId) => {
    try {
        if (categoryId) {
            return { success: false, message: "categoryid is not provided" }
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
        })
        if (!category) {
            return { success: false, message: "Category not found" };
        }
        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId: category.serverId
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        })
        if (!userServerProfile) {
            return { success: false, message: "User server profile not found" };
        }
        const server = await prisma.server.findFirst({
            where: {
                id: category.serverId
            }
        })
        if (!server) {
            return { success: false, message: "Server not found" };
        }
        if (server.ownerId == user.id || userServerProfile.roles.some((role) => role.role.adminPermission)) {
            return await helperGetCategoryData(categoryId)
        }
        const serverRolesId = userServerProfile.roles.map((role) => role.role.id)
        const categoryCheck = await prisma.category.findFirst({
            where: {
                id: categoryId,
                serverId: category.serverId
            },
            include: {
                categoryRoles: {
                    where: {
                        id: { in: [...serverRolesId] },
                        manageChannels: { in: ["ALLOW", "NEUTRAL"] },
                        manageRoles: { in: ["ALLOW", "NEUTRAL"] }
                    },
                    include: {
                        serverRole: true
                    }
                }
            }
        })
        if (categoryCheck.categoryRoles.some((role) => (role.manageChannels == "ALLOW" || (role.manageChannels == "NEUTRAL" && role.serverRole.manageChannels)) || (role.manageRoles == "ALLOW" || (role.manageRoles == "NEUTRAL" && role.serverRole.manageRoles)))){
            return await helperGetCategoryData(categoryId)
        }
        return { success: false, message: "You do not have permission to view this category" };
    } catch (e) {
        console.error("Error in getCategoryData:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred" };
    }
}

//test needed
export const createCategory = async (serverId, categoryData) => {
    try {
        if (!serverId) return { success: false, message: "Please provide a server ID." };
        if (!categoryData?.name.trim()) return { success: false, message: "Please provide category data with a name." };

        const user = await isAuthUser();
        if (!user) return { success: false, message: "User authentication failed." };

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId: serverId
                },
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) return { success: false, message: "You do not have permission to create a category." };

        const server = await prisma.server.findUnique({
            where: {
                id: serverId,
                serverProfiles: { some: { id: userServerProfile.id } }
            },
            include: {
                categories: true
            }
        });

        if (!server) return { success: false, message: "Server not found." };

        if (server.ownerId !== user.id && !userServerProfile.roles.some(role => role.role.adminPermission || role.role.manageChannels)) {
            return { success: false, message: "You do not have permission to create a category." };
        }

        const category = await prisma.category.create({
            data: {
                name: categoryData.name.trim().toLocaleUpperCase(),
                serverId,
                order: server.categories.length,
                defaultCategoryRole: { create: {} }
            }
        });

        return { success: true, message: "Category created successfully." };

    } catch (error) {
        console.error("Error creating category:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred while creating the category." };
    }
};


// in test
export const updateCategory = async ( categoryId, update) => {
    try {
        if (!categoryId || !update?.name.trim()) {
            return { success: false, message: "serverId and categoryId are required." };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in." };
        }
        
        const cate = await prisma.category.findFirst({
            where: { id: categoryId },
        })
        if (!cate) {
            return { success: false, message: "Category not found" };
        }
        const serverId = cate.serverId

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId
                },
                isDeleted: false
            },
            include: {
                server: true,
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server." };
        }

        const verifyCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
                serverId
            }
        });

        if (!verifyCategory) {
            return { success: false, message: "Category not found." };
        }

        if (userServerProfile.server.ownerId === user.id || userServerProfile.roles.some(item => item.role.adminPermission)) {
            const updatedCategory = await prisma.category.update({
                where: { id: categoryId },
                data: { name: update.name.trim() }
            });

            console.log(updatedCategory);
            return { success: true, message: "Category updated successfully." };
        }

        return { success: false, message: "You do not have permission to update this category." };

    } catch (error) {
        console.error("Error updating category:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred while updating the category." };
    }
};


export const deleteCategory = async (serverId, categoryId) => {
    try {
        if (!serverId || !categoryId) {
            return { success: false, message: "serverId and categoryId are required." };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not logged in." };
        }

        const userServerProfile = await prisma.serverProfile.findUnique({
            where: {
                userId_serverId: {
                    userId: user.id,
                    serverId
                },
                isDeleted: false
            },
            include: {
                server: true,
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You are not a member of this server." };
        }

        const verifyCategory = await prisma.category.findUnique({
            where: { id: categoryId, serverId }
        });

        if (!verifyCategory) {
            return { success: false, message: "Category not found." };
        }

        if (userServerProfile.server.ownerId === user.id || userServerProfile.roles.some(item => item.role.adminPermission)) {
            const deletedCategory = await prisma.$transaction(async (prisma) => {
                // Step 1: Delete the category
                const deletedCategory = await prisma.category.delete({
                    where: { id: categoryId }
                });

                // Step 2: Fetch all remaining categories ordered by their current 'order' field
                const server = await prisma.server.findFirst({
                    where: { id: serverId },
                    select: {
                        categories: {
                            where: { serverId },
                            orderBy: { order: 'asc' }, // Sort categories by the 'order' field
                            select: {
                                id: true,
                                order: true
                            }
                        }
                    }
                });

                // Ensure categories are available
                const remainingCategories = server?.categories || [];

                // Step 3: Reorder the categories based on their new positions
                for (let i = 0; i < remainingCategories.length; i++) {
                    await prisma.category.update({
                        where: { id: remainingCategories[i].id },
                        data: { order: i } // Update the 'order' field for each category
                    });
                }

                // Return the result after the transaction
                console.log("Category deleted and order updated successfully.");
                return { success: true, message: "Category deleted and order updated successfully." };
            });
        }

        return { success: false, message: "You do not have permission to delete this category." };

    } catch (error) {
        console.error("Error deleting category:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred while deleting the category." };
    }
};


export const getCategory = async (serverId) => {
    try {
        if (!serverId) {
            return { success: false, message: "Server ID is required." };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "You are not authenticated." };
        }

        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You don't have permission to access this server." };
        }

        const server = await prisma.server.findFirst({
            where: { id: serverId },
            include: {
                categories: {
                    orderBy: { order: "asc" }
                }
            }
        });

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        if (server.ownerId === user.id || userServerProfile.roles.some(role => role.role.adminPermission)) {
            return { success: true, categories: JSON.parse(JSON.stringify(server.categories)) };
        }

        return { success: false, message: "You do not have permission to access categories." };

    } catch (error) {
        console.error("Error fetching categories:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred while fetching categories." };
    }
};


export const reorderCategory = async (serverId, categoryOrder) => {
    try {
        if (!serverId || !Array.isArray(categoryOrder) || categoryOrder.length === 0) {
            return { success: false, message: "Server ID and a valid category order array are required." };
        }

        const user = await isAuthUser();
        if (!user) {
            return { success: false, message: "User not found." };
        }

        const userServerProfile = await prisma.serverProfile.findFirst({
            where: {
                userId: user.id,
                serverId,
                isDeleted: false
            },
            include: {
                roles: { include: { role: true } }
            }
        });

        if (!userServerProfile) {
            return { success: false, message: "You don't have permission to access this server." };
        }

        const server = await prisma.server.findFirst({
            where: { id: serverId },
            include: { categories: true }
        });

        if (!server) {
            return { success: false, message: "Server not found." };
        }

        const categoryIds = server.categories.map((item) => item.id);
        const valid = haveSameElements(categoryIds, categoryOrder);
        if (!valid) {
            return { success: false, message: "Invalid categories provided for reordering." };
        }

        if (server.ownerId !== user.id && !userServerProfile.roles.some((role) => role.role.adminPermission)) {
            return { success: false, message: "You don't have permission to reorder categories." };
        }

        const serverCategoryReorder = await prisma.$transaction(async (prisma) => {

            // Step 2: Create a map of categoryId to order index based on the provided categoryOrder
            const newOrderMap = categoryOrder.map((categoryId, index) => ({
                categoryId,
                order: index,
            }));

            // Step 3: Update each category’s order based on the new order map
            const updateCategoryPromises = newOrderMap.map(({ categoryId, order }) => {
                return prisma.category.update({
                    where: { id: categoryId },
                    data: { order },
                });
            });

            // Step 4: Execute all the update operations in a single transaction
            await Promise.all(updateCategoryPromises);

            // Step 5: Optionally, you can return the result if needed
            return { success: true, message: "Categories reordered successfully" };
        });


        return { success: true, message: "Categories reordered successfully.", reorderCategory: JSON.parse(JSON.stringify(serverCategoryReorder)) };

    } catch (error) {
        console.error("Error reordering categories:", error?.message || error);
        return { success: false, message: error?.message || "An unexpected error occurred while reordering categories." };
    }
};


const helperGetCategoryData = async(categoryId) => {
    const category=await prisma.category.findFirst({
        where: {
            id: categoryId
        }
    })
    return {success:true,category}
}

export const getCategoryInfo = async (categoryId) => {
    try {
        if (!categoryId) {
            return { success: false, message: "Category ID is required" };
        }
        const user = await isAuthUser()
        if (!user) {
            return { success: false, message: "You are not logged in" };
        }
        const category = await prisma.category.findFirst({
            where: { id: categoryId },
            select: {
                id: true,
                name: true
            }
        })
        if (!category) {
            return { success: false, message: "Category not found" };
        }
        return { success: true, category };
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}