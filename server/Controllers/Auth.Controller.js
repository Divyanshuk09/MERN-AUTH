import User from "../Models/User.Model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import transporter from "../Nodemailer/Nodemailer.js";
import { PASSWORD_RESET_TEMPLATE, EMAIL_VERIFY_TEMPLATE } from "../Nodemailer/EmailTemplates.js";

// Register Controller
export const register = async (req, res) => {

    const { name, email, password } = req.body;
    // 🔹 Check karo ki user ne saare required fields diye hai ya nahi
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: 'Missing Details'
        });
    }

    try {
        // 🔹 Dekho agar user pehle se exist karta hai toh
        
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User Already Exist'
            });
        }

        // 🔹 Password ko hash kar do before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Naya user create karo
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // 🔹 JWT token create karo
        const token = jwt.sign(
            { id: user._id, purpose: "account_verification" },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 🔹 Token ko cookie mein store karo
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 🔹 Welcome email bhejna
        const mailOptions = {
            from: process.env.SENDER_EMAIL_ID,
            to: email,
            subject: "Welcome to MyApp!",
            html: `<h2>Hi ${name}, welcome to MyApp! 🎉</h2>
                   <p>We're glad to have you here</p>`
        }

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailErr) {
        }
        user.password = undefined
        // 🔹 Final response bhej do
        return res.json({
            success: true,
            user: user,
            message: 'User registered successfully'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    // 🔹 Email aur password dono required hai
    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        // 🔹 Pehle user ko find karo
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // 🔹 Password compare karo
        const IsMatch = await bcrypt.compare(password, user.password);
        if (!IsMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

        // 🔹 Token generate karo
        const token = jwt.sign(
            { id: user._id, purpose: "account_verification" },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 🔹 Token ko cookie mein daalo
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        user.password = undefined
        return res.json({
            success: true,
            user: user,
            message: 'User logged in successfully'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// Logout Controller
export const logout = async (req, res) => {
    try {
        // 🔹 Cookie ko clear karo logout ke time
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({
            success: true,
            message: 'User logged out successfully'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// Send OTP for email verification
export const sendVerifyOtp = async (req, res) => {

    try {
        const userId = req?.userId;
        const user = await User.findById(userId);

        // 🔹 User find karo
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // 🔹 Agar already verified hai toh OTP bhejne ki zarurat nahi
        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account is already verified"
            })
        }

        // 🔹 Agar pehle se OTP bheja gaya hai aur expire nahi hua toh error bhejo
        if (user.verifyOtp && user.verifyOtpExpireAt > Date.now()) {
            const remainingMS = user.verifyOtpExpireAt - Date.now();

            const remainingMin = Math.floor(remainingMS / 60000);
            //So dividing by 60000 gives you how many full minutes are left.

            const remainingSec = Math.floor((remainingMS % 60000) / 1000);
            // remainingMs % 60000 gives you what's left after removing full minutes, i.e. leftover milliseconds.
            // Divide that by 1000 to get seconds.

            return res.json({
                success: false,
                message: `OTP already sent. Please wait ${remainingMin} min ${remainingSec} sec before trying again.`,
            });
        }

        // 🔹 OTP generate karo and hash karo
        const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));
        const otp = generateOTP()

        // 🔹 OTP mail karo

        const mailOption = {
            from: process.env.SENDER_EMAIL_ID,
            to: user.email,
            subject: "Account Verification OTP Code!",
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        try {
            await transporter.sendMail(mailOption);

            // Then save OTP only if email sent
            const hashedOTP = await bcrypt.hash(otp, 10)

            user.verifyOtp = hashedOTP;
            user.verifyOtpExpireAt = new Date(Date.now() + 15 * 60 * 1000);

            await user.save();

            res.json({
                success: true,
                message: "Verification OTP sent successfully to user email."
            })
        } catch (emailErr) {
            return res.json({
                success: false,
                message: "Failed to send OTP email. Try again later."
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// Verify OTP controller
export const verifyOtp = async (req, res) => {
    const { userId } = req;
    const {otp} =req.body;

    // 🔹 Required fields check karo
    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Missing detailes"
        })
    }

    try {
        const user = await User.findById(userId)
       
        // 🔹 User exist karta hai ya nahi
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        // 🔹 Kya OTP generate hua tha?
        if (!user.verifyOtp || !user.verifyOtpExpireAt) {
            return res.json({
                success: false,
                message: "No OTP requested"
            });
        }

        // 🔹 OTP expire toh nahi hua?
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP is expired"
            });
        }

        // 🔹 Compare hashed OTP with user input
        const isMatch = await bcrypt.compare(otp, user.verifyOtp);
       

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // 🔹 OTP match hua - verify user
        user.isAccountVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpireAt = null
        await user.save()

        return res.json({
            success: true,
            message: "Account verified successfully!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {

    try {
        return res.json({
            success: true
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//  Send OTP for password reset
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.json({
            success: false,
            message: "Please provide the email"
        });
    }

    try {
        //  Find user with provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        // 🔹 Agar pehle se OTP bheja gaya hai aur expire nahi hua toh error bhejo

        if (user.resetOtp && user.resetOtpExpireAt > Date.now()) {
            const remainingMS = user.resetOtpExpireAt - Date.now();

            const remainingMin = Math.floor(remainingMS / 60000);
            //So dividing by 60000 gives you how many full minutes are left.

            const remainingSec = Math.floor((remainingMS % 60000) / 1000);
            // remainingMs % 60000 gives you what's left after removing full minutes, i.e. leftover milliseconds.
            // Divide that by 1000 to get seconds.

            return res.json({
                success: false,
                message: `OTP already sent. Please wait ${remainingMin} min ${remainingSec} sec before trying again.`,
            });
        }
        //  Generate 6-digit OTP
        const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));
        const otp = generateOTP();

        //  Prepare mail content
        const mailOption = {
            from: process.env.SENDER_EMAIL_ID,
            to: user.email,
            subject: "Reset password OTP Code!",
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };

        try {
            //  Send OTP mail
            await transporter.sendMail(mailOption);

            //  Hash OTP before saving
            const hashedOTP = await bcrypt.hash(otp, 10);
            user.resetOtp = hashedOTP;
            user.resetOtpExpireAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

            await user.save();

            res.json({
                success: true,
                message: "Reset password OTP sent successfully to user email."
            });
        } catch (emailErr) {
            return res.json({
                success: false,
                message: "Failed to send OTP email. Try again later."
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//  Reset Password using OTP
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    //  Check if all required fields are present
    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "Missing Details"
        });
    }

    try {
        //  Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        //  Check if OTP and expiry exist
        if (!user.resetOtp || !user.resetOtpExpireAt) {
            return res.json({
                success: false,
                message: "No OTP requested"
            });
        }

        //  Check if OTP is expired
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP is expired"
            });
        }

        //  Compare hashed OTP
        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        //  Hash new password & update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = null;

        await user.save();

        return res.json({
            success: true,
            message: "Password has been reset successfully!"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
