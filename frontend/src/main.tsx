import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import keycloakPromise from './keycloak';
import './index.css';

keycloakPromise.then(keycloak => {
  keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256' }).then(authenticated => {
    if (authenticated) {
      localStorage.setItem('keycloak-token', keycloak.token || '');
      localStorage.setItem('user', JSON.stringify(keycloak.tokenParsed));
      createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } else {
      keycloak.login();
    }
  });
});