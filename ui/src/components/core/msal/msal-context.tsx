import { createContext } from 'react';

export interface MsalContextInterface {
    getAuthToken: () => Promise<string|undefined>, 
    isLoggedIn:   boolean,
    logout:       () => Promise<void>;
    login:        () => Promise<void>;
} 

const stub = (): never => {
    throw new Error('You forgot to wrap your component in <MsalProvider>.');
};

const initialContext = {
    getAuthToken:   stub,
    isLoggedIn:     false,
    logout:         stub,
    login:          stub,
};
  
const MsalContext = createContext<MsalContextInterface>(initialContext);
  
export default MsalContext;