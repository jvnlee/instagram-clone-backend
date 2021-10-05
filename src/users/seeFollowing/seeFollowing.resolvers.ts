import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
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
      //Using cursor-based pagination.
      const following = await client.user
        .findUnique({
          where: { username },
        })
        .following({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
      return {
        status: true,
        following,
      };
    },
  },
};

export default resolvers;
