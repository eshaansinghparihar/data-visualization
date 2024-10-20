import { Request, Response, NextFunction } from 'express';
import { BadRequestError, InternalServerError, TooManyRequestsError } from './errorHandler';

const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof BadRequestError || err instanceof InternalServerError || err instanceof TooManyRequestsError) {
        res.status(err.status).json({ error: err.message });
    }
    else {
        res.status(500).json('Something went wrong!');
    }
};

export default errorMiddleware;