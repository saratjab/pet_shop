import { z } from 'zod';

const objError = { required_error: "field is required" }

export const registerPetSchema = z.object({
    petTag: z.string(objError)
        .toLowerCase()
        .nonempty('pet tag must be at least 1 character'),
    name: z.string(objError)
        .nonempty('pet tag must be at least 1 character'),
    kind: z.string(objError)
        .nonempty('pet tag must be at least 1 character'),
    age: z.number(objError)
        .refine(age => age > 0, { message: 'Age must be positive' }),
    price: z.number(objError)
        .refine(price => price > 0, { message: 'Price must be positve' }),
    description: z.string(objError)
        .optional(),
    gender: z.enum(['M', 'F'], { message: 'gender must be F or M'}),
    isAdopted: z.boolean()
        .default(false),
});

export const updatePetSchema = registerPetSchema.partial();

export const petIdParamSchema = z.object({
    id: z.string(objError)
        .length(24, 'Invalid MongoDB ObjectId'),
});

export const petTagParamSchema = z.object({
    petTag: z.string(objError)
        .nonempty('pet tag must be at least 1 character'),
});

export const petIdDeleteSchema = z.object({
    id: z.array(
        z.string(objError)
        .length(24, 'Invalid MongooDB ObjectId'),
    ).nonempty('At least one ID is required'),
});

export const petTagDeleteSchema = z.object({
    petTag: z.array(
        z.string(objError)
        .nonempty('pet tag must be at least 1 character'),
    ).nonempty('At least one pet tag is required'),
});

export const filterPetsQuerySchema = z.object({
    kind: z.string()
        .optional(),
    gender: z.enum(['F', 'M'], { message: 'Gender must be F or M'})
        .optional(),
    isAdopted: z.enum(['true', 'false'], { message: 'isAdopted true or false'})
        .transform(val => val === 'true')
        .optional(),
    minAge: z.string()
        .transform(val => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Age must be a positive number' } )
        .optional(),
    maxAge: z.string()
        .transform(val => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Age must be a positive number'} )
        .optional(),
    age: z.string()
        .transform(val => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Age must be a positive number' } )
        .optional(),
    minPrice: z.string()
        .transform(val => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Price must be a positive number'} )
        .optional(),
    maxPrice: z.string()
        .transform(val => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Price must be a positive number'} )
        .optional(),
    price: z.string()
        .transform(val => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Price must be a positive number'} ) 
        .optional(),    
}).strict()
.superRefine((data, ctx) => {
    if(data.age && (data.minAge || data.maxAge)){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Use either age OR minAge/maxAge, not both.',
            path: ['age'], 
        })
    }
    if(data.price && (data.minPrice || data.maxPrice)){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Use either price OR minPrice/maxPrice, not both.',
            path: ['price'], 
        })
    }
    if(data.minAge && data.maxAge){
        if(data.minAge > data.maxAge){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'maxAge must be more than the minAge',
                path: ['maxAge'],
            });
        }
    }
    if(data.minPrice && data.maxPrice){
        if(data.minPrice > data.maxPrice){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'maxPrice must be more than the minPrice',
                path: ['maxPrice'],
            });
        }
    }
});