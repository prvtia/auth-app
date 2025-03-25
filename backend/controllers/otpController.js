const User = require("../models/User");
const nodemailer = require("nodemailer");

const sendOTP = async (req, res) => 
{
    try 
    {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry
    
        // Store OTP in the new collection
        await OTP.findOneAndUpdate(
            { email },
            { otp, otpExpires },
            { upsert: true, new: true }
        );
    
        // Send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
        });
    
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP: ${otp}`
        });

        res.json({ message: "OTP sent successfully" });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server Error" });
    }
};
    
const OTP = require("../models/OTP");

const verifyOTP = async (req, res) => 
{
    try 
    {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord || otpRecord.otp !== otp || Date.now() > otpRecord.otpExpires) 
        {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP verified, delete it from the database
        await OTP.deleteOne({ email });
    
        res.json({ message: "OTP verified successfully" });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server Error" });
    }
};
    
module.exports = { sendOTP, verifyOTP };
