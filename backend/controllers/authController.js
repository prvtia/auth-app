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
        const newUser = new User({ email, username, password });
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

module.exports = { setCredentials, loginUser };