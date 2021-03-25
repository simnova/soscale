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

const ApolloConnection: FC<any> = (props) => {
  const { getAuthToken, isLoggedIn } = useMsal();

  const withToken = setContext(async (_, { headers }) => {
    const token = await getAuthToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null,
      },
    };
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
    if (!isLoggedIn) {
      (async () => {
        await client.resetStore(); //clear Apollo cache when user logs off
      })();
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloConnection;
