import { Issuer, Client } from 'openid-client';
import {JWT} from 'jose';

var verifyAccessToken = async (context) : Promise<[object, boolean]>  => {
  let token = context.request.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) return [{}, false];

  token = token.slice(7, token.length).trimLeft(); // Remove Bearer from string

  const settings = {
    audience: process.env.AAD_TOKEN_APPLICATION_ID,
    openIdConfigUrl: process.env.AAD_TOKEN_OPEN_ID_CONNECT_METADATA_DOCUMENT,
    tenantId: process.env.AAD_TOKEN_TENANT_ID
  };

  const issuer = await Issuer.discover(settings.openIdConfigUrl);
  const keyStore = await issuer.keystore();

  var results = JWT.verify(
    token,
    keyStore, 
    {
      audience: settings.audience,
      issuer:  `https://login.microsoftonline.com/${settings.tenantId}/v2.0`,
    }
  );
  
  return [
    {
      "authToken": results,
    },
    true
  ];
}

export default {
  VerifyAccessToken: verifyAccessToken
}