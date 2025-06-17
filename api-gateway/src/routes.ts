import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { limiter } from './middleware/rateLimit';
import { checkJwt } from './middleware/keycloakJwt';

const router = Router();



router.get('/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

// Secure /api/bookings with Keycloak JWT
router.use('/bookings', checkJwt, createProxyMiddleware({
  target: 'http://booking-service:3001',
  changeOrigin: true,
  pathRewrite: (path, req) => '/bookings' + path.replace(/^\/bookings/, ''),
}));

router.use('/auth', createProxyMiddleware({
  target: 'http://user-service:3003',
  changeOrigin: true,
  pathRewrite: (path, req) => '/auth' + path.replace(/^\/auth/, ''),
}));

// router.use(limiter);

export default router;