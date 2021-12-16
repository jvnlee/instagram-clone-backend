import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    readMessage: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const targetRoom = await client.room.findFirst({
          where: {
            id,
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        });
        if (!targetRoom) return { status: false, error: "Room doesn't exist" };
        // Read all messages as soon as the user enter the room.
        await client.message.updateMany({
          where: {
            roomId: id,
            userId: {
              not: loggedInUser.id,
            },
          },
          data: {
            isRead: true,
          },
        });

        return { status: true };

        // const targetMessage = await client.message.findFirst({
        //   where: {
        //     id,
        //     userId: {
        //       not: loggedInUser.id,
        //     },
        //     room: {
        //       users: {
        //         some: {
        //           id: loggedInUser.id,
        //         },
        //       },
        //     },
        //   },
        //   select: {
        //     id: true,
        //   },
        // });
        // if (!targetMessage) {
        //   return {
        //     status: false,
        //     error: "Message not found.",
        //   };
        // }
        // await client.message.update({
        //   where: {
        //     id,
        //   },
        //   data: {
        //     isRead: true,
        //   },
        // });
        // return { status: true };
      }
    ),
  },
};

export default resolvers;
