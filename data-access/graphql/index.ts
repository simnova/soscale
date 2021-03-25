import { HttpRequest, Context } from '@azure/functions';
import ApolloConfig from './apollo-config';
import connect from '../shared-code/datasources/cosmosdb/connect';



(async() => {
  ApolloConfig.startup(async () => {
   // await connect()
  })
})();

export default (context: Context, req: HttpRequest) => {
  return ApolloConfig.graphqlHandler(context, req);
};

