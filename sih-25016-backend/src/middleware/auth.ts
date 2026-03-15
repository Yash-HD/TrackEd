// src/middleware/auth.ts

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import type { JwtPayload } from '../config/types.js';
import type { Role } from '@prisma/client';

// Load the secret used to sign/verify JWTs
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Verifies the JWT token from the Authorization header.
 * If valid, attaches decoded user info to req.user and calls next().
 * If invalid/missing, throws an ApiError.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access denied. No token provided.');
        }

        // Extract the token part after "Bearer "
        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Access denied. Malformed token.');
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // Attach user info to the request object for downstream use
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        // jwt.verify throws its own errors (TokenExpiredError, JsonWebTokenError)
        throw new ApiError(401, 'Invalid or expired token.');
    }
};

/**
 * Role-based authorization middleware factory.
 * Returns a middleware that checks if req.user.role is in the allowed list.
 * 
 * Usage: router.get('/admin-only', authenticate, authorize('ADMIN'), controller)
 */
export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required.');
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, 'Forbidden. You do not have permission to access this resource.');
        }

        next();
    };
};
