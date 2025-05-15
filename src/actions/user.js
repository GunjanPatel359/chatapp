"use server";

import { UTApi } from "uploadthing/server";
import prisma from "@/lib/db";
import { isAuthUser } from "@/lib/authMiddleware";
import { decodeToken, generateToken } from "@/lib/tokenConfig";

export const handleGetServerCategoryAndChannels = async (serverId,userServerProfile) => {
  try {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            channels: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!server) return { success: false, message: "Server not found" };
    const { roles, ...validServerProfile } = userServerProfile;
    return { success: true, server: JSON.parse(JSON.stringify(server)),userServerProfile:validServerProfile };
  } catch (error) {
    console.error("[handleGetServerCategoryAndChannels ERROR]", error);
    return { success: false, message: "Internal server error" };
  }
};

export const getAllUserJoinedServer = async () => {
  try {
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "Please login to continue" };
    }
    const joinedServer = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      include: {
        serverProfiles: {
          include: {
            server: true,
          },
        },
      },
    });
    return {
      success: true,
      joinedServer: JSON.parse(JSON.stringify(joinedServer.serverProfiles)),
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//improvement needed
// export const getServer = async (serverId) => {
//   try {
//     if (!serverId) {
//       return { success: false, message: "Please provide a server id" };
//     }
//     const user = await isAuthUser();
//     if (!user) {
//       return { success: false, message: "Please login to continue" };
//     }
//     console.log(user);
//     const userServerProfile = await prisma.serverProfile.findFirst({
//       where: {
//         userId: user.id,
//         serverId: serverId,
//         isDeleted: false,
//       },
//       include: {
//         roles: {
//           include: {
//             role: true,
//           },
//         },
//         server: true,
//       },
//     });
//     console.log(userServerProfile);
//     if (!userServerProfile) {
//       return { success: false, message: "You are not a member of this server" };
//     }
//     if (userServerProfile.server.ownerId == user.id) {
//       return await handleGetServerCategoryAndChannels(serverId);
//     }
//     const isAdmin = userServerProfile.roles.some(
//       (role) => role.role.adminPermission
//     );
//     if (isAdmin) {
//       return await handleGetServerCategoryAndChannels(serverId);
//     }
//     const userServerRoles = userServerProfile.roles.map((role) => role.roleId);
//     let server = await prisma.server.findFirst({
//       where: {
//         id: serverId,
//       },
//       include: {
//         categories: {
//           include: {
//             channels: {
//               include: {
//                 channelRoles: {
//                   where: {
//                     serverRoleId: {
//                       in: userServerRoles,
//                     },
//                   },
//                 },
//                 defaultChannelRole: true,
//               },
//               orderBy: { order: "asc" },
//             },
//             categoryRoles: {
//               where: {
//                 serverRoleId: {
//                   in: userServerRoles,
//                 },
//               },
//             },
//             defaultCategoryRole: true,
//           },
//           orderBy: { order: "asc" },
//         },
//       },
//     });

//     server.categories = server.categories.filter((category) => {
//       category.channels = category.channels.filter((channel) => {
//         if (channel.defaultChannelRole.viewChannel) {
//           return channel;
//         }
//         if (
//           channel.channelRoles.some(
//             (chanRole) =>
//               chanRole.viewChannel === "ALLOW" ||
//               (chanRole.viewChannel === "NEUTRAL" &&
//                 (category.categoryRoles?.some(
//                   (catRole) => catRole.serverRoleId == chanRole.serverRoleId
//                 )
//                   ? category.categoryRoles.some(
//                     (cateRole) =>
//                       cateRole.serverRoleId === chanRole.serverRoleId &&
//                       (cateRole.viewChannel === "ALLOW" ||
//                         (cateRole.viewChannel === "NEUTRAL" &&
//                           userServerProfile.roles.some(
//                             (serRole) =>
//                               serRole.roleId === chanRole.serverRoleId &&
//                               serRole.role.viewChannel
//                           )))
//                   )
//                   : userServerProfile.roles.some(
//                     (serRole) =>
//                       serRole.roleId === chanRole.serverRoleId &&
//                       serRole.role.viewChannel
//                   )))
//           )
//         ) {
//           return channel;
//         }
//       });
//       // if (category.channels != []) {
//       //     return category.channels
//       // }
//       if (category.defaultCategoryRole.viewChannel) {
//         return category.channels;
//       }
//       if (
//         category.categoryRoles.some(
//           (catRol) =>
//             catRol.viewChannel == "ALLOW" ||
//             (catRol.viewChannel == "NEUTRAL" &&
//               userServerProfile.roles.find(
//                 (role) =>
//                   role.role.viewChannel && role.roleId == catRol.serverRoleId
//               ))
//         )
//       ) {
//         return category.channels;
//       }
//     });

//     return { success: true, server: JSON.parse(JSON.stringify(server)) };
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

// export const getChannel = async (channelId) => {
//   try {
//     if (!channelId) {
//       return { success: false, message: "Channel ID is required" };
//     }
//     const user = await isAuthUser();
//     if (!user) {
//       return { success: false, message: "Please login to continue" };
//     }
//     const channel = await prisma.channel.findUnique({
//       where: {
//         id: channelId,
//       },
//     });
//     if (!channel) {
//       return { success: false, message: "Channel not found" };
//     }
//     return { success: true, channel: JSON.parse(JSON.stringify(channel)) };
//   } catch (error) {
//     console.log(error);
//     throw new Error(`getChannel: ${error}`);
//   }
// };

// ✅ Get the server with its categories, channels, and roles
export const getServer = async (serverId) => {
  try {
    if (!serverId) {
      return { success: false, message: "Please provide a server id" };
    }

    // Check if the user is authenticated
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "Please login to continue" };
    }

    // Fetch the user's server profile for the given serverId
    const userServerProfile = await prisma.serverProfile.findFirst({
      where: {
        userId: user.id,
        serverId,
        isDeleted: false,
      },
      include: {
        roles: { include: { role: true } },
        server: true,
      },
    });

    if (!userServerProfile) {
      return { success: false, message: "You are not a member of this server" };
    }

    // If the user is the server owner or has admin permission, fetch all categories and channels
    if (userServerProfile.server.ownerId === user.id || userServerProfile.roles.some((role) => role.role.adminPermission)) {
      return await handleGetServerCategoryAndChannels(serverId,userServerProfile);
    }

    // Otherwise, filter categories and channels based on the user's roles
    const userServerRoles = userServerProfile.roles.map((role) => role.roleId);

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        categories: {
          include: {
            channels: {
              include: {
                channelRoles: {
                  where: { serverRoleId: { in: userServerRoles } },
                },
                defaultChannelRole: true,
              },
              orderBy: { order: "asc" },
            },
            categoryRoles: {
              where: { serverRoleId: { in: userServerRoles } },
            },
            defaultCategoryRole: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!server) {
      return { success: false, message: "Server not found" };
    }

    // Filter out channels and categories the user does not have permission to view
    server.categories = server.categories.filter((category) => {
      category.channels = category.channels.filter((channel) => {
        const canViewChannel =
          channel.defaultChannelRole.viewChannel ||
          channel.channelRoles.some(
            (chanRole) =>
              chanRole.viewChannel === "ALLOW" ||
              (chanRole.viewChannel === "NEUTRAL" &&
                userServerProfile.roles.some(
                  (role) => role.roleId === chanRole.serverRoleId && role.role.viewChannel
                ))
          );
        return canViewChannel;
      });

      return (
        category.defaultCategoryRole.viewChannel ||
        category.categoryRoles.some(
          (catRole) =>
            catRole.viewChannel === "ALLOW" ||
            (catRole.viewChannel === "NEUTRAL" &&
              userServerProfile.roles.some(
                (role) => role.roleId === catRole.serverRoleId && role.role.viewChannel
              ))
        )
      );
    });
    const { roles, ...validServerProfile } = userServerProfile;
    return { success: true, server: JSON.parse(JSON.stringify(server)), userServerProfile:validServerProfile };
  } catch (error) {
    console.log("[getServer ERROR]", error);
    return { success: false, message: "Internal server error" };
  }
};

// ✅ Get the channel details based on channelId
export const getChannel = async (channelId) => {
  try {
    if (!channelId) {
      return { success: false, message: "Channel ID is required" };
    }

    // Check if the user is authenticated
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "Please login to continue" };
    }

    // Fetch the channel details
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      return { success: false, message: "Channel not found" };
    }

    return { success: true, channel: JSON.parse(JSON.stringify(channel)) };
  } catch (error) {
    console.log("[getChannel ERROR]", error);
    return { success: false, message: "Failed to fetch channel" };
  }
};

//
// export const serverSettingFetch = async (serverId) => {
//   try {
//     if (!serverId) {
//       return { success: false, message: "Please provide a server id" };
//     }
//     const user = await isAuthUser();
//     if (!user) {
//       return { success: false, message: "Please login to continue" };
//     }
//     let serverSetting = await prisma.serverProfile.findFirst({
//       where: {
//         serverId: serverId,
//         userId: user.id,
//         isDeleted: false,
//       },
//       include: {
//         roles: {
//           include: {
//             role: true,
//           },
//         },
//         server: true,
//       },
//     });
//     if (!serverSetting) {
//       return { success: false, message: "Server setting not found" };
//     }
//     if (serverSetting.server.ownerId == user.id) {
//       return {
//         success: true,
//         serverSetting: JSON.parse(JSON.stringify(serverSetting)),
//         user: JSON.parse(JSON.stringify(user)),
//       };
//     }
//     serverSetting.roles = serverSetting.roles.sort(
//       (a, b) => a.role.order - b.role.order
//     );
//     const isVerifiedToLook = serverSetting.roles.some(
//       (role) => role.role.adminPermission || role.role.manageRoles
//     );
//     if (!isVerifiedToLook) {
//       return {
//         success: false,
//         message: "You don't have permission to view this server",
//       };
//     }
//     return {
//       success: true,
//       serverSetting: JSON.parse(JSON.stringify(serverSetting)),
//       user: JSON.parse(JSON.stringify(user)),
//     };
//   } catch (error) {
//     console.log(error);
//     throw new Error(`serverSettingFetch: ${error}`);
//   }
// };

// ✅ Fetch server settings with permissions check
export const serverSettingFetch = async (serverId) => {
  try {
    if (!serverId) return { success: false, message: "Please provide a server id" };

    const user = await isAuthUser();
    if (!user) return { success: false, message: "Please login to continue" };

    // Fetch user server settings and roles
    let serverSetting = await prisma.serverProfile.findFirst({
      where: { serverId, userId: user.id, isDeleted: false },
      include: {
        roles: { include: { role: true } },
        server: true,
      },
    });

    if (!serverSetting) return { success: false, message: "Server setting not found" };

    // If user is the server owner, return server settings
    if (serverSetting.server.ownerId === user.id) {
      return {
        success: true,
        serverSetting: serverSetting,
        user: user,
      };
    }

    // Sort roles by order
    serverSetting.roles = serverSetting.roles.sort((a, b) => a.role.order - b.role.order);

    // Check if user has permission to view the server settings
    const hasPermission = serverSetting.roles.some(
      (role) => role.role.adminPermission || role.role.manageRoles
    );

    if (!hasPermission) {
      return { success: false, message: "You don't have permission to view this server" };
    }

    return { success: true, serverSetting: serverSetting, user: user };
  } catch (error) {
    console.log("[serverSettingFetch ERROR]", error);
    return { success: false, message: "An error occurred while fetching server settings" };
  }
};

export const updateUserImage = async (formData) => {
  try {
    if (!formData) return { success: false, message: "No image provided" };

    const file = formData.get("file");
    if (!file) return { success: false, message: "No image provided" };

    const user = await isAuthUser();
    if (!user) return { success: false, message: "User not found" };

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: "Invalid file type. Only PNG, JPG, and JPEG are allowed." };
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      return { success: false, message: "File size exceeds the 1MB limit" };
    }

    const utapi = new UTApi();
    const response = await utapi.uploadFiles(file);

    if (response?.error) {
      return { success: false, message: response.error || "Failed to upload the file" };
    }

    const img_url = response?.data?.url;
    if (!img_url) {
      return { success: false, message: "Image upload failed, no URL returned" };
    }

    // Delete old avatar if it exists
    if (user?.avatarUrl) {
      await utapi.deleteFiles(user.avatarUrl);
    }

    // Update user avatar URL in the database
    const userUpdate = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: img_url },
    });

    if (!userUpdate) {
      return { success: false, message: "Failed to update user image" };
    }

    return { success: true, url: img_url };
  } catch (error) {
    console.log("[updateUserImage ERROR]", error);
    return { success: false, message: "An error occurred while updating the user image" };
  }
};


export const updateUserBanner = async (formData) => {
  try {
    if (!formData) {
      return { success: false, message: "No image provided" };
    }
    const file = formData.get("file");
    if (!file) {
      return { success: false, message: "No image provided" };
    }
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
      };
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      return { success: false, message: "File size exceeds the 1MB limit" };
    }
    const utapi = new UTApi();
    const response = await utapi.uploadFiles(file);
    if (!response) {
      return { success: false, message: "failed to upload the file" };
    }
    if (response.error) {
      return { success: false, message: response.error };
    }
    console.log(response);
    let img_url = response.data.url;
    console.log("Image URL:", img_url);
    const userUpdate = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        bannerUrl: img_url,
      },
    });
    if (!userUpdate) {
      return { success: false, message: "Failed to update banner" };
    }
    console.log(userUpdate);
    return { success: true, url: img_url };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateUserProfile = async (displayName, pronoun, description) => {
  try {

    // Fetch the authenticated user
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Update user profile in the database
    const userUpdate = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        displayName,
        pronoun,
        description,
      },
    });

    // Check if update was successful
    if (!userUpdate) {
      return { success: false, message: "Failed to update user profile" };
    }

    return { success: true, message: "Profile successfully updated" };
  } catch (error) {
    // Log the error for troubleshooting
    console.error("[updateUserProfile ERROR]", error);
    return { success: false, message: "An error occurred while updating the profile" };
  }
};


export const checkChannelViewPermission = async (channelId, token = null) => {
  try {
    if (!channelId) {
      return { success: false, message: "Channel ID is required" };
    }
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        category: true,
        updatedAt: true,
      },
    });
    if (!channel) {
      return { success: false, message: "Channel not found" };
    }
    let tokenData = null;
    // if (token) {
    //     tokenData = decodeToken(token, channelId)
    // if (tokenData.valid && tokenData.data.userId == user.id) {
    //     if (tokenData.data.timestamp > channel.updatedAt) {
    //         const checkPermission = tokenData.data.permissions.admin || tokenData.data.permissions.viewChannel
    //         if (checkPermission) {
    //             await dbHelperTokenCreateMessage(channelId, user, serverId);
    //             return { success: true, message: "Message sent successfully." };
    //         }
    //     }
    // }
    // }
    const serverId = channel.category.serverId;
    const userServerProfile = await prisma.serverProfile.findFirst({
      where: {
        userId: user.id,
        serverId: serverId,
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
      return { success: false, message: "User not found in server" };
    }
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
      },
    });
    if (
      server.ownerId == user.id ||
      userServerProfile.roles.some((role) => role.role.adminPermission)
    ) {
      const newToken = await generateToken(
        channelId,
        user.id,
        { permission: { viewChannel: true } },
        tokenData?.data
      );
      return {
        success: true,
        message: "You have permission to view this channel",
        token: { [channelId]: newToken },
      };
    }
    const userServerRoleIds = userServerProfile.roles.map(
      (role) => role.roleId
    );
    const channelWithRoles = await prisma.channel.findFirst({
      where: { id: channelId },
      include: {
        category: {
          include: {
            categoryRoles: {
              where: { id: { in: userServerRoleIds } },
            },
            server: { include: { defaultServerRole: true } },
            defaultCategoryRole: true,
          },
        },
        channelRoles: {
          where: { id: { in: userServerRoleIds } },
          include: { serverRole: true },
        },
        defaultChannelRole: true,
      },
    });

    const checkPermission = checkViewChannelPermission(channelWithRoles);
    if (checkPermission) {
      const newToken = await generateToken(
        channelId,
        user.id,
        { permission: { viewChannel: true } },
        tokenData?.data
      );
      return {
        success: true,
        message: "You have permission to view this channel",
        token: { [channelId]: newToken },
      };
    }

    return {
      success: false,
      message: "You do not have permission to view this channel",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserProfile = async () => {
  try {
    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user };
  } catch (e) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserServerProfileList = async () => {
  try {
    const user = await isAuthUser()
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const serverProfileList = await prisma.user.findFirst({
      where: {
        id: user.id
      },
      include: {
        serverProfiles: {
          select: {
            id: true,
            server: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (!serverProfileList) {
      return { success: false, message: "User not found" };
    }

    const serverProfile = await prisma.serverProfile.findFirst({
      where: {
        id: serverProfileList.serverProfiles[0].id
      },
      include: {
        server: {
          select: {
            name: true
          }
        }
      }
    })
    return { success: true, serverList: serverProfileList.serverProfiles, serverProfile };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getUserServerProfile = async (serverProfileId) => {
  try {

    const user = await isAuthUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const serverProfile = await prisma.serverProfile.findFirst({
      where: {
        id: serverProfileId,
        userId: user.id
      }
    })
    if (!serverProfile) {
      return { success: false, message: "Server Profile not found" };
    }
    return { success: true, serverProfile };
  } catch (e) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateUserServerProfileImage = async (serverProfileId, formData) => {
  try {
    if (!serverProfileId) {
      return { success: false, message: "Server Profile not found" };
    }
    if (!formData) {
      return { success: false, message: "No image provided" };
    }
    const file = formData.get("file");
    if (!file) {
      return { success: false, message: "No image provided" };
    }
    const user = await isAuthUser()
    if (!user) {
      return { success: false, message: "User not found" }
    }

    const userServerProfile = await prisma.serverProfile.findFirst({
      where: {
        id: serverProfileId,
        userId: user.id
      }
    })

    if (!userServerProfile) {
      return { success: false, message: "Server Profile not found" };
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
      };
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      return { success: false, message: "File size exceeds the 1MB limit" };
    }
    const utapi = new UTApi();
    const response = await utapi.uploadFiles(file);
    if (!response) {
      return { success: false, message: "failed to upload the file" };
    }
    if (response.error) {
      return { success: false, message: response.error };
    }
    console.log(response);
    let img_url = response.data.url;
    console.log("Image URL:", img_url);

    if (userServerProfile?.avatarUrl) {
      await utapi.deleteFiles(userServerProfile.avatarUrl)
    }

    const updatedProfile = await prisma.serverProfile.update({
      where: {
        id: serverProfileId,
        userId: user.id
      },
      data: {
        imageUrl: img_url
      }
    })
    return { success: true, message: "Avatar updated successfully" };

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const updateUserServerBannerImage = async (serverProfileId, formData) => {
  try {
    if (!serverProfileId) {
      return { success: false, message: "Server Profile not found" };
    }
    if (!formData) {
      return { success: false, message: "No image provided" };
    }
    const file = formData.get("file");
    if (!file) {
      return { success: false, message: "No image provided" };
    }
    const user = await isAuthUser()
    if (!user) {
      return { success: false, message: "User not found" }
    }

    const userServerProfile = await prisma.serverProfile.findFirst({
      where: {
        id: serverProfileId,
        userId: user.id
      }
    })

    if (!userServerProfile) {
      return { success: false, message: "Server Profile not found" };
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
      };
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      return { success: false, message: "File size exceeds the 1MB limit" };
    }
    const utapi = new UTApi();
    const response = await utapi.uploadFiles(file);
    if (!response) {
      return { success: false, message: "failed to upload the file" };
    }
    if (response.error) {
      return { success: false, message: response.error };
    }
    console.log(response);
    let img_url = response.data.url;
    console.log("Image URL:", img_url);

    if (userServerProfile?.bannerUrl) {
      await utapi.deleteFiles(userServerProfile.bannerUrl)
    }

    const updatedProfile = await prisma.serverProfile.update({
      where: {
        id: serverProfileId,
        userId: user.id
      },
      data: {
        bannerUrl: img_url
      }
    })
    return { success: true, message: "Banner updated successfully" };

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const updateUserServerProfileDetails = async (serverProfileId,name,pronoun,description) => {
  try {
    const user = await isAuthUser()
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const serverProfile = await prisma.serverProfile.update({
      where: {
        id: serverProfileId,
        userId: user.id
      },
      data:{
        name:name || "",
        pronoun:pronoun || "",
        description:description || "",
      }
    })
    if(!serverProfile){
      return { success: false, message: "Server Profile not found" };
    }
    return { success: true, message: "Server Profile updated successfully" };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// helper functions

// Helper function to check view channel permissions
const checkViewChannelPermission = (channelWithRoles) => {
  // Check if the user has permission to send messages in the channel
  const hasPermission =
    channelWithRoles.defaultChannelRole.viewChannel === "ALLOW" ||
    (channelWithRoles.defaultChannelRole.viewChannel === "NEUTRAL" &&
      (channelWithRoles.category.defaultCategoryRole.viewChannel === "ALLOW" ||
        channelWithRoles.category.server.defaultServerRole.viewChannel));

  // Check if user has any custom channel role allowing sendMessage
  const hasCustomRolePermission = channelWithRoles.channelRoles.some((role) => {
    if (role.viewChannel === "ALLOW") return true;
    if (role.viewChannel === "NEUTRAL") {
      const categoryRole = channelWithRoles.category.categoryRoles.find(
        (categoryRole) => categoryRole.serverRoleId === role.serverRoleId
      );
      if (categoryRole) {
        return (
          categoryRole.viewChannel === "ALLOW" ||
          (categoryRole.viewChannel === "NEUTRAL" &&
            role.serverRole.viewChannel)
        );
      }
    }
    return false;
  });

  return hasPermission || hasCustomRolePermission;
};
