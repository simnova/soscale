import { FC, useEffect } from 'react';

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { useMsal } from '../msal-react-lite';

export interface AuthProps {
  AuthenticationIdentifier?: string
}

const ApolloConnection: FC<any> = (props) => {

  const { getAuthToken, getIsLoggedIn } = useMsal();

  const hasAuth = props.AuthenticationIdentifier !== null && typeof props.AuthenticationIdentifier !== "undefined";
  
  const withToken = setContext(async (_, { headers }) => {
    if(hasAuth){
      const token = await getAuthToken(props.AuthenticationIdentifier);
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : null,
        },
      };
    }else {
      return {
        headers: {
          ...headers
        },
      };
    }
    
  });

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_GRAPH_SERVER}`,
  });

  const cache = new InMemoryCache();
  
  const client = new ApolloClient({
    link: from([withToken, httpLink]),
    cache: cache,
  });

  
  
  useEffect(() => {
    if (hasAuth && !getIsLoggedIn(props.AuthenticationIdentifier) && client) {
      (async () => {
        try{  // will throw exception if not connected
          await client.resetStore(); //clear Apollo cache when user logs off
        } catch(err){
          if(err.message !== 'Failed to fetch'){
            console.error("Apollo Reset error",err);
          }
        }
      })();
    }
  }, [getIsLoggedIn,hasAuth, props.AuthenticationIdentifier]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloConnection;
