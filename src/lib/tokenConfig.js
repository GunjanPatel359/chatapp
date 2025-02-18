import jwt from "jsonwebtoken";


export const decodeToken = (token,channelId) => {
  try {
    if (!token) {
      return { valid: false, error: "No token found" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded.id!=channelId){
      return { valid: false, error: "invalid token" };
    }

    return { valid: true, data: decoded };
  } catch (error) {
    console.log(error.message)
    console.error("Token verification failed:", error.message);
    return { valid: false, error: error.message };
  }
};

export const generateOneTimeToken = async(channelId, userId, newPermissions)=>{
  try {
    let payload = { userId, permissions: newPermissions, timestamp: Date.now(),id:channelId };

    const updatedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log(updatedToken)
    return updatedToken;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token.");
  }
}

export const generateToken = async (channelId, userId, newPermissions,tokenData=null) => {
  try {
    let payload = { userId, permissions: {}, timestamp: Date.now(),id:channelId };

    // 🔹 If token exists, decode and merge permissions
    if (tokenData) {
      try {
        const decoded = tokenData

        // ✅ Ensure the user ID matches
        if (decoded.userId !== userId && decoded.id!=channelId) {
          throw new Error("Token user mismatch.");
        }

        // ✅ Preserve old timestamp & merge permissions
        payload.timestamp = decoded.timestamp || Date.now();
        payload.permissions = { ...decoded.permissions, ...newPermissions };
      } catch (error) {
        console.error("Invalid or expired token, generating a new one.");
      }
    } else {
      // If no token exists, set the current timestamp
      payload.timestamp = Date.now();
      payload.permissions = newPermissions;
    }

    // 🔹 Generate a new JWT with updated permissions
    const updatedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15d" });
    console.log(updatedToken)
    return updatedToken;
  } catch (error) {
    console.error("Error generating token:", error);
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