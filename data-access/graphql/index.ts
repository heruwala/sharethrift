let appInsights = require("applicationinsights");
appInsights.setup().start();
appInsights.defaultClient.commonProperties = {
  environment: process.env.WEBSITE_HOSTNAME,
  functionArea: "graphql"
};
let appInsightsClient = appInsights.defaultClient;

import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

import { ApolloServer, gql }  from 'apollo-server-azure-functions';
import cosmosdbconnect from '../sharedCode/datasources/cosmosDb/connect';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

/* IIFE for connecting to CosmosDB */
(async () => {
  try {
    await cosmosdbconnect();
  } catch (cosmosDbConnectError) {
    appInsightsClient.trackEvent({name: "COSMOSDB CONNECTION", properties: {customProperty: "Cannot Connect to Cosmos", details: cosmosDbConnectError}});
    appInsightsClient.trackException(cosmosDbConnectError)
  }
})();

// referenced from https://jeffmagnusson.com/post/graphql-apollo-server-plugins-in-typescript
const appInsightsPlugin = <ApolloServerPlugin & GraphQLRequestListener>{

  // Fires whenever a GraphQL request is received from a client.
 requestDidStart(requestContext:GraphQLRequestContext): GraphQLRequestListener | void{
    appInsightsClient.trackMetric({name: "apollo-query", value: 1});
    return this;
  },
  // Fires for graph exceptoions
  didEncounterErrors: function(requestContext:GraphQLRequestContext) {
    appInsightsClient.trackMetric({name: "apollo-error", value: 1});
    appInsightsClient.trackException({exception: new Error("Apollo Error")});
    appInsightsClient.trackException({exception: {category:"Apollo Error", details: requestContext.errors}});
  }
  
}

const server = new ApolloServer(
  { 
  typeDefs, 
  resolvers, 
  playground:true,
  plugins: [
    appInsightsPlugin
  ],
  },
);

exports.graphqlHandler = server.createHandler();