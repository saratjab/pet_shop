import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import { paginationQuerySchema, paginationSchema } from './paginationSchema';

extendZodWithOpenApi(z);
const objError = { required_error: 'field is required' };

export const registerPetSchema = z
  .object({
    petTag: z
      .string(objError)
      .toLowerCase()
      .nonempty('pet tag must be at least 1 character')
      .openapi({
        example: 'luckyDog',
        description: 'a unique tag for the pet',
      }),
    name: z
      .string(objError)
      .nonempty('pet tag must be at least 1 character')
      .openapi({
        example: 'lucky',
        description: 'the pet name',
      }),
    kind: z
      .string(objError)
      .nonempty('pet tag must be at least 1 character')
      .openapi({
        example: 'dog',
        description: 'the pet kind',
      }),
    age: z
      .number(objError)
      .refine((age) => age > 0, { message: 'Age must be positive' })
      .openapi({
        example: 2,
        description: 'the pet age',
      }),
    price: z
      .number(objError)
      .refine((price) => price > 0, { message: 'Price must be positve' })
      .openapi({
        example: 20,
        description: 'the pet price',
      }),
    description: z.string(objError).optional().openapi({
      example: 'white with black spots',
    }),
    gender: z.enum(['M', 'F'], { message: 'gender must be F or M' }).openapi({
      example: 'M',
    }),
    isAdopted: z.boolean().default(false).openapi({
      example: false,
    }),
  })
  .openapi('RegisterPet');

export const petResponseSchema = registerPetSchema.openapi('PetRespnse');

export const filteredPetResponseSchema = z
  .object({
    pets: z.array(petResponseSchema),
    pagination: paginationSchema,
  })
  .openapi('FilteredPetResponse');

export const updatePetSchema = registerPetSchema.partial().openapi('UpdatePet');

export const petIdParamSchema = z
  .object({
    id: z.string(objError).length(24, 'Invalid MongoDB ObjectId'),
  })
  .openapi('PetIDParam');

export const petTagParamSchema = z
  .object({
    petTag: z.string(objError).nonempty('pet tag must be at least 1 character'),
  })
  .openapi('PetTagParam');

export const petIdDeleteSchema = z
  .object({
    id: z
      .array(z.string(objError).length(24, 'Invalid MongooDB ObjectId'))
      .nonempty('At least one ID is required')
      .openapi({
        description: 'an array of id\'s',
      }),
  })
  .openapi('PetIDDelete');

export const petTagDeleteSchema = z
  .object({
    petTag: z
      .array(
        z.string(objError).nonempty('pet tag must be at least 1 character')
      )
      .nonempty('At least one pet tag is required'),
  })
  .openapi('PetTagDelete');

export const filterPetsQuerySchema = z
  .object({
    kind: z.string().optional(),
    gender: z.enum(['F', 'M'], { message: 'Gender must be F or M' }).optional(),
    isAdopted: z
      .enum(['true', 'false'], { message: 'isAdopted true or false' })
      .transform((val) => val === 'true')
      .optional(),
    minAge: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Age must be a positive number',
      })
      .optional(),
    maxAge: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Age must be a positive number',
      })
      .optional(),
    age: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Age must be a positive number',
      })
      .optional(),
    minPrice: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Price must be a positive number',
      })
      .optional(),
    maxPrice: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Price must be a positive number',
      })
      .optional(),
    price: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Price must be a positive number',
      })
      .optional(),
    sortBy: z
      .enum(['price', 'age', 'name'], {
        message: 'can order by price, age or name',
      })
      .transform((val) => (val.trim() === '' ? undefined : val))
      .optional()
      .default('price'),
    order: z
      .string()
      .transform((val) => (val.trim() === '' ? undefined : val))
      .default('asc')
      .optional()
      .refine((val) => val === 'asc' || val === 'desc', {
        message: 'order asc or desc only',
      })
      .transform((val) => (val === 'asc' ? 1 : -1)),
  })
  .strict();

export const filterPetsQueryAndPaginationSchema = filterPetsQuerySchema
  .merge(paginationQuerySchema)
  .strict()
  .superRefine((data, ctx) => {
    if (data.age && (data.minAge || data.maxAge)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Use either age OR minAge/maxAge, not both.',
        path: ['age'],
      });
    }
    if (data.price && (data.minPrice || data.maxPrice)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Use either price OR minPrice/maxPrice, not both.',
        path: ['price'],
      });
    }
    if (data.minAge && data.maxAge) {
      if (data.minAge > data.maxAge) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'maxAge must be more than the minAge',
          path: ['maxAge'],
        });
      }
    }
    if (data.minPrice && data.maxPrice) {
      if (data.minPrice > data.maxPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'maxPrice must be more than the minPrice',
          path: ['maxPrice'],
        });
      }
    }
  });
