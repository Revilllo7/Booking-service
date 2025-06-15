const keycloakPromise = import('keycloak-js').then(({ default: Keycloak }) => {
  return new Keycloak({
    url: 'http://booking.local',
    realm: 'booking-app',
    clientId: 'frontend',
  });
});

export default keycloakPromise;