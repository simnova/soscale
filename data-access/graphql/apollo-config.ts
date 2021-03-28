import { HttpRequest, Context } from '@azure/functions';
import { ApolloServer, Config, gql, PlaygroundConfig  }  from 'apollo-server-azure-functions';
import { DocumentNode } from 'graphql';
import  * as TypeDefs from './typedefs/';
import  * as Resolvers from  './resolvers';


const getTypeDefs = (): DocumentNode[] => {
  //in order to do extend for a type, you need a type to start, so we put in _empty ones to get things going.
  const baseTypeDef = gql`
    type Mutation {
        _empty:String
    }
    type Query {
        _empty:String
    }
  `;

  var typeDefArray = (Object.values<DocumentNode>(TypeDefs))
  typeDefArray.unshift(baseTypeDef);
  return typeDefArray;
}

const getPlaygroundSetting = () : PlaygroundConfig  => {
  if (process.env.APOLLO_PLAYGROUND_VISIBLE === "true") {
    return { endpoint: "api/graphql" }
  } else {
    return false
  }
}

var config : Config = {
  typeDefs: getTypeDefs(),
  resolvers: Resolvers,
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