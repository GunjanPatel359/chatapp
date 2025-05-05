"use server";
import prisma from "./db";
import { auth } from "@clerk/nextjs/server";

const isAuthUser = async () => {
  try {
    const user = await auth();

    if (!user || !user.sessionClaims?.email || !user.sessionClaims?.username) {
      throw new Error("User is unauthenticated or missing required fields.");
    }

    const email = user.sessionClaims.email;
    const username = user.sessionClaims.username;

    // Check if user exists
    let userData = await prisma.user.findUnique({
      where: { email }, // More efficient than `findFirst` with unique
    });

    // Create new user if not exists
    if (!userData) {
      userData = await prisma.user.create({
        data: { email, username },
      });
    }

    return userData;
  } catch (error) {
    console.error("[isAuthUser ERROR]", error);
    throw new Error("Authentication failed");
  }
};

export { isAuthUser };
