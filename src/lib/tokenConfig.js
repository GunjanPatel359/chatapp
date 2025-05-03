import jwt from "jsonwebtoken";


export const decodeToken = (token, channelId) => {
  if (!token) return { valid: false, error: "No token provided" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== channelId) {
      return { valid: false, error: "Token does not match channel" };
    }

    return { valid: true, data: decoded };
  } catch (error) {
    console.error("Token verification error:", error.message);
    return { valid: false, error: "Invalid or expired token" };
  }
};


export const generateToken = (channelId, userId, newPermissions, tokenData = null) => {
  try {
    const timestamp = tokenData?.timestamp || Date.now();
    const existingPermissions = tokenData?.permissions || {};

    if (tokenData && (tokenData.userId !== userId || tokenData.id !== channelId)) {
      throw new Error("Token user/channel mismatch");
    }

    const payload = {
      id: channelId,
      userId,
      timestamp,
      permissions: {
        ...existingPermissions,
        ...newPermissions.permission,
      },
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
  } catch (error) {
    console.error("Token generation failed:", error.message);
    throw new Error("Failed to generate token.");
  }
};

// export const removeToken=async(channelId)=>{
//   try{
//     localStorage.removeItem(channelId)
//   } catch (error) {
//     console.error("Error removing token:", error);
//     throw new Error("Failed to remove token.");
//   }
// }