import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: 'http://localhost:8080/realms/booking-app/protocol/openid-connect/certs',
    cache: true,
    rateLimit: true,
  }),
  audience: ['frontend', 'account'], // Accept both
  issuer: 'http://localhost:8080/realms/booking-app',
  algorithms: ['RS256'],
});