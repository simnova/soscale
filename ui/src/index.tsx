import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ApolloConnection from './components/core/apollo-connection';
import MsalProvider from './components/msal-react-lite';
import MsalProviderConfig from './config/msal-config';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>    
      <MsalProvider config={MsalProviderConfig}>
        <ApolloConnection>
          <App />
        </ApolloConnection>
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
