import { PrismaClient } from ".prisma/client";
import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const protectedResolver =
  (resolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      return {
        status: false,
        error: "Please login to execute this action.",
      };
    }
    return resolver(root, args, context, info);
  };

export const handleNoUserError = async (
  client: PrismaClient,
  username: string
) => {
  const findUser = await client.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!findUser) {
    return {
      status: false,
      error: "Username does not exist. Try with someone with a valid username.",
    };
  }
};
