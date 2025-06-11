import { Request, Response, NextFunction } from 'express';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = [
  expressjwt({
    secret: jwksRsa.expressJwtSecret({
      jwksUri: 'http://keycloak:8080/realms/booking-app/protocol/openid-connect/certs',
      cache: true,
      rateLimit: true,
    }),
    audience: 'frontend',
    issuer: 'http://localhost:8080/realms/booking-app',
    algorithms: ['RS256'],
    requestProperty: 'user',
  }),
  // Map sub to id (as number)
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user && typeof req.user.sub === 'string') {
      req.user.id = req.user.sub;
    }
    // Check both realm_access and resource_access.frontend for 'admin'
    const isAdmin =
      (req.user?.realm_access?.roles?.includes('admin')) ||
      (req.user?.resource_access?.frontend?.roles?.includes('admin'));
    req.user.role = isAdmin ? 'admin' : 'user';
    next();
  }
];