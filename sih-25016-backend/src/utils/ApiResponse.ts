// src/utils/ApiResponse.ts

class ApiResponse<T> {
    public statusCode: number;
    public data: T;
    public message: string;
    public success: boolean;

    constructor(statusCode: number, data: T, message: string = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        // Any status code in the 2xx range is a success
        this.success = statusCode >= 200 && statusCode < 300;
    }
}

export { ApiResponse };
