import express from "express";
import { isAuthenticted, logout, resetPassword, sendResetOtp, sendVerifyOtp, signin, signup, verifyemail } from "../Controllers/Auth.js";
import userAuth from "../MiddleWare/UserAuth.js";

const authRouter = express.Router();
authRouter.post("/register",signup);
authRouter.post("/login",signin);
authRouter.post("/logout",logout);
authRouter.post("/verify-account",userAuth,sendVerifyOtp);
authRouter.post("/verify-otp",userAuth,verifyemail);
authRouter.get("/is-auth",userAuth,isAuthenticted);
authRouter.post("/ResetPassOtp",sendResetOtp);
authRouter.post("/ResetPass",resetPassword);

export default authRouter;