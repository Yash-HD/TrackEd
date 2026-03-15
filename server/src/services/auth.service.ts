// src/services/auth.service.ts

import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import type { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const loginUser = async (role: Role, identifier: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { identifier }
    });

    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    if (user.role !== role) {
        throw new ApiError(403, `Access denied. You are not authorized as a ${role}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            departmentId: user.departmentId
        }
    };
};
