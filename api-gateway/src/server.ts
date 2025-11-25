import express, { NextFunction, Request, Response } from "express";
import logger from "./utils/logger";
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit";
import proxy from "express-http-proxy";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

//const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

app.set("trust proxy", 1);

// Fixed rate limiter - removed custom keyGenerator
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100), // reg users: 1000 requests, non-reg: 100
  message: {
    error: "too many requests in 15 minutes. please try again",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Remove keyGenerator - let express-rate-limit handle it automatically
});

app.use(limiter);

// Health check endpoint - before proxy
app.get("/gateway-health", (req: Request, res: Response) => {
  res.json({
    message: "API Gateway is healthy!",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to E-Commerce Multi-Vendor API Gateway",
    version: "1.0.0",
    services: {
      auth: `http://localhost:${process.env.AUTH_SERVICE_PORT}`,
      gateway: `http://localhost:${process.env.API_GATEWAY_PORT}`,
    },
  });
});

// app.use(
//   "/auth",
//   proxy(`http://localhost:${process.env.AUTH_SERVICE_PORT}`, {
//     proxyReqPathResolver: (req) => {
//       // Remove /auth prefix when forwarding to auth service
//       return req.url.replace("/auth", "");
//     },
//   })
// );
app.use("/auth", proxy("http://localhost:8081"));

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error now!!!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const port = process.env.API_GATEWAY_PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`); // Fixed syntax
  console.log(`Gateway health check: http://localhost:${port}/gateway-health`);
});

server.on("error", console.error);

app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

app.set("trust proxy", 1);

//rate limiting
// const ratelimitOptions = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: (req: Request, res: Response) => {
//     logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
//     res.status(429).json({ success: false, message: "Too many requests" });
//   },
//   store: new RedisStore({
//     sendCommand: (...args: any) => redisClient.call(...args),
//   }),
// });

// app.use(ratelimitOptions);

// app.use((req, res, next) => {
//   logger.info(`Received ${req.method} request to ${req.url}`);
//   logger.info(`Request body, ${req.body}`);
//   next();
// });

// // api-gateway: - 8080/v1/auth/register
// // identity-service-register: - 3001/api/auth/register
// const proxyOptions = {
//   proxyReqPathResolver: (req:Request) => {
//     return req.originalUrl.replace(/^\/v1/, "/api");
//   },
//   proxyErrorHandler: (err, res, next) => {
//     logger.error(`Proxy error: ${err.message}`);
//     res.status(500).json({
//       message: `Internal server error`,
//       error: err.message + " error from proxyOptions",
//     });
//   },
// };

// //setting up proxy for our auth service -> auth-routes
// app.use(
//   "/v1/auth",
//   proxy(process.env.AUTH_SERVICE_URL, {
//     ...proxyOptions,
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       proxyReqOpts.headers["Content-Type"] = "application/json";
//       return proxyReqOpts;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//       logger.info(
//         `Response received from Identity service: ${proxyRes.statusCode}`
//       );

//       return proxyResData;
//     },
//   })
// );

// //setting up proxy for our post service
// app.use(
//   "/v1/posts",
//   validateToken,
//   proxy(process.env.POST_SERVICE_URL, {
//     ...proxyOptions,
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       proxyReqOpts.headers["Content-Type"] = "application/json";
//       proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

//       return proxyReqOpts;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//       logger.info(
//         `Response received from Post service: ${proxyRes.statusCode}`
//       );

//       return proxyResData;
//     },
//   })
// );

// //setting up proxy for our media service
// app.use(
//   "/v1/media",
//   validateToken,
//   proxy(process.env.MEDIA_SERVICE_URL, {
//     ...proxyOptions,
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
//       if (!srcReq.headers["content-type"].startsWith("multipart/form-data")) {
//         proxyReqOpts.headers["Content-Type"] = "application/json";
//       }

//       return proxyReqOpts;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//       logger.info(
//         `Response received from media service: ${proxyRes.statusCode}`
//       );

//       return proxyResData;
//     },
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/v1/search",
//   validateToken,
//   proxy(process.env.SEARCH_SERVICE_URL, {
//     ...proxyOptions,
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       proxyReqOpts.headers["Content-Type"] = "application/json";
//       proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

//       return proxyReqOpts;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//       logger.info(
//         `Response received from Search service: ${proxyRes.statusCode}`
//       );

//       return proxyResData;
//     },
//   })
// );

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
  logger.info(
    `Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`
  );
  logger.info(
    `Post service is running on port ${process.env.POST_SERVICE_URL}`
  );
  //   logger.info(
  //     `Media service is running on port ${process.env.MEDIA_SERVICE_URL}`
  //   );
  //   logger.info(
  //     `Search service is running on port ${process.env.SEARCH_SERVICE_URL}`
  //   );
  logger.info(`Redis Url ${process.env.REDIS_URL}`);
});
