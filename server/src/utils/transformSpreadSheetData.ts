export default function transformSpreadSheetData(data: string[][]): Record<string, string>[]{
    let transformedData : Record<string, string>[] = [];

    // TO DO : Add logic to convert the dates to Date MM/DD/YYYY from String format.


    const keys = data[0];
    data.forEach((elem, index)=>{
        if(index!==0)
        {
            let obj : Record<string, string>= {}
            elem.forEach((item, index) => {
            const key = keys[index]
            obj[key] = item;
            });
            transformedData.push(obj)
        }
    });
    return transformedData;
} 