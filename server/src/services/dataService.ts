import { google } from 'googleapis';
import { getAuth } from '../utils/getAuth';
import { getSpreadSheet } from '../utils/getSpreadSheet';
import transformSpreadSheetData from '../utils/transformSpreadSheetData';
import { Filters } from '../types/filters';

export class DataService {
    private sheets = google.sheets('v4');

    async fetchData(filters: Filters) {
        const request = {
            spreadsheetId: getSpreadSheet(),
            range: 'Sheet3!A:I',
            auth : getAuth(),
        };

        const response = await this.sheets.spreadsheets.values.get(request);
        const rows : string[][] = response.data.values as string[][];

        return this.filterData(rows, filters);
    }

    private filterData(data: string[][], filters: Filters) {
        const mappedData = transformSpreadSheetData(data)
        const filteredData = mappedData.filter(item => {
            const {age, gender, startDate, endDate} = filters;
            let isMatch = true;
            if (age) {
                isMatch = isMatch && item.Age === age;
            }
            if (gender) {
                isMatch = isMatch && item.Gender === gender;
            }
            const itemDate = new Date(item.Day);
            
            if (startDate) {
                const start = new Date(startDate);
                isMatch = isMatch && itemDate >= start;
            }
    
            if (endDate) {
                const end = new Date(endDate);
                isMatch = isMatch && itemDate <= end;
            }
            return isMatch;
        })
        return filteredData;
    }
}
