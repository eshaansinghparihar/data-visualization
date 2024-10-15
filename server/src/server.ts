import express, { type Response, type Request } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { HttpCode, ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants';

interface ServerOptions {
 port: number;
 apiPrefix: string;
}

export class Server {
 private readonly app : express.Application = express() as express.Application;
 private readonly port: number;

 constructor(options: ServerOptions) {
  const { port } = options;
  this.port = port;
 }

 async start(): Promise<void> {
  //* Middlewares
  this.app.use(express.json());
  this.app.use(express.urlencoded({ extended: true }));
  this.app.use(compression());

  this.app.use(
    rateLimit({
     max: ONE_HUNDRED,
     windowMs: SIXTY * SIXTY * ONE_THOUSAND,
     message: 'Too many requests from this IP, please try again in one hour'
    })
   );

  this.app.get('/', (_req: Request, res: Response) => {
    try{
        return res.status(HttpCode.OK).send({
            message: `Welcome to Initial API! \n Endpoints available at http://localhost:${this.port}/`
           });
    }
    catch(error)
    {
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).send({ error: error , message : 'Internal Server Error' });
    }
   });

  this.app.listen(this.port, () => {
   console.log(`Server running on port ${this.port}...`);
  });
 }
}