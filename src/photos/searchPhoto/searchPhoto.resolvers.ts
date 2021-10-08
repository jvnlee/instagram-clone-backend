import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhoto: (_, { keyword }, { client }) =>
      client.photo.findMany({ where: { caption: { startsWith: keyword } } }),
  },
};

export default resolvers;
