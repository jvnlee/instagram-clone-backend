require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as logger from "morgan";
import { graphqlUploadExpress } from "graphql-upload";
import client from "./client";
import schema from "./schema";
import { getUser } from "./users/users.utils";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });

  await server.start();
  const app = express();
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  const PORT = process.env.PORT;
  await new Promise((r: any) => app.listen({ port: PORT }, r));

  console.log(
    `🚀 Server is running on http://localhost:${PORT}${server.graphqlPath}/`
  );
};

startServer();
