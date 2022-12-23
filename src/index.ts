import express, { Express } from "express";
import { resolvers } from "./graphql/resolvers";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { connectToMongo } from "./utils/connect-database";
import { Context } from "./utils/types/context";
import { UserService } from "./user/user-services";
import config from "config";
import { authChecker } from "./utils/auth-checker";

async function startServer() {
  // Build the Schema
  const schema = await buildSchema({
    resolvers,
    authChecker,
    authMode: "null", // this silents auth guards cause we don't want to return authorization errors to users
  });

  // init the express app
  const app: Express = express();
  app.use(cookieParser());

  // Create the apollo server
  const server = new ApolloServer({
    schema,
    context: async (ctx: Context) => {
      const context = ctx;

      // get the token from header or cookies
      const token = ctx.req.cookies?.access_token || "";

      // Try to retrieve a user with the token
      if (token) {
        const user = await new UserService().getUser(token);
        context.user = user;
      }
      return context;
    },
    plugins: [
      // this enable or disable the playground depending on if whether the app is running in dev or prod
      process.env.NODE_ENV == "prod"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  // start the apollo server
  await server.start();

  // apply middleware to apollo server
  server.applyMiddleware({ app });

  // app.listen on express server
  const port = config.get<string>("PORT");
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });

  // connect to  mongoDB database
  await connectToMongo();
}

startServer();
