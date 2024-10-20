import { envs } from './core/config/env';
import { createServer } from './server';

const main = async (): Promise<void> => {
  const options = {
    port: envs.SERVER_PORT,
    apiPrefix: envs.API_PREFIX,
    mongoDbUri : envs.MONGODB_URI
  };

  const server = createServer(options);
  await server.start();
};

main().catch((error) => {
  console.error('Error starting the server:', error);
});
