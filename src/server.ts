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
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
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

  await server.start();
  server.applyMiddleware({ app });

  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());

  const PORT = process.env.PORT;
  httpServer.listen(PORT, () =>
    console.log(
      `🚀 Server is running on http://localhost:${PORT}${server.graphqlPath}`
    )
  );
};

startServer();
