import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { client, loggedInUser }) => {
        let chatroom = null;
        if (userId) {
          // Case 1: When sending a message to a user for the first time. (Find the target user, then create a room)
          const targetUser = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!targetUser) {
            return {
              status: false,
              error: "User not found.",
            };
          }
          chatroom = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  {
                    id: loggedInUser.id,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          // Case 2: When sending a message to a user that we already have a room with. (Find the room)
          chatroom = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });
          if (!chatroom) {
            return {
              status: false,
              error: "Cannot send message.",
            };
          }
        }
        // Going through either Case 1 or 2, we have a specific room. Now create the new message in that room.
        const newMsg = await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: chatroom.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        console.log(newMsg);
        return {
          status: true,
        };
      }
    ),
  },
};

export default resolvers;
