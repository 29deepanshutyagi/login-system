import { Request, Response, NextFunction } from 'express';

// Middleware to handle unknown URLs
export const urlNotFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`URL you requested ${req.url} is not found on this server!`);
    (error as any).statusCode = 404; // Dynamically adding statusCode to Error
    next(error); // Pass error to the global error handler
};

// Global Error Handling Middleware
export const globalErrorHandling = (
    err: { statusCode?: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(err.statusCode || 500).json({
        ok: 0,
        error: err.message,
    });
};
