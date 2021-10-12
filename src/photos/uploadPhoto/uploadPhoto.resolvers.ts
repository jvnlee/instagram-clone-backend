import { GraphQLUpload } from "graphql-upload";
import { uploadToAWS } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { formatHashtags } from "../photos.utils";

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { client, loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          hashtagObj = formatHashtags(caption);
        }
        const fileUrl = await uploadToAWS(file, loggedInUser.id, "uploads");
        return client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      }
    ),
  },
};

export default resolvers;
