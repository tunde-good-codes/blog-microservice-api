declare global {
    interface ErrorConstructor {
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    }
}
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly details?: any;
    constructor(message: string, statusCode: number, isOperational?: boolean, details?: any);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ServiceUnavailableError extends AppError {
    constructor(message?: string, details?: any);
}
export declare const asyncHandler: (fn: Function) => (req: any, res: any, next: any) => void;
//# sourceMappingURL=index.d.ts.map