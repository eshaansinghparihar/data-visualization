import { DataService } from '../services/dataService';
import { queryParam } from '../decorators/queryParam';

export class DataController {
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
    }

    async getData(
        @queryParam('age') age?: string,
        @queryParam('gender') gender?: string,
        @queryParam('startDate') startDate?: string,
        @queryParam('endDate') endDate?: string
    ) {
        // Logic to build filters based on query params
        const filters = { age, gender, startDate, endDate };
        // Call the data service
        const data = await this.dataService.fetchData(filters); // Provide auth here
        return data;
    }
}
