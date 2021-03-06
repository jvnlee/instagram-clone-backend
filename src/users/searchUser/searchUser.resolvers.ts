import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchUser: async (_, { keyword, lastId }, { client }) => {
      if (keyword.length === 0) return;
      const searchResult = await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: {
          username: "asc",
        },
      });
      if (searchResult.length === 0) {
        return {
          error: "No matching results.",
        };
      }
      return { searchResult };
    },
  },
};

export default resolvers;
