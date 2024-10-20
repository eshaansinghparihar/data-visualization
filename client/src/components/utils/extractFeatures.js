export const extractFeatures = (data) => {
    if(data.length){
        const keys = Object.keys(data[0])
        const features = keys.filter((_element, index) => index > 2);
        return features
    }
    return [];
}
