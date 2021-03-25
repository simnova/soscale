import { ApolloServer, Config, gql, PlaygroundConfig  }  from 'apollo-server-azure-functions';

import { HttpRequest, Context } from "@azure/functions";
import  * as TypeDefs from "./typedefs/";
import { DefinitionNode, DocumentNode } from 'graphql';
//import { DocumentNode } from 'graphql';


// Construct a schema, using GraphQL schema language

const baseTypeDef = gql`
  type Mutation {
      _empty:String
  }
  type Query {
      _empty:String
  }
`;

var TypeDefArray = (Object.values<DocumentNode>(TypeDefs))
//TypeDefs.hello
//TypeDefs
//var TypeDefArray = baseTypeDef.concat(Object.values<DocumentNode>(TypeDefs)) ;//Object.values<DocumentNode>(TypeDefs)[0].definitions;

TypeDefArray.unshift(baseTypeDef);
//.values() = baseTypeDef;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const getPlaygroundSetting = () : PlaygroundConfig  => {
  if (process.env.APOLLO_PLAYGROUND_VISIBLE === "true") {
    return { endpoint: "api/graphql" }
  } else {
    return false
  }
}

var config : Config = {
  typeDefs: TypeDefArray,
  resolvers: resolvers,
  playground: getPlaygroundSetting() 
}

const server = new ApolloServer(config);

const graphqlHandler = (context: Context, req: HttpRequest) => {
  const graphqlHandlerObj = server.createHandler({
    cors: {
      origin: "*",
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




const startup = async ( callback:() => Promise<void> ) =>{
  await callback();
}

export default {
  startup,
  graphqlHandler
}