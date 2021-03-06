import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => id === loggedInUser?.id,
    isFollowing: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      //exists will be either 0 or 1.
      return Boolean(exists);
    },
    photos: ({ id }, _, { client }) =>
      client.photo.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
      }),
  },
};

export default resolvers;
