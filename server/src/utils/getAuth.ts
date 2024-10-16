import { envs } from "../core/config/env"

export const getAuth = () => {
    const googleApiKey: string = envs.GOOGLE_SHEETS_API_KEY
    return googleApiKey;
}