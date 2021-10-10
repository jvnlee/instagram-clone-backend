import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { client, loggedInUser }) => {
        const exists = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        if (!exists) {
          return {
            status: false,
            error: "Photo not found.",
          };
        }
        await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        return { status: true };
      }
    ),
  },
};

export default resolvers;
