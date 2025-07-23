import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        
            await newUser.save();

            const token = generateToken(newUser._id);

            res
            .status(201)
            .header("Authorization",`Bearer ${token}`)
            .json({ 
                message: "User registered successfully", 
                token,
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                }
             });
            return;

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.status(200)
        .header("Authorization",`Bearer ${token}`)
        .json({ 
            message: "Login successful", 
            token,
            user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
         });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}