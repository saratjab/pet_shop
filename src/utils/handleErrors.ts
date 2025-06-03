interface ValidationErrorObject  {
    username?: string,
    email?: string,
    role?: string,
    password?: string,
    petTag?: string,
    kind?: string;
    age?: number;
    price?: number;
    gender?: 'M' | 'F';
    isAdopted?: boolean;
    Error?: string,
    ID?: string
} // ToDo: add the adopt 

export const handleError = (error: any): ValidationErrorObject => {
    let errorsObj: ValidationErrorObject = {} ;
    const name: string = error.name;
    console.log(error);
    if(name === 'ValidationError'){
        Object.values(error.errors).forEach((err: any) => {
            const key = err.path;
            const msg = err.message;
            (errorsObj as any)[key] = msg;
        });        
    }
    if(name === 'MongoServerError'){
        const unique = 'keyValue';
        (errorsObj as any)[Object.keys(error.keyValue)[0]] = 'should be unique'
    }
    
    if(name === 'Error'){
        (errorsObj as any)['Error'] = error.message
    }

    if(name === 'CastError'){
        (errorsObj as any)['ID'] = 'Something wrong with the id';
    }

    if (name === 'TokenExpiredError') {
        (errorsObj as any)['Error'] = 'Token expired';
    }
    return errorsObj;
} 