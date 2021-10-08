import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const existingPhoto = await client.photo.findUnique({ where: { id } });
      if (!existingPhoto) {
        return {
          status: false,
          error: "Photo not found",
        };
      }
      const likeFilter = {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      };
      const isLiked = await client.like.findUnique({
        where: likeFilter,
      });
      if (isLiked) {
        await client.like.delete({
          where: likeFilter,
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            photo: {
              connect: {
                id: existingPhoto.id,
              },
            },
          },
        });
      }
      return {
        status: true,
      };
    }),
  },
};

export default resolvers;
