import express from "express";
import { userRegistration, verifyUser } from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
export default router;
//# sourceMappingURL=auth.router.js.map