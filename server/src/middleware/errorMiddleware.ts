import { Request, Response, NextFunction } from 'express';
import { BadRequestError, InternalServerError } from './errorHandler';

const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof BadRequestError || err instanceof InternalServerError) {
        res.status(err.status).json({ error: err.message });
    }
    else {
        res.status(500).json('Something went wrong!');
    }
};

export default errorMiddleware;