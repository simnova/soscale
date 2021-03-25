import { createContext } from 'react';
import * as msal from "@azure/msal-browser";

export interface MsalContextInterface {
  getAuthToken:  () => Promise<string|undefined>, 
  getAuthResult: () => Promise<msal.AuthenticationResult|undefined>,
  isLoggedIn:    boolean,
  logout:        () => Promise<void>;
  login:         () => Promise<msal.AuthenticationResult|undefined>;
} 

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <MsalProvider>.');
};

const initialContext = {
  getAuthToken:   stub,
  getAuthResult:  stub,
  isLoggedIn:     false,
  logout:         stub,
  login:          stub,
};
  
const MsalContext = createContext<MsalContextInterface>(initialContext);
  
export default MsalContext;