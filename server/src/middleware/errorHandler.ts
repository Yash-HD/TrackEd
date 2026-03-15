// src/middleware/errorHandler.ts

import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

/**
 * Global Error Handler Middleware
 * 
 * THE 4 PARAMETERS: Express distinguishes error handlers from normal 
 * middleware by the number of arguments. Normal middleware has 3 (req, res, next).
 * Error handlers MUST have exactly 4 (err, req, res, next).
 * Even if we don't use `next` here, we must include it in the signature.
 * 
 * HOW IT WORKS:
 * 1. If the error is an instance of our ApiError class, we know the 
 *    statusCode and message are safe to send to the client.
 * 2. If the error is anything else (a Prisma error, a null reference, etc.),
 *    we send a generic 500 Internal Server Error to avoid leaking 
 *    sensitive information like stack traces or database details.
 */
const errorHandler = (
    err: Error,           // The error object that was thrown or passed via next(err)
    _req: Request,        // The request object (prefixed with _ because we don't use it here)
    res: Response,        // The response object — we use this to send back the error JSON
    _next: NextFunction   // Must be in the signature for Express to recognize this as error middleware
): void => {

    // --- CASE 1: It's one of OUR controlled ApiErrors ---
    // We check using `instanceof` to see if the error was intentionally thrown
    // by our application logic using `throw new ApiError(...)`.
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: err.success,         // Always false for errors
            message: err.message,         // The human-readable error message we set
            errors: err.errors,           // Any detailed validation errors (empty array if none)
        });
        return; // Important: stop execution here so we don't fall through to Case 2
    }

    // --- CASE 2: It's an UNEXPECTED error (something we didn't anticipate) ---
    // This catches things like: null pointer errors, Prisma connection failures,
    // JSON parse errors, or any other unhandled exception.
    // 
    // SECURITY: We NEVER send the actual error message or stack trace to the client.
    // That could expose database table names, file paths, or other internal details.
    // Instead, we log the full error on the server (for debugging) and send a generic message.
    console.error('⚠️  Unhandled Error:', err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',  // Generic message — safe for the client to see
        errors: [],
    });
};

export { errorHandler };
