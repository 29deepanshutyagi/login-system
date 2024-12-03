import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        // No validation errors, proceed to the next middleware
        return next();
    }

    // Extract and format the validation errors
    const extractedErrors: { [key: string]: string }[] = [];
    errors.array().forEach((err) => extractedErrors.push({ [err.param]: err.msg }));

    // Respond with validation errors
    res.status(422).json({
        errors: extractedErrors,
    });
};

export default validate;
