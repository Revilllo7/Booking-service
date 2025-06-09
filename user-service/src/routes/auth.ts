import express from 'express'
import { registerUser, loginUser, getUserById } from '../controllers/authController'
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: 'http://keycloak:8080/realms/booking-app/protocol/openid-connect/certs',
    cache: true,
    rateLimit: true,
  }),
  audience: 'frontend',
  issuer: 'http://keycloak:8080/realms/booking-app',
  algorithms: ['RS256'],
});

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/user/:id', checkJwt, getUserById) // Protect this endpoint

router.get('/health', (req, res) => res.send('OK'));

export default router
