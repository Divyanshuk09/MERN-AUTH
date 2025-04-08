import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './DB/index.js';
import authRouter from './Routes/Auth.Router.js';
import userRouter from './Routes/User.Router.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// ✅ Corrected allowedOrigins array
const allowedOrigins = [
  'https://mern-auth-git-main-divyanshuk09s-projects.vercel.app',
  'https://mern-auth-sooty-kappa.vercel.app',
  'https://mern-auth-6762.vercel.app',
  'https://mern-auth-divyanshuk09s-projects.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send("API IS WORKING");
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
