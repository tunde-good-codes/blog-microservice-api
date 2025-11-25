import { NextFunction } from "express";
export declare const validateRegistrationData: (data: any, userType: "user" | "seller") => void;
export declare const checkOtpRestrictions: (email: string, next: NextFunction) => Promise<void>;
export declare const sendOtp: (email: string, name: string, template: string) => Promise<void>;
export declare const trackOtpRequests: (email: string, next: NextFunction) => Promise<void>;
export declare const verifyOtp: (email: string, otp: string, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.helper.d.ts.map