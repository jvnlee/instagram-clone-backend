import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { client, loggedInUser }) => {
        const target = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!target) {
          return {
            status: false,
            error: "Comment not found.",
          };
        } else if (target.userId !== loggedInUser.id) {
          return {
            status: false,
            error: "Not authorized.",
          };
        } else {
          await client.comment.update({
            where: { id },
            data: { payload },
          });
        }
        return {
          status: true,
        };
      }
    ),
  },
};

export default resolvers;
