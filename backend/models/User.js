const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
{
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String }, // Stores OTP temporarily
    otpExpires: { type: Date } // OTP expiration time
});

// Hash password before saving
// UserSchema.pre("save", async function (next) 
// {
//     if (this.password.startsWith("$2")) return next();
//     console.log("Hashing "+this.password);
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

module.exports = mongoose.model("User", UserSchema);
