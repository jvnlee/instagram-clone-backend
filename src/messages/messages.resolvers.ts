import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id }, _, { client }) =>
      client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }, { lastId }, { client }) =>
      client.message.findMany({
        where: { roomId: id },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: lastId }),
        orderBy: {
          createdAt: "desc",
        },
      }),
  },
};

export default resolvers;
