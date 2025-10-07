import type { Request, Response, NextFunction } from 'express';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import type { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';

// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string;
      username: string;
      roles: string[];
    };
  }
}

const jwksUri = process.env.JWKS_URI;

const client = jwksClient({
  jwksUri: jwksUri as string,
  cache: true,
  rateLimit: true,
});

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  const kid = header.kid || 'default';
  client.getSigningKey(kid, function (err: any, key: any) {
    if (err) {
      console.error('Error getting signing key:', err);
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function jwtAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    if (typeof token !== 'string') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      req.user = {
        sub: decoded.sub,
        username: decoded.username,
        roles: decoded.roles,
      };
      next();
    });
  };
}

export function roleAuth(allowedRoles: string[] = ['SUPER_ADMIN', 'INVENTORY_MANAGER']) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }
    const userRoles = req.user?.roles || [];
    const hasRole = userRoles.some((role: string) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}
