import { envs } from "../core/config/env"

export const getSpreadSheet = () => {
    const spreadSheetId: string = envs.SPREADSHEET_ID
    return spreadSheetId;
}