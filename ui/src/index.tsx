import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MsalProvider, {MsalProviderPopupConfig}  from './components/core/msal/msal-provider';
import ApolloConnection from './components/core/apollo-connection';

var msalProviderConfig : MsalProviderPopupConfig =  {
  type:"popup",
  msalConfig: {
    auth: {
      clientId: process.env.REACT_APP_AAD_APP_CLIENTID??"missing-client-id"
    }
  },
  silentRequestConfig: {
    scopes:[]
  },
  endSessionRequestConfig:{
  },
  loginRequestConfig:{
    scopes:[]
  }
}

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider config={msalProviderConfig}>
      <ApolloConnection />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();