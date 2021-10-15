import { withFilter } from "graphql-subscriptions";
import NEW_MESSAGE from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_MESSAGE),
        ({ roomUpdates }, { id }) => {
          return roomUpdates.roomId === id;
        }
      ),
    },
  },
};

export default resolvers;
