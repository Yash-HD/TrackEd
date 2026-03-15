// src/utils/ApiError.ts

/**
 * Custom API Error Class
 * 
 * WHY: We extend the native JavaScript Error class to create a standardized
 * error object that carries an HTTP status code. This lets us throw errors
 * from ANYWHERE in our codebase (controllers, services, middleware) and have
 * them all caught and formatted consistently by a single global error handler.
 * 
 * HOW IT'S USED:
 *   throw new ApiError(404, "User not found");
 *   throw new ApiError(400, "Validation failed", [{ field: "email", message: "Invalid format" }]);
 * 
 * The global error handler middleware (errorHandler.ts) will catch these
 * and send a properly formatted JSON response to the client.
 */
class ApiError extends Error {
    /**
     * The HTTP status code to send back to the client.
     * Examples: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
     */
    public statusCode: number;

    /**
     * Optional array for detailed error information.
     * Useful for validation errors where multiple fields might be invalid.
     * Example: [{ field: "email", message: "Must be a valid email" }]
     */
    public errors: any[];

    /**
     * A flag to distinguish our custom ApiErrors from unexpected system errors.
     * If success is false, the error handler knows this was an intentional, 
     * controlled error thrown by our application logic.
     */
    public success: boolean;

    /**
     * @param statusCode - The HTTP status code (e.g., 400, 401, 404, 500)
     * @param message    - A human-readable error message for the client
     * @param errors     - Optional array of detailed error objects (e.g., validation issues)
     */
    constructor(statusCode: number, message: string, errors: any[] = []) {
        // Call the parent Error class constructor with our message.
        // This sets `this.message` and initializes the error stack trace.
        super(message);

        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;

        // This line is crucial for TypeScript class inheritance from built-in classes.
        // Without it, `instanceof ApiError` checks might fail in some environments.
        // It ensures our custom class correctly extends the Error prototype chain.
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export { ApiError };
