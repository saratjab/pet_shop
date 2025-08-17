import { z } from 'zod';
import { paginationSchema } from './paginationSchema';

const objError = { required_error: 'field is required' };

export const adoptionSchema = z
  .object({
    user_id: z.string(objError).length(24, 'Invalid MongoDB ObjectId').openapi({
      example: 'userId',
    }),
    pets: z
      .string(objError)
      .array()
      .refine((pets) => pets.length > 0, {
        message: 'At least one pet must be selected for adoption',
      })
      .openapi({
        description: 'an array of pets',
      }),
    payMoney: z
      .number()
      .positive('pay money must be positive')
      .default(0)
      .openapi({
        example: 30,
        description: 'the money you paid for the pets',
      }),
  })
  .openapi('Adoption');

export const adoptResponseSchema = z
  .object({
    user_id: z.string(objError).length(24, 'Invalid MongoDB ObjectId').openapi({
      example: 'userId',
    }),
    pets: z
      .string(objError)
      .array()
      .refine((pets) => pets.length > 0, {
        message: 'At least one pet must be selected for adoption',
      })
      .openapi({
        description: 'an array of pets',
      }),
    payMoney: z
      .number()
      .positive('pay money must be positive')
      .default(0)
      .openapi({
        example: 30,
        description: 'the money you are paying for the pets',
      }),
    total: z.number().positive('pay money must be positive').openapi({
      example: 30,
      description: 'the money you paid for the pets',
    }),
    status: z.string().openapi({
      example: 'pending',
    }),
  })
  .openapi('AdoptionResponse');

export const adoptPaginationSchema = z
  .object({
    data: z.array(adoptResponseSchema),
    pagination: paginationSchema,
  })
  .openapi('AdoptsGetResponse');

export const paymentSchema = z
  .object({
    payMoney: z.number(objError).positive('pay money must be psitive').openapi({
      example: 30,
      description: 'the money you are paying for the pets',
    }),
  })
  .openapi('Payment');

export const cancelPetsSchema = z
  .object({
    pets: z
      .string(objError)
      .array()
      .nonempty('At least one pet must be selected for cancelling')
      .openapi({
        description: 'an array of pets',
      }),
  })
  .openapi('CancelPets');

export const adoptIdParamSchema = z
  .object({
    id: z.string(objError).length(24, 'Invalid MongoDB ObjectId').openapi({
      example: 'adoptId',
    }),
  })
  .openapi('AdoptIDParam');

export const paymentInfoSchema = z
  .object({
    total: z.number().positive('pay money must be positive').openapi({
      example: 30,
      description: 'the money you paid for the pets',
    }),
    payMoney: z
      .number()
      .positive('pay money must be positive')
      .default(0)
      .openapi({
        example: 30,
        description: 'the money you are paying for the pets',
      }),
    remaining: z.number().positive('remaining money must be positive').openapi({
      example: 10,
      description: 'the money remain after payin for the pets',
    }),
  })
  .openapi('PaymentInfo');
