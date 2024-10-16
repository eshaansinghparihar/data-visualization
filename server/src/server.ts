import express, { type Request, type Response} from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './config/database';
import errorMiddleware from './middleware/errorMiddleware';
import bodyParser from 'body-parser';
import routes from './routes/index';
import { HttpCode, ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants';


interface ServerOptions {
  port: number;
  apiPrefix: string;
//   mongoDbUri : string;
}

export const createServer = (options: ServerOptions) => {
  const app = express();
  const { port, apiPrefix } = options;

  app.use(express.json());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(
    rateLimit({
      max: ONE_HUNDRED,
      windowMs: SIXTY * SIXTY * ONE_THOUSAND,
      message: 'Too many requests from this IP, please try again in one hour',
    })
  );

  app.get('/api', (_req: Request, res: any) => {
    try {
      return res.status(HttpCode.OK).send({
        message: `Welcome to Initial API! \n Endpoints available at http://localhost:${port}/`,
      });
    } catch (error) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send({ error, message: 'Internal Server Error' });
    }
  });

  app.use(apiPrefix, routes);

  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });

  app.use(errorMiddleware);

  return {
    start: () => {
      return new Promise<void>(async (resolve, reject) => {
        // await connectDB(mongoDbUri);
        app.listen(port, () => {
          console.log(`Server running on port ${port}...`);
          resolve();
        }).on('error', reject);
      });
    }
  };
};
