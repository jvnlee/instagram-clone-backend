import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(
      async (_, { lastId }, { client, loggedInUser }) =>
        client.photo.findMany({
          where: {
            OR: [
              { user: { followers: { some: { id: loggedInUser.id } } } },
              { userId: loggedInUser.id },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 8,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        })
    ),
  },
};

export default resolvers;
