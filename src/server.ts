require("dotenv").config();
import { getUser } from "./users/users.utils";
import * as express from "express";
import * as logger from "morgan";
import { graphqlUploadExpress } from "graphql-upload";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import client from "./client";
import * as http from "http";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
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
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));
  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async ({ token }) => {
        if (!token) {
          throw new Error("Login required.");
        }
        const loggedInUser = await getUser(token);
        console.log("Connected!");
        return { loggedInUser, client };
      },
      onDisconnect: () => {
        console.log("Disconnected!");
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );
  const PORT = process.env.PORT;
  httpServer.listen(PORT, () =>
    console.log(
      `🚀 Server is running on http://localhost:${PORT}${server.graphqlPath}`
    )
  );
};
startServer();
