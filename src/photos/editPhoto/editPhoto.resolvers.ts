import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import photosTypeDefs from "../photos.typeDefs";
import { formatHashtags } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const originalPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });
        if (!originalPhoto) {
          return {
            status: false,
            error: "You do not have an access to edit this photo.",
          };
        }
        await client.photo.update({
          where: {
            id,
          },
          data: {
            caption,
            hashtags: {
              disconnect: originalPhoto.hashtags,
              connectOrCreate: formatHashtags(caption),
            },
          },
        });
        return {
          status: true,
        };
      }
    ),
  },
};

export default resolvers;
