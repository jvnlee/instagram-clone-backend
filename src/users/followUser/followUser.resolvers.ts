import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        const findUser = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!findUser) {
          return {
            status: false,
            error:
              "Username does not exist. Try with someone with a valid username.",
          };
        }
        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              connect: {
                username,
              },
            },
          },
        });
        return {
          status: true,
        };
      }
    ),
  },
};

export default resolvers;
