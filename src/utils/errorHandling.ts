import { Error } from 'mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';

export const isMongooseError = (err: any): boolean => {
    return err instanceof Error;
};

export const jwtError = (err: any): boolean => {
    return err instanceof JsonWebTokenError;
};

export const _throw = (err: any): never => {
    throw err;
};
