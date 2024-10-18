import { google } from 'googleapis';
import { getAuth } from '../utils/getAuth';
import { getSpreadSheet } from '../utils/getSpreadSheet';
import transformSpreadSheetData from '../utils/transformSpreadSheetData';
import { Filters } from '../types/filters';
import { InternalServerError } from '../middleware/errorHandler';
import { convertToTimeStamp } from '../utils/convertToTimeStamp';

export class DataService {
    private sheets = google.sheets('v4');
    async fetchData(filters: Filters) {
        try{
            const request = {
                spreadsheetId: getSpreadSheet(),
                range: 'Sheet3!A:Z',
                auth : getAuth(),
            };
    
            const response = await this.sheets.spreadsheets.values.get(request);
            const rows : string[][] = response.data.values as string[][];
    
            return this.filterData(rows, filters);
        }
        catch(error)
        {
            throw new InternalServerError(error as string)
        }
        
    }

    private filterData(data: string[][], filters: Filters) {
        const mappedData = transformSpreadSheetData(data)
        // console.log('Mapped Data',mappedData[0]);

        const filteredData = mappedData.filter(item => {
            const {age, gender, startDate, endDate} = filters;
            let isMatch = true;
            if (age) {
                isMatch = isMatch && item.Age === age;
            }
            if (gender) {
                isMatch = isMatch && item.Gender === gender;
            }
            
            if (startDate && endDate) {
                const itemTimeStamp = convertToTimeStamp(item.Day);
                const startDateTimeStamp = convertToTimeStamp(startDate);
                const endDateTimeStamp = convertToTimeStamp(endDate);
                isMatch = isMatch && itemTimeStamp >= startDateTimeStamp && itemTimeStamp <= endDateTimeStamp;
            }

            return isMatch;
        })
        return filteredData;
    }
}
