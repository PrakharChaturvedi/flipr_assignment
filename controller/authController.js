import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// SIGN UP
const signUp = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = await User.create({ name, email, password: hashedPassword, address });
        res.status(201).json({ message: 'User registered successfully.', customerId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// SIGN IN
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { signUp, signIn };
