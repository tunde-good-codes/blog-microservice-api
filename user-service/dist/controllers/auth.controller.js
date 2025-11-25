import bcrypt from "bcryptjs";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp, } from "../utils/auth.helper.js";
import { ValidationError } from "@shared/error-handler/index.js";
import User from "../models/User.js";
export const userRegistration = async (req, res, next) => {
    try {
        validateRegistrationData(req.body, "user");
        const { name, email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw next(new ValidationError("user already exists with this email"));
        }
        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "user-activation-mail");
        res.status(200).json({
            message: "otp sent to email. please verify your account",
        });
    }
    catch (e) {
        console.log(e);
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const { name, email, password, otp } = req.body;
        if (!name || !email || !password || !otp) {
            return next(new ValidationError("All fields are required"));
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw next(new ValidationError("user already exists with this email"));
        }
        await verifyOtp(email, otp, next);
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashPassword,
        });
        res.status(201).json({
            message: "user registered successfully",
            success: true,
        });
    }
    catch (e) {
        return next(e);
    }
};
//# sourceMappingURL=auth.controller.js.map