import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './DB/index.js';
import authRouter from './Routes/Auth.Router.js';
import userRouter from './Routes/User.Router.js';

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

connectDB();
const allowedOrigins = ['https://mern-auth-sooty-kappa.vercel.app/'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
  res.send("API IS WORKING");
})

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
})