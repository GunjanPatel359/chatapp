"use server";
import prisma from "./db";

import { auth } from "@clerk/nextjs/server";

const isAuthUser = async () => {
  try {
    const user = await auth();
    if (!user) {
      throw new Error("user is unauthenticated");
    }
    const userData = await prisma.user.findFirst({
      where: {
        email: user.sessionClaims.email,
      },
    });
    if (!userData) {
      const newUser = await prisma.user.create({
        data: {
          email: user.sessionClaims.email,
          username: user.sessionClaims.username,
        },
      });
      return newUser;
    }
    return userData;
  } catch (error) {
    throw new Error(error);
  }
};

export { isAuthUser };
