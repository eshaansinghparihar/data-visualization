import 'reflect-metadata';

export function queryParam(param: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        const existingParams = Reflect.getMetadata("queryParams", target, propertyKey) || [];
        existingParams.push({ index: parameterIndex, param });
        Reflect.defineMetadata("queryParams", existingParams, target, propertyKey);
    };
}
