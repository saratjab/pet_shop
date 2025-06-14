import mongoose from "mongoose";

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

    //! index signature 
    [key: string]: string | number | boolean | undefined; //? to handle dynamic key
} // ToDo: add the adopt 

export const handleError = (error: { name: string, errors: {path:string, message: string}[], message?: string, keyValue?: string }): ValidationErrorObject => {
    let errorsObj: ValidationErrorObject = {} ;
    const name: string = error.name;
    if(name === 'ValidationError'){

        Object.values(error.errors).forEach((err) => {
            const key = err.path;
            const msg = err.message;
            errorsObj[key] = msg;
        });        
    }
    else if(name === 'MongoServerError'){
        const unique = 'keyValue';
        errorsObj[Object.keys(error.keyValue!)[0]] = 'should be unique'
    }
    
    else if(name === 'Error'){
        errorsObj['Error'] = error.message
    }

    else if(name === 'CastError'){
        errorsObj['ID'] = 'Something wrong with the id';
    }

    else if(name === 'TokenExpiredError') {
        errorsObj['Error'] = 'Token expired';
    }
    else {
        errorsObj['Error'] = 'Some error occure'
    }
    return errorsObj;
} 