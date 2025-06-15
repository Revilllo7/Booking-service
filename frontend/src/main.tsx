import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import keycloakPromise from './keycloak';
import './index.css';

function renderLoading() {
  createRoot(document.getElementById('root')!).render(
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading authentication...</div>
  );
}

function renderError(error: string) {
  createRoot(document.getElementById('root')!).render(
    <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
      Authentication error: {error}
    </div>
  );
}

renderLoading();

keycloakPromise
  .then(keycloak => {
    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      })
      .then(authenticated => {
        createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
      })
      .catch(err => {
        renderError(err?.toString() || 'Unknown error');
      });
  })
  .catch(err => {
    renderError(err?.toString() || 'Unknown error');
  });