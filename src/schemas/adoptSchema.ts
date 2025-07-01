import { z } from 'zod';

const objError = { required_error: "This field is required" }

export const adoptionSchema = z.object({
    user_id: z.string(objError),
    pets: z.string(objError).array().nonempty(),
    payMoney: z.number().positive().default(0),
    status: z.enum(['pending', 'completed', 'cancelled'])
})

export const paymentSchema = z.object({
    payMoney: z.number(objError).positive(),
})

export const cancelPetsSchema = z.object({
    pets: z.string(objError).array().nonempty(),
})

export const adoptIdParamSchema  = z.object({
    id: z.string(objError).length(24, 'Invalid MongoDB ObjectId'),
})