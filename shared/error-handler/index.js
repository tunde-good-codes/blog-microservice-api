"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.ServiceUnavailableError = exports.InternalServerError = exports.TooManyRequestsError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(message, statusCode, isOperational = true, details) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = this.constructor.name;
    }
}
exports.AppError = AppError;
// 400 - Bad Request
class BadRequestError extends AppError {
    constructor(message = "Bad request", details) {
        super(message, 400, true, details);
    }
}
exports.BadRequestError = BadRequestError;
// 401 - Unauthorized
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access", details) {
        super(message, 401, true, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
// 403 - Forbidden
class ForbiddenError extends AppError {
    constructor(message = "Access forbidden", details) {
        super(message, 403, true, details);
    }
}
exports.ForbiddenError = ForbiddenError;
// 404 - Not Found
class NotFoundError extends AppError {
    constructor(message = "Resource not found", details) {
        super(message, 404, true, details);
    }
}
exports.NotFoundError = NotFoundError;
// 409 - Conflict
class ConflictError extends AppError {
    constructor(message = "Resource conflict", details) {
        super(message, 409, true, details);
    }
}
exports.ConflictError = ConflictError;
// 422 - Unprocessable Entity
class ValidationError extends AppError {
    constructor(message = "Validation failed", details) {
        super(message, 422, true, details);
    }
}
exports.ValidationError = ValidationError;
// 429 - Too Many Requests
class TooManyRequestsError extends AppError {
    constructor(message = "Too many requests", details) {
        super(message, 429, true, details);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
// 500 - Internal Server Error
class InternalServerError extends AppError {
    constructor(message = "Internal server error", details) {
        super(message, 500, false, details);
    }
}
exports.InternalServerError = InternalServerError;
// 503 - Service Unavailable
class ServiceUnavailableError extends AppError {
    constructor(message = "Service unavailable", details) {
        super(message, 503, false, details);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
// Error Handler Middleware
// export const errorHandler = (
//   err: Error | AppError,
//   req: any,
//   res: any,
//   next: any
// ) => {
//   if (err instanceof AppError) {
//     return res.status(err.statusCode).json({
//       success: false,
//       error: {
//         message: err.message,
//         statusCode: err.statusCode,
//         details: err.details,
//         ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//       },
//     });
//   }
//   // Handle unknown errors
//   console.error("Unexpected error:", err);
//   return res.status(500).json({
//     success: false,
//     error: {
//       message: "Internal server error",
//       statusCode: 500,
//       ...(process.env.NODE_ENV === "development" && {
//         originalError: err.message,
//         stack: err.stack,
//       }),
//     },
//   });
// };
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=index.js.map