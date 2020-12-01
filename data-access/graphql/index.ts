let appInsights = require("applicationinsights");
appInsights.setup().start();
appInsights.defaultClient.commonProperties = {
  environment: process.env.WEBSITE_HOSTNAME,
  functionArea: "graphql",
};
let appInsightsClient = appInsights.defaultClient;

import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";

import { ApolloServer, gql } from "apollo-server-azure-functions";
import cosmosdbconnect from "../shared/data-sources/cosmos-db/connect";
import MsalAuth from "../shared/auth/msal";
import { HttpRequest, Context } from "@azure/functions";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    getServerTime: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      return `Hello world! ${JSON.stringify(context)}`;
    },
  },
  Mutation: {
    getServerTime: (parent, args, context) => {
      const result = {
        currentTime: Date.now(),
        expirationTime: context?.user?.authToken?.exp,
      };
      if (context.validated) {
        return JSON.stringify(result);
      } else {
        return JSON.stringify({ currentTime: 0, expirationTime: 0 });
      }
    },
  },
};

/* IIFE for connecting to CosmosDB */
(async () => {
  try {
    await cosmosdbconnect();
  } catch (cosmosDbConnectError) {
    appInsightsClient.trackEvent({
      name: "COSMOSDB CONNECTION",
      properties: {
        customProperty: "Cannot Connect to Cosmos",
        details: cosmosDbConnectError,
      },
    });
    appInsightsClient.trackException(cosmosDbConnectError);
  }
})();

// referenced from https://jeffmagnusson.com/post/graphql-apollo-server-plugins-in-typescript
const appInsightsPlugin = <ApolloServerPlugin & GraphQLRequestListener>{
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(
    requestContext: GraphQLRequestContext
  ): GraphQLRequestListener | void {
    appInsightsClient.trackMetric({ name: "apollo-query", value: 1 });
    return this;
  },
  // Fires for graph exceptions
  didEncounterErrors: function (requestContext: GraphQLRequestContext) {
    appInsightsClient.trackMetric({ name: "apollo-error", value: 1 });
    appInsightsClient.trackException({ exception: new Error("Apollo Error") });
    appInsightsClient.trackException({
      exception: { category: "Apollo Error", details: requestContext.errors },
    });
  },
};

const getPlaygroundSetting = () => {
  if (process.env.APOLLO_PLAYGROUND_VISIBLE === "true") {
    if (process.env.APOLLO_PLAYGROUND_ENDPOINT) {
      return { endpoint: process.env.APOLLO_PLAYGROUND_ENDPOINT };
    }
    return true;
  } else {
    return false;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: { endpoint: process.env.APOLLO_PLAYGROUND_ENDPOINT },
  plugins: [appInsightsPlugin],
  context: async (request) => {
    var [user, validated] = await MsalAuth.VerifyAccessToken(request);
    return { user, validated };
  },
});

const graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

export default (context: Context, req: HttpRequest) => {
  // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers["x-ms-privatelink-id"] = "";
  // apollo-server only reads this specific string
  req.headers["Access-Control-Request-Headers"] =
    req.headers["Access-Control-Request-Headers"] ||
    req.headers["access-control-request-headers"];
  return graphqlHandler(context, req);
};
