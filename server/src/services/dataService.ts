import { google } from 'googleapis';
import { getAuth } from '../utils/getAuth';
import { getSpreadSheet } from '../utils/getSpreadSheet';
import transformSpreadSheetData from '../utils/transformSpreadSheetData';

export class DataService {
    private sheets = google.sheets('v4');

    async fetchData(filters: any) {
        const request = {
            spreadsheetId: getSpreadSheet(),
            range: 'Sheet3!A:I',
            auth : getAuth(),
        };

        const response = await this.sheets.spreadsheets.values.get(request);
        const rows : string[][] = response.data.values as string[][];

        // Apply filtering based on the filters object
        return this.filterData(rows, filters);
    }

    private filterData(data: string[][], filters: any) {
        // Implement your filtering logic here
        //Pass the data to an ETL service for mapping
        const mappedData = transformSpreadSheetData(data)
        return mappedData; // Return filtered data
    }
}
