import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleFollow: protectedResolver(
      async (_, { username }, { client, loggedInUser }) => {
        const target = await client.user.findUnique({
          where: { username },
          select: { id: true, followers: true },
        });
        if (!target) {
          return {
            status: false,
            error:
              "User does not exist. Try with someone with a valid username.",
          };
        }
        const following = await client.user.count({
          where: {
            id: target.id,
            followers: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        });
        if (following) {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              following: {
                disconnect: {
                  username,
                },
              },
            },
          });
        } else {
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              following: {
                connect: {
                  username,
                },
              },
            },
          });
        }
        return { status: true, isFollowing: !following };
      }
    ),
  },
};

export default resolvers;
