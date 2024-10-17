import { Age } from "./age";
import { Gender } from "./gender";

export interface Filters {
    age? : Age;
    gender? : Gender;
    startDate? : string;
    endDate? : string;   
}