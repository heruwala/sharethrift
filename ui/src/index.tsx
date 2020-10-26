import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MsalProvider, {MsalProviderPopupConfig, MsalProviderRedirectConfig}  from 'msal-react-lite';
import ApolloConnection from './components/core/apollo-connection';
import * as msal from "@azure/msal-browser";

var clientId = process.env.REACT_APP_AAD_APP_CLIENTID??"missing-client-id";
var tenantId = process.env.REACT_APP_AAD_DIRECTORY_TENANTID??"missing-tenant-id";
var redirectUri = process.env.REACT_APP_AAD_REDIRECT_URI??"missing-redirect-uri";
var scopes = process.env.REACT_APP_AAD_SCOPES??"missing-scopes";

const commonAuthority = `https://login.microsoftonline.com/common`; //allows for anyone to register not just AAD accounts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tenantAuthority = `https://login.microsoftonline.com/${tenantId}`; // allows ONLY for Other AAD accounts to register

const appAuthority = commonAuthority; //to allow any user to sign up must choose commonAuthority

// eslint-disable-next-line @typescript-eslint/no-unused-vars
var msalProviderPopupConfig : MsalProviderPopupConfig =  {
  type:"popup",
  msalConfig: {
    auth: {
      clientId: clientId,
      authority: appAuthority,
      redirectUri: redirectUri, 
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {	
            return;	
          }	
          switch (level) {	
            case msal.LogLevel.Error:	
              console.error(message);	
              return;	
            case msal.LogLevel.Info:	
              console.info(message);	
              return;	
            case msal.LogLevel.Verbose:	
              console.debug(message);	
              return;	
            case msal.LogLevel.Warning:	
              console.warn(message);	
              return;	
          }
        }
      }
    }
  },
  silentRequestConfig: {
    scopes:[scopes]
  },
  endSessionRequestConfig:{
  },
  loginRequestConfig:{
    scopes:[scopes]
  }
}

var msalProviderRedirectConfig : MsalProviderRedirectConfig =  {
  type:"redirect",
  msalConfig: {
    auth: {
      clientId: clientId,
      authority: commonAuthority,
      redirectUri: redirectUri, 
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {	
            return;	
          }	
          switch (level) {	
            case msal.LogLevel.Error:	
              console.error(message);	
              return;	
            case msal.LogLevel.Info:	
              console.info(message);	
              return;	
            case msal.LogLevel.Verbose:	
              console.debug(message);	
              return;	
            case msal.LogLevel.Warning:	
              console.warn(message);	
              return;	
          }
        }
      }
    }
  },
  silentRequestConfig: {
    scopes:[scopes]
  },
  endSessionRequestConfig:{
  },
  redirectRequestConfig: {
    scopes:[scopes]
  }
}

var msalProviderConfig = msalProviderRedirectConfig; //when using Facebook Login - cannot use pop-up, login UI doesn't render correctly.

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