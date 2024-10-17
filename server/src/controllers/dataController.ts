import { DataService } from '../services/dataService';
import { queryParam } from '../decorators/queryParam';
import { Age } from '../types/age';
import { Gender } from '../types/gender';
import isValidDate from '../utils/isValidDate';
import { Filters } from '../types/filters';
import { BadRequestError } from '../middleware/errorHandler';

export class DataController {
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
    }

    async getData(
        @queryParam('age') age?: Age,
        @queryParam('gender') gender?: Gender,
        @queryParam('startDate') startDate?: string,
        @queryParam('endDate') endDate?: string
    ) {
        if (age && !Object.values(Age).includes(age as Age)) {
            throw new Error("Invalid age value. Must be '15-25' or '>25'.");
        }

        if (gender && !Object.values(Gender).includes(gender as Gender)) {
            throw new BadRequestError("Invalid gender value. Must be 'Male' or 'Female'.");
        }

        if ((startDate && !endDate) || (endDate && !startDate)) {
            throw new BadRequestError("Both 'startDate' and 'endDate' must be provided together. Please ensure that if one is specified, the other is also specified. Example format: 'DD/MM/YYYY'.");
        }        

        if (startDate && !isValidDate(startDate)) {
            throw new BadRequestError("Invalid startDate format. Use DD/MM/YYYY.");
        }

        if (endDate && !isValidDate(endDate)) {
            throw new BadRequestError("Invalid endDate format. Use DD/MM/YYYY.");
        }
        
        const filters : Filters = { age, gender, startDate, endDate };
        const data = await this.dataService.fetchData(filters);
        return data;
    }
}
