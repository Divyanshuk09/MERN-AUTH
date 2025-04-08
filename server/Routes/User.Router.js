import express, { Router } from 'express'
import { getUserData } from '../Controllers/User.Controller.js';
import userAuth from '../Middleware/UserAuth.js';

const userRouter = Router();

userRouter.get('/user-details', userAuth, getUserData);

export default userRouter;