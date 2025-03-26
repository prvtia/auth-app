const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");

const setCredentials = async (req, res) => 
{
    try 
    {
        const { email, username, password } = req.body;

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) 
        {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) 
        {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User credentials set successfully" });
    } 
    catch (error) 
    {
        console.error("Error in setCredentials:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
    
    
const loginUser = async (req, res) => 
{
    try 
    {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, username: user.username });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server Error" });
    }
};

    const resetPassword = async (req, res) =>
    {
        const { email, newPassword } = req.body;
        try
        {
            const user = await User.findOne({ email });
    
            if (!user)
            {
                return res.status(404).json({ message: 'User not found' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;

            await user.save();
    
            res.status(200).json({ message: 'Password reset successful' });
        }
        catch (error)
        {
            console.log("In error");
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
    
    module.exports = { setCredentials, loginUser, resetPassword };
    