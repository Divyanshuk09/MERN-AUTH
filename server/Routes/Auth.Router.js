import {Router} from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyOtp } from '../Controllers/Auth.Controller.js'
import userAuth from '../Middleware/UserAuth.js';

const authRouter = Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-Account',userAuth,verifyOtp )
authRouter.get('/isAuthenticated',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);


export default authRouter;