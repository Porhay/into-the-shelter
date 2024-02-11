import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware', req.isAuthenticated(), req.user, req.headers.authorization);

    if (req.isAuthenticated() && req.user) {
      // The user is authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // The user is not authenticated, return an unauthorized response
      return res.status(401).json({ error: 'Not authenticated' });
    }
  }
}