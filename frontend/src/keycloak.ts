const keycloakPromise = import('keycloak-js').then(({ default: Keycloak }) => {
  return new Keycloak({
    url: 'http://localhost:8080',
    realm: 'booking-app',
    clientId: 'frontend',
  });
});

export default keycloakPromise;