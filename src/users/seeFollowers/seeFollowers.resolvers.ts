import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
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
      // Using offset pagination.
      const followers = await client.user
        .findUnique({
          where: { username },
        })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        status: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};

export default resolvers;
