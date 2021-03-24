import { ApolloServer, gql }  from 'apollo-server-azure-functions';
import { HttpRequest, Context } from "@azure/functions";

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

const server = new ApolloServer(
  { 
  typeDefs, 
  resolvers, 
  playground:true 
  },
);

const graphqlHandler = (server, context, req) => {
  const graphqlHandlerObj = server.createHandler({
    cors: {
      origin: "*",
      preflightContinue: false, 
      credentials: true,
    },
  })

  // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers["x-ms-privatelink-id"] = ""
  // apollo-server only reads this specific string
  req.headers["Access-Control-Request-Headers"] =
    req.headers["Access-Control-Request-Headers"] ||
    req.headers["access-control-request-headers"]
  return graphqlHandlerObj(context, req)
}

export default (context: Context, req: HttpRequest) => {
  return graphqlHandler(server, context, req);
};


//exports.graphqlHandler = graphqlHandler(server,context,req);