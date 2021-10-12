import { deleteFromAWS } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import photosTypeDefs from "../photos.typeDefs";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const target = await client.photo.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
            file: true,
          },
        });
        if (!target) {
          return {
            status: false,
            error: "Photo not found.",
          };
        } else if (target.userId !== loggedInUser.id) {
          return {
            status: false,
            error: "Not authorized.",
          };
        } else {
          await client.photo.delete({ where: { id } });
          await deleteFromAWS(target.file);
          return {
            status: true,
          };
        }
      }
    ),
  },
};

export default resolvers;
