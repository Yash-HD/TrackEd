// src/config/types.ts
// Extend Express's Request interface to include our custom `user` property.
// This tells TypeScript: "After auth middleware runs, req.user exists."

import type { Role } from '@prisma/client';

export interface JwtPayload {
    userId: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
