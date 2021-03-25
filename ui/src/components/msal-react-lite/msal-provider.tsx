import { FC, ReactNode, useState, useEffect } from 'react';
import MsalContext from './msal-context';
import * as msal from '@azure/msal-browser';

export interface MsalMinimalSilentRequestConfig {
  scopes: Array<string>;
  claims?: string;
  autority?: string;
  forceRquest?: boolean;
  redirectUri?: string;
}

export interface MsalProviderPopupConfig {
  type: "popup";
  msalConfig: msal.Configuration;
  silentRequestConfig: msal.SilentRequest;
  endSessionRequestConfig?: msal.EndSessionRequest;
  loginRequestConfig?: msal.PopupRequest;
}

export interface MsalProviderRedirectConfig {
  type: "redirect";
  msalConfig: msal.Configuration;
  silentRequestConfig: msal.SilentRequest;
  endSessionRequestConfig?: msal.EndSessionRequest;
  redirectRequestConfig?: msal.RedirectRequest;
}

export type MsalProps = {
  config: MsalProviderPopupConfig | MsalProviderRedirectConfig;
  children: ReactNode;
};

const MsalProvider: FC<MsalProps> = (props: MsalProps): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [homeAccountId, setHomeAccountId] = useState<string>();
  var usePopup = props.config.type === "popup";

  const msalInstance = new msal.PublicClientApplication(
    props.config.msalConfig
  );

  var login = async () => {
    if (usePopup) {
      var popupConfig = props.config as MsalProviderPopupConfig;
      return await loginPopup(popupConfig.loginRequestConfig);
    } else {
      var redirectConfig = props.config as MsalProviderRedirectConfig;
      await loginRedirect(redirectConfig?.redirectRequestConfig);
      return undefined;
    }
  };

  let loginPopup = async (
    loginRequestConfig?: msal.PopupRequest
  ) => {
    try {
      const loginResponse = await msalInstance.loginPopup(loginRequestConfig);
      setHomeAccountId(loginResponse.account?.homeAccountId);
      return await getAuthResult();
    } catch (err) {
      console.error("Login error", err);
      setIsLoggedIn(false);
      return undefined;
    }
  };

  let loginRedirect = async (
    redirectRequestConfig?: msal.RedirectRequest | undefined
  ) => {
    try {
      await msalInstance.loginRedirect(redirectRequestConfig);
    } catch (err) {
      // handle error
    }
  };

  let handleRedirectResult = async (
    authResult: msal.AuthenticationResult | null
  ) => {
    if (!authResult) {
      //may be called from loginTokenPopup or on a page load
      authResult = (await getAuthResult()) ?? null;
    }
    if (
        (
          authResult !== null &&
          authResult.account !== null &&
          authResult.account?.homeAccountId !== homeAccountId
        )
      ){
      setHomeAccountId(authResult.account?.homeAccountId);
      getAuthResult(authResult.account?.homeAccountId);
    } 
  };
  useEffect(() => {
    msalInstance.handleRedirectPromise().then(async (authResult) => {
      console.log('handle-redirect');
      await handleRedirectResult(authResult);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let getAccount = (
    providedHomeAccountId?: string
  ): msal.AccountInfo | undefined => {
    let usedHomeAccountId = providedHomeAccountId ?? homeAccountId;
    if (!usedHomeAccountId) return undefined;
    return msalInstance.getAccountByHomeId(usedHomeAccountId) ?? undefined;
  };

  let getFullSilentRequestConfig = (
    silentRequestConfig: msal.SilentRequest,
    providedHomeAccountId?: string
  ): msal.SilentRequest | undefined => {
    let account = getAccount(providedHomeAccountId) ?? ({} as msal.AccountInfo);
    if (typeof account === "undefined") return undefined;
    return {
      account,
      ...silentRequestConfig,
    } as msal.SilentRequest;
  };

  let getAuthToken = async (
    providedHomeAccountId?: string
  ): Promise<string | undefined> => {
    return (await getAuthResult(providedHomeAccountId))?.accessToken;
  };

  let getAuthResult = async (
    providedHomeAccountId?: string
  ): Promise<msal.AuthenticationResult | undefined> => {
    var fullSilentRequestConfig = getFullSilentRequestConfig(
      props.config.silentRequestConfig,
      providedHomeAccountId
    );
    if (!fullSilentRequestConfig) {
      setIsLoggedIn(false);
      return;
    }

    if (usePopup) {
      var popupConfig = props.config as MsalProviderPopupConfig;
      return await authTokenPopup(
        fullSilentRequestConfig,
        popupConfig.loginRequestConfig
      );
    } else {
      var redirectConfig = props.config as MsalProviderRedirectConfig;
      return await authTokenRedirect(
        fullSilentRequestConfig,
        redirectConfig?.redirectRequestConfig
      );
    }
  };

  let authTokenPopup = async (
    silentRequest: msal.SilentRequest,
    loginRequestConfig?: msal.PopupRequest | undefined
  ): Promise<msal.AuthenticationResult | undefined> => {
    var authResult: msal.AuthenticationResult;
    try {
      authResult = await msalInstance.acquireTokenSilent(silentRequest);
      console.log('logged in1');
      setIsLoggedIn(true);
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError) {
        // should log in
        //if (silentRequest) {
          console.log('logged in2');
          authResult = await msalInstance.acquireTokenPopup(silentRequest);
          setIsLoggedIn(true);
          return authResult;
       // }
      }
      return undefined;
    }
  };

  let authTokenRedirect = async (
    silentRequest: msal.SilentRequest,
    redirectRequestConfig?: msal.RedirectRequest | undefined
  ): Promise<msal.AuthenticationResult | undefined> => {
    try {
      var authResult = await msalInstance.acquireTokenSilent(silentRequest);
      setHomeAccountId(authResult.account?.homeAccountId);
      setIsLoggedIn(true);
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError) {
        // should log in
        setIsLoggedIn(false);
        //if (redirectRequestConfig) {
          await msalInstance.acquireTokenRedirect(silentRequest);
        //}
      }
      return undefined;
    }
  };

  let logout = async () => {
    if (!props.config.endSessionRequestConfig) {
      props.config.endSessionRequestConfig = {};
    }
    props.config.endSessionRequestConfig.account = getAccount();
    await msalInstance.logout(props.config.endSessionRequestConfig);
    setIsLoggedIn(false);
  };

  return (
    <MsalContext.Provider
      value={{
        getAuthToken: () => getAuthToken(),
        getAuthResult: () => getAuthResult(),
        isLoggedIn: isLoggedIn,
        logout: () => logout(),
        login: () => login(),
      }}
    >
      {props.children}
    </MsalContext.Provider>
  );
};

export default MsalProvider;
