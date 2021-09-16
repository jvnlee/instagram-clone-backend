const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Movie {
    title: String!
    year: Int!
  }
  type Query {
    movies: [Movie]
    movie: Movie
  }
  type Mutation {
    createMovie(title: String!): Boolean
    deleteMovie(title: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    movies: () => [],
    movie: () => ({ title: "Hello", year: 2021 }),
  },
  Mutation: {
    createMovie: (_, { title }) => {
      console.log(title);
      return true;
    },
    deleteMovie: (_, { title }) => {
      console.log(title);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(() => console.log("Server online"));
