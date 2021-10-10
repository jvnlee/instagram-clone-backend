import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: (_, { id, lastId }, { client }) =>
      client.comment.findMany({
        where: { photoId: id },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: {
          createdAt: "asc",
        },
      }),
  },
};

export default resolvers;
