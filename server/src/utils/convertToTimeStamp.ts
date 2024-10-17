export const convertToTimeStamp = (dateString : string) =>{
    const [d, m, y] = dateString.split(/\//).map(element => parseInt(element));
    const date = new Date(y, m - 1, d);
    return date.getTime();
}