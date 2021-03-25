import { FC } from 'react';
import {  gql, useQuery } from '@apollo/client';

const HELLO_WORLD = gql`
  query {
    hello
  }
`;

const HelloWorld: FC<any> = () => {
  const { loading, error, data } = useQuery(HELLO_WORLD);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (data) {console.log('updated data')};

  return (
    <span style={{fontSize:'small',lineBreak:'anywhere'}}>
    ApolloGraphQL Says: {data.hello}
    </span>
  )
}

export default HelloWorld;