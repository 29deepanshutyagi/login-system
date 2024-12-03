import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { User } from '../models/User';
import { isMongooseError, jwtError, _throw } from '../utils/errorHandling';

interface JwtPayload {
    _id: string;
}

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.get('Authorization');
    try {
        if (!token) {
            const error = new JsonWebTokenError('Access-denied');
            (error as any).statusCode = 401; // Extend to include custom statusCode
            throw error;
        }

        const verified = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;

        const user = await User.findById(verified._id);
        if (!user) {
            const error = new JsonWebTokenError('User not found!');
            (error as any).statusCode = 404; // Extend to include custom statusCode
            throw error;
        }

        req.user = verified;
        next();
    } catch (err) {
        isMongooseError(err) || jwtError(err) ? next(err) : _throw(err);
    }
};

export default authenticate;
