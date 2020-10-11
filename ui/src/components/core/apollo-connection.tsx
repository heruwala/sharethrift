import React, { FC } from 'react';
import App from '../../App';
import {
  ApolloClient,  
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  from
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import useMsal from './msal/use-msal';

const ApolloConnection: FC<any> = () => {
  const { getAuthToken } = useMsal();

  const withToken = setContext(async(_,{headers}) =>{
    const token = await getAuthToken();
    return{
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null
      }
    }
  }) 
 
  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_FUNCTION_ENDPOINT}api/graphql`
  });

  const client = new ApolloClient({
    link: from([withToken, httpLink]),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

export default ApolloConnection;