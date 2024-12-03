import { body, ValidationChain } from 'express-validator';

// Validation rules for user registration
export const userValidationRules = (): ValidationChain[] => {
    return [
        body('name', 'Must be at least 2 characters')
            .trim()
            .isString()
            .isLength({ min: 2 }),
        body('email', 'Invalid email format')
            .trim()
            .isEmail()
            .notEmpty(),
        body('password', 'Must be at least 6 characters')
            .trim()
            .isLength({ min: 6 })
    ];
};

// Validation rules for user login
export const loginValidationRules = (): ValidationChain[] => {
    return [
        body('email', 'Invalid email format')
            .isEmail()
            .notEmpty(),
        body('password', 'Must be at least 6 characters')
            .isLength({ min: 6 })
            .notEmpty()
    ];
};
