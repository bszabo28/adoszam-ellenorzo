
interface IValidatorResponse{
    valid: boolean
}

export interface IValidatorError extends IValidatorResponse{
    errors: string[]
}

export interface IValidatorInfo extends IValidatorResponse{
    main: string,
    cvs: string,
    vat?:string,
    region?: string,
    vatName?: string,
    regionName?: string,
    formatted?: string,
    nav?: any
}