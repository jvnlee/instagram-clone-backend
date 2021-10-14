import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Message: {
    user: ({ id }, _, { client }) =>
      client.message.findUnique({ where: { id } }).user(),
  },
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
    unreadNum: ({ id }, _, { client, loggedInUser }) =>
      loggedInUser
        ? client.message.count({
            where: {
              isRead: false,
              roomId: id,
              user: {
                id: {
                  not: loggedInUser.id,
                },
              },
            },
          })
        : 0,
  },
};

export default resolvers;
