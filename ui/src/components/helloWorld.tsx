import React, { FC } from "react";
import { useQuery, gql } from '@apollo/client';

const HELLO_WORLD = gql`
  query {
    hello
  }
`;

const HelloWorld: FC<any> = () => {
  const { loading, error, data } = useQuery(HELLO_WORLD);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log('data',data)

  return (
    <span>
    ApolloGraphQL Says: {data.hello}
    </span>
  )
}

export default HelloWorld;