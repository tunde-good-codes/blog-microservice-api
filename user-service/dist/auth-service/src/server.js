import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router.js";
import { errorMiddleware } from "@shared/error-handler/error-middleware.js";
const app = express();
dotenv.config();
connectDb();
app.use(errorMiddleware);
app.use(cookieParser());
// Your routes here
app.use("/api", router);
app.get("/api", (req, res) => {
    res.send({ message: "Welcome to auth-service!" });
});
// Add this endpoint
app.get("/auth", (req, res) => {
    res.json({
        message: "Auth service is working via gateway!",
        success: true,
        timestamp: new Date().toISOString(),
    });
});
// Keep your existing root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "auth-service is here",
        success: true,
    });
});
// Error middleware MUST be last
app.use(errorMiddleware);
const PORT = process.env.AUTH_SERVICE_PORT || 8081;
const server = app.listen(PORT, () => {
    console.log(`Auth Service listening at http://localhost:${PORT}/api`);
    console.log(`Swagger Service listening at http://localhost:${PORT}/docs`);
});
server.on("error", console.error);
//# sourceMappingURL=server.js.map