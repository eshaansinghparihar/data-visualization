import { config } from 'dotenv';
import path from 'path';
import { get } from 'env-var';

config({ path: path.resolve(__dirname, '../../../../.env') });

export const envs = {
 HOSTNAME : get('HOSTNAME').required().asString(),
 SERVER_PORT: get('SERVER_PORT').required().asPortNumber(),
 CLIENT_PORT:get('CLIENT_PORT').required().asPortNumber(),
 API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
 NODE_ENV: get('NODE_ENV').default('development').asString(),
 MONGODB_URI : get('MONGODB_URI').asString(),
 GOOGLE_SHEETS_API_KEY : get('GOOGLE_SHEETS_API_KEY').required().asString(),
 SPREADSHEET_ID : get('SPREADSHEET_ID').required().asString()
};