import express, { Express } from "express";
import "reflect-metadata";
import { resolvers } from "./graphql/resolvers";
import cors from "cors";
import {} from "graphql";
import { json } from "body-parser";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
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
  app.use(cors());

  // Create the apollo server
  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({
            embed: true,
            includeCookies: true,
          }),
    ],
  });

  // start the apollo server
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let context: Context = { req, res, user: undefined };
        // get the token from header or cookies
        const token = req.cookies?.access_token || "";

        // Try to retrieve a user with the token
        if (token) {
          const user = await new UserService().getUser(token);
          context.user = user;
        }
        return context;
      },
    })
  );

  // app.listen on express server
  const port = config.get<string>("PORT");
  app.listen(port, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${port}/graphql`
    );
  });

  // connect to  mongoDB database
  await connectToMongo();
}

startServer();
