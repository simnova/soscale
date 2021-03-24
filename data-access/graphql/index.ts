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

const getPlaygroundSetting = () => {
  if (process.env.APOLLO_PLAYGROUND_VISIBLE === "true") {
    if (process.env.PLAYGROUND_URI) {
      return { endpoint: "api/graphql" }
    }
    return true
  } else {
    return false
  }
}

const server = new ApolloServer(
  { 
  typeDefs, 
  resolvers, 
  playground: getPlaygroundSetting(),
  },
);

const graphqlHandler = (server, context, req) => {
  const graphqlHandlerObj = server.createHandler({
    cors: {
      origin: "*",
      preflightContinue: true, 
      credentials: true,
    },
  })

/*
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, HEAD, DELETE, PATCH",
  "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization, X-Apollo-Tracing, Apollo-Query-Plan-Experimental",
*/

  // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers["x-ms-privatelink-id"] = ""
  // apollo-server only reads this specific string
  req.headers["Access-Control-Request-Headers"] =
    req.headers["Access-Control-Request-Headers"] ||
    req.headers["access-control-request-headers"]

  req.headers["server"] = null;
  req.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, HEAD, DELETE, PATCH";

  return graphqlHandlerObj(context, req)
}

export default (context: Context, req: HttpRequest) => {
  return graphqlHandler(server, context, req);
};


//exports.graphqlHandler = graphqlHandler(server,context,req);