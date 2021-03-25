import {
  MsalProviderPopupConfig,
  MsalProviderRedirectConfig,
} from '../components/msal-react-lite';
import * as msal from '@azure/msal-browser';

var clientId = process.env.REACT_APP_AAD_APP_CLIENTID ?? "missing-client-id";
var tenantId =
  process.env.REACT_APP_AAD_DIRECTORY_TENANTID ?? "missing-tenant-id";
var redirectUri =
  process.env.REACT_APP_AAD_REDIRECT_URI ?? "missing-redirect-uri";
var scopes = process.env.REACT_APP_AAD_SCOPES ?? "missing-scopes";

//login.windows-ppe.net
//login.windows.net/

const commonAuthority = `https://login.microsoftonline.com/common`; //allows for anyone to register not just AAD accounts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tenantAuthority = `https://login.microsoftonline.com/${tenantId}`; // allows ONLY for Other AAD accounts to register

const appAuthority = tenantAuthority; //to allow any user to sign up must choose commonAuthority


var msalProviderPopupConfig: MsalProviderPopupConfig = {
  type: "popup",
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
        },
      },
    },
  },
  silentRequestConfig: {
    scopes: [scopes],
  },
  endSessionRequestConfig: {},
  loginRequestConfig: {
    scopes: [scopes],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
var msalProviderRedirectConfig: MsalProviderRedirectConfig = {
  type: "redirect",
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
        },
      },
    },
  },
  silentRequestConfig: {
    scopes: [scopes],
  },
  endSessionRequestConfig: {},
  redirectRequestConfig: {
    scopes: [scopes],
  },
};

var msalProviderConfig = msalProviderPopupConfig; //when using Facebook Login - cannot use pop-up, login UI doesn't render correctly.

export default msalProviderConfig;
