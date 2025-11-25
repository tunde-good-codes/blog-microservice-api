"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const _1 = require(".");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof _1.AppError) {
        console.log(`error: ${req.method} ${req.url} - ${err.message}`);
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }
    console.error("unhandled error:", err);
    return res.status(500).json({
        error: "something went wrong. try again",
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error-middleware.js.map