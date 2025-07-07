import express from 'express';
import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';
import { registerPet, filterPets, getPetById, getPetByPetTag, updatePetById, updatePetByPetTag, deletePetById, deletePetByPetTag }  from '../controllers/petController';
import { filterPetsQuerySchema, petIdDeleteSchema, petIdParamSchema, petTagDeleteSchema, petTagParamSchema, registerPetSchema, updatePetSchema } from '../schemas/petSchema';
import { paginationQuerySchema } from '../schemas/paginationSchema';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'employee'), validate(registerPetSchema, null, null), registerPet); 
// router.get('/', authenticate, validate([filterPetsQuerySchema, paginationQuerySchema], ['query', 'query']), filterPets); // new schema 
router.get('/:id',authenticate, authorizeRoles('admin'), validate(null, null, petIdParamSchema), getPetById) 
router.get('/tag/:petTag', authenticate, validate(null, null, petTagParamSchema), getPetByPetTag); 

router.patch('/:id', authenticate, authorizeRoles('admin'), validate(updatePetSchema, null, petIdParamSchema), updatePetById); 
router.patch('/tag/:petTag', authenticate, authorizeRoles('admin', 'employee'), validate(updatePetSchema, null, petTagParamSchema)
, updatePetByPetTag); 

router.delete('/bluk/id', authenticate, authorizeRoles('admin'), validate(petIdDeleteSchema, null, null), deletePetById);
router.delete('/bluk/petTag', authenticate, authorizeRoles('admin'), validate(petTagDeleteSchema, null, null), deletePetByPetTag);

export default router;