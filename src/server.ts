require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as logger from "morgan";
import { graphqlUploadExpress } from "graphql-upload";
import client from "./client";
import schema from "./schema";
import { getUser } from "./users/users.utils";
import * as http from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      if (req) {
        return {
          loggedInUser: await getUser(req.headers.token),
          client,
        };
      }
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();
  const app = express();
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  const PORT = process.env.PORT;
  await new Promise((r: any) => httpServer.listen(PORT, r));

  console.log(
    `🚀 Server is running on http://localhost:${PORT}${server.graphqlPath}/`
  );
};

startServer();
