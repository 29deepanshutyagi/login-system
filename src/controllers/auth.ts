import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { isMongooseError, jwtError, _throw } from '../utils/errorHandling';

// POST /signup
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        
        // Create a new user
        const user = new User({
            name,
            email,
            password
        });

        // Save user to the database
        const savedUser = await user.save();

        res.status(201).json({
            ok: 1,
            user: savedUser
        });
    } catch (err) {
        isMongooseError(err) ? next(err) : _throw(err);
    }
};

// POST /login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if the email exists
        const user = await User.emailExists(email);

        // Verify the password
        await user.comparePassword(password);

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id },
            process.env.TOKEN_SECRET as string, // Ensure TOKEN_SECRET is typed as string
            { expiresIn: '1h' } // Optional: Set token expiration
        );

        // Send the token in the response header
        res.setHeader('Authorization', token);

        res.json({
            ok: 1,
            msg: 'Logged in :)'
        });
    } catch (err) {
        isMongooseError(err) || jwtError(err) ? next(err) : _throw(err);
    }
};
