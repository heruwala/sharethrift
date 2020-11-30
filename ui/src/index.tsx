import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MsalProvider from './components/msal-react-lite';
import ApolloConnection from './components/core/apollo-connection';
import MsalProviderConfig from './config/msal-config';

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider config={MsalProviderConfig}>
      <ApolloConnection />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();