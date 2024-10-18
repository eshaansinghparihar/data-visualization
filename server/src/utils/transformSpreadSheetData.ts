export default function transformSpreadSheetData(data: string[][]): Record<string, string>[]{
    const transformedData : Record<string, string>[] = [];

    const keys = data[0];
    data.forEach((elem, index)=>{
        if(index!==0)
        {
            const obj : Record<string, string>= {}
            elem.forEach((item, index) => {
            const key = keys[index]
            obj[key] = item;
            });
            transformedData.push(obj)
        }
    });
    return transformedData;
} 