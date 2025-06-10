"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (error) => {
    let errorsObj = {};
    const name = error.name;
    if (name === 'ValidationError') {
        Object.values(error.errors).forEach((err) => {
            const key = err.path;
            const msg = err.message;
            errorsObj[key] = msg;
        });
    }
    else if (name === 'MongoServerError') {
        const unique = 'keyValue';
        errorsObj[Object.keys(error.keyValue)[0]] = 'should be unique';
    }
    else if (name === 'Error') {
        errorsObj['Error'] = error.message;
    }
    else if (name === 'CastError') {
        errorsObj['ID'] = 'Something wrong with the id';
    }
    else if (name === 'TokenExpiredError') {
        errorsObj['Error'] = 'Token expired';
    }
    else {
        errorsObj['Error'] = 'Some error occure';
    }
    return errorsObj;
};
exports.handleError = handleError;
//# sourceMappingURL=handleErrors.js.map