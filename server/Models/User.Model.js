import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
    password: {
        type: String,
        default: ""
    },
    verifyOtp: {
        type: String,
        default: null
    },
    verifyOtpExpireAt: {
        type: Number,
        default: null
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpireAt: {
        type: Number,
        default: null
    },
}, { timestamps: true })

const User = model('User', userSchema);

export default User;