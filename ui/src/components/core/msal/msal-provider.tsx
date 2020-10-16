import React, {FC,ReactNode,useState,useEffect} from 'react';
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
            getAuthToken()
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

    let getAccount =(providedHomeAccountId?:string):msal.AccountInfo | undefined => {
        let usedHomeAccountId = providedHomeAccountId??homeAccountId;
        if(!usedHomeAccountId) return undefined
        return msalInstance.getAccountByHomeId(usedHomeAccountId) ?? undefined;
    }

    let getFullSilentRequestConfig = (silentRequestConfig:MsalMinimalSilentRequestConfig, providedHomeAccountId?:string): msal.SilentRequest |undefined => {
        let account = getAccount(providedHomeAccountId)??{} as msal.AccountInfo;
        if(typeof account === 'undefined') return undefined;
        return {
            account,
            ...silentRequestConfig
        } as msal.SilentRequest
    }
    
    let getAuthToken = async (providedHomeAccountId?:string) =>{
        var fullSilentRequestConfig = getFullSilentRequestConfig(props.config.silentRequestConfig,providedHomeAccountId);
        if(!fullSilentRequestConfig) {
            setIsLoggedIn(false);
            return;
        };
        
        if(usePopup){
            var popupConfig = props.config as MsalProviderPopupConfig
            return await authTokenPopup(fullSilentRequestConfig,popupConfig.loginRequestConfig)
        }else{
            var redirectConfig = props.config as MsalProviderRedirectConfig
            return await authTokenRedirect(fullSilentRequestConfig,redirectConfig?.redirectRequestConfig)
        }
    }
    let handleRedirectResult = (authResult:msal.AuthenticationResult | null) => {
        if(!authResult || authResult.account.homeAccountId === homeAccountId) return;
        setHomeAccountId(authResult.account.homeAccountId)
        getAuthToken()
    }
    useEffect(() => {
        msalInstance.handleRedirectPromise().then(handleRedirectResult);
    },[]); // eslint-disable-line react-hooks/exhaustive-deps
    
    let authTokenPopup = async (silentRequest:msal.SilentRequest,loginRequestConfig?: msal.AuthorizationUrlRequest) : Promise<string|undefined> => {
        var authResult : msal.AuthenticationResult;
        try {
            authResult = await msalInstance.acquireTokenSilent(silentRequest)
            return authResult.accessToken;
        } catch (err) {
            if(err instanceof msal.InteractionRequiredAuthError){
                // should log in
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
        try {
            var authResult = await msalInstance.acquireTokenSilent(silentRequest)
            setHomeAccountId(authResult.account.homeAccountId)
            setIsLoggedIn(true);
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
                getAuthToken:   () => getAuthToken(), 
                isLoggedIn:     isLoggedIn,
                logout:         () =>  logout(),
                login:          ()=> login(),
            }}>
            {props.children}
        </MsalContext.Provider>
    )
}

export default MsalProvider;