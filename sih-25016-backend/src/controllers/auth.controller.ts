// src/controllers/auth.controller.ts

import type { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import type { Role } from '@prisma/client';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { role, identifier, password } = req.body;

        // Basic validation
        if (!role || !identifier || !password) {
            throw new ApiError(400, 'Role, identifier, and password are required');
        }

        // Validate that the provided role is a valid enum value
        const validRoles: Role[] = ['ADMIN', 'FACULTY', 'STUDENT'];
        if (!validRoles.includes(role as Role)) {
            throw new ApiError(400, 'Invalid role specified');
        }

        // Call the service layer to handle the actual login logic
        const result = await loginUser(role as Role, identifier, password);

        // Send a standardized success response
        res.status(200).json(
            new ApiResponse(200, result, 'Login successful')
        );
    } catch (error) {
        // Pass any errors (like 401 Invalid Credentials) to the global error handler
        next(error);
    }
};
