import { z } from 'zod';

const objError = { required_error: "field is required" }

export const adoptionSchema = z.object({
    user_id: z.string(objError)
        .length(24, 'Invalid MongoDB ObjectId'),
    pets: z.string(objError)
        .array()
        .refine(pets => pets.length > 0, { message: 'At least one pet must be selected for adoption' }),
    payMoney: z.number()
        .positive('pay money must be positive')
        .default(0),
});

export const paymentSchema = z.object({
    payMoney: z.number(objError)
        .positive('pay money must be psitive'),
});

export const cancelPetsSchema = z.object({
    pets: z.string(objError)
        .array()
        .nonempty('At least one pet must be selected for cancelling'),
});

export const adoptIdParamSchema  = z.object({
    id: z.string(objError)
        .length(24, 'Invalid MongoDB ObjectId'),
});