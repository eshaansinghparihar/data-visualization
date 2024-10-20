import express, { type Request, type Response} from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import cors from 'cors';
import errorMiddleware from './middleware/errorMiddleware';
import bodyParser from 'body-parser';
import routes from './routes/index';
import { ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants';
import { TooManyRequestsError } from './middleware/errorHandler';
import { envs } from './core/config/env';

interface ServerOptions {
  port: number;
  apiPrefix: string;
//   mongoDbUri : string;
}

export const createServer = (options: ServerOptions) => {
  const app = express();
  const { port, apiPrefix } = options;

  app.use(express.json());

  const origin = (envs.NODE_ENV==='development') ? envs.HOSTNAME+':'+envs.CLIENT_PORT : envs.HOSTNAME;

  const corsOptions = {
    origin: origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(
    rateLimit({
      max: ONE_HUNDRED,
      windowMs: SIXTY * SIXTY * ONE_HUNDRED,
      message: 'Too many requests from this IP, please try again in one hour',
      handler: (_req, _res, next)=> {next(new TooManyRequestsError('Too many requests from this IP, please try again in one hour'))}
    })
  );

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
