import React, {FC,ReactNode,useState} from 'react';
import MsalContext from './msal-context';
import * as msal from "@azure/msal-browser";

export interface MsalMinimalSilentRequestConfig  {
    scopes: Array<string>,
    claims?:string,
    autority?:string,
    forceRquest?: boolean,
    redirectUri?: string
}

export interface MsalProviderPopupConfig {
    type: 'popup',
    msalConfig: msal.Configuration,
    silentRequestConfig:MsalMinimalSilentRequestConfig,
    endSessionRequestConfig?: msal.EndSessionRequest,
    loginRequestConfig?: msal.AuthorizationUrlRequest
}

export interface MsalProviderRedirectConfig {
    type: 'redirect',
    msalConfig: msal.Configuration,
    silentRequestConfig:MsalMinimalSilentRequestConfig,
    endSessionRequestConfig?: msal.EndSessionRequest,
    redirectRequestConfig?: msal.RedirectRequest
}

export type MsalProps = {
    config: MsalProviderPopupConfig|MsalProviderRedirectConfig;
    children:ReactNode;
}

const MsalProvider:FC<MsalProps> = (props: MsalProps) : JSX.Element => {
    const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
    const [homeAccountId,setHomeAccountId] = useState<string>();

    var usePopup = props.config.type === 'popup';

    const msalInstance = new msal.PublicClientApplication(props.config.msalConfig);

    var login = async() => {
        if(usePopup){
            var popupConfig = props.config as MsalProviderPopupConfig
            await loginPopup(popupConfig.loginRequestConfig)
        }else{
            var redirectConfig = props.config as MsalProviderRedirectConfig
            await loginRedirect(redirectConfig?.redirectRequestConfig)
        }
    }

    let loginPopup = async (loginRequestConfig? : msal.AuthorizationUrlRequest) => {
        try {
            const loginResponse = await msalInstance.loginPopup(loginRequestConfig);
            setHomeAccountId(loginResponse.account.homeAccountId)
            setIsLoggedIn(true);
            console.log("MSAL loginResponse",loginResponse);
        } catch (err) {
            setIsLoggedIn(false);
        }
    }

    let loginRedirect = async (redirectRequestConfig? :msal.RedirectRequest | undefined) => {
        try {
            await msalInstance.loginRedirect(redirectRequestConfig);
        } catch (err) {
            // handle error
        }
    }

    let getAccount =():msal.AccountInfo | undefined => {
        console.log("homeAccountId",homeAccountId)
        if(!homeAccountId) return undefined
        return msalInstance.getAccountByHomeId(homeAccountId) ?? undefined;
    }

    let getFullSilentRequestConfig = (silentRequestConfig:MsalMinimalSilentRequestConfig): msal.SilentRequest |undefined => {
        let account = getAccount();
        if(!account) return undefined;
        return {
            account,
            ...silentRequestConfig
        } as msal.SilentRequest
    }
    
    let getAuthToken = async () => {
        var fullSilentRequestConfig = getFullSilentRequestConfig(props.config.silentRequestConfig);
        console.log("getAuthToken",fullSilentRequestConfig);
        if(!fullSilentRequestConfig) return;
        
        if(usePopup){
            var popupConfig = props.config as MsalProviderPopupConfig
            return await authTokenPopup(fullSilentRequestConfig,popupConfig.loginRequestConfig)
        }else{
            var redirectConfig = props.config as MsalProviderRedirectConfig
            return await authTokenRedirect(fullSilentRequestConfig,redirectConfig?.redirectRequestConfig)
        }
    }

    let authTokenPopup = async (silentRequest:msal.SilentRequest,loginRequestConfig?: msal.AuthorizationUrlRequest) : Promise<string|undefined> => {
        var authResult : msal.AuthenticationResult;
        try {
            authResult = await msalInstance.acquireTokenSilent(silentRequest)
            console.log("MSAL authenticationResult", authResult)
            return authResult.accessToken;
        } catch (err) {
            if(err instanceof msal.InteractionRequiredAuthError){
                // should log in
                setIsLoggedIn(false);
                if(loginRequestConfig){
                    authResult = await msalInstance.acquireTokenPopup(loginRequestConfig);
                    setIsLoggedIn(true);
                    return authResult.accessToken;
                }
            }
            return undefined;
        }
    } 

    let authTokenRedirect = async (silentRequest:msal.SilentRequest,redirectRequestConfig? :msal.RedirectRequest | undefined) : Promise<string|undefined> => {
        var authResult : msal.AuthenticationResult;
        try {
            authResult = await msalInstance.acquireTokenSilent(silentRequest)
            setHomeAccountId(authResult.account.homeAccountId)
            setIsLoggedIn(true);
            console.log("MSAL authenticationResult", authResult)
            return authResult.accessToken;
        } catch (err) {
            if(err instanceof msal.InteractionRequiredAuthError){
                // should log in
                setIsLoggedIn(false);
                if(redirectRequestConfig){
                    await msalInstance.acquireTokenRedirect(redirectRequestConfig);
                }
            }
            return undefined;
        }
    } 

    let logout = async() =>{
        if(props.config.endSessionRequestConfig){
            props.config.endSessionRequestConfig.account = getAccount();
        }
        await msalInstance.logout(props.config.endSessionRequestConfig)
        setIsLoggedIn(false);
    }

    return (
        <MsalContext.Provider 
            value={{
                getAuthToken:()  =>  getAuthToken(), 
                isLoggedIn:isLoggedIn,
                logout: () =>  logout(),
                login: ()=> login(),
            }}>
            {props.children}
        </MsalContext.Provider>
    )
}

export default MsalProvider;