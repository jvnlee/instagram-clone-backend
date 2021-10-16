import { withFilter } from "graphql-subscriptions";
import NEW_MESSAGE from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, { id }, { client, loggedInUser }, info) => {
        const targetRoom = await client.room.findFirst({
          where: {
            id,
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (!targetRoom) {
          throw new Error(
            "The room does not exist, or you might not have an access."
          );
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { client, loggedInUser }) => {
            if (roomUpdates.roomId === id) {
              const targetRoomDoubleCheck = await client.room.findFirst({
                where: {
                  id,
                  users: {
                    some: {
                      id: loggedInUser.id,
                    },
                  },
                },
                select: {
                  id: true,
                },
              });
              return targetRoomDoubleCheck ? true : false;
            }
          }
        )(root, { id }, { client, loggedInUser }, info);
      },
    },
  },
};

export default resolvers;
