import { config } from 'dotenv';
import path from 'path';
import { get } from 'env-var';

config({ path: path.resolve(__dirname, '../../../../.env') });

export const envs = {
 PORT: get('PORT').required().asPortNumber(),
 API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
 NODE_ENV: get('NODE_ENV').default('development').asString(),
 MONGODB_URI : get('MONGODB_URI').required().asString()
};