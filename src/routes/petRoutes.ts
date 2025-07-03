import express from 'express';
import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';
import { getPets, registerPet, filterPets, fromTo, getPetById, getPetByPetTag, updatePetById, updatePetByPetTag, deletePetById, deletePetByPetTag }  from '../controllers/petController';
import { filterPetsQuerySchema, fromToQuerySchema, petIdDeleteSchema, petIdParamSchema, petTagDeleteSchema, petTagParamSchema, registerPetSchema, updatePetSchema } from '../schemas/petSchema';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'employee'), validate(registerPetSchema, 'body'), registerPet); 
router.get('/', authenticate, getPets); 
router.get('/filter', authenticate, validate(filterPetsQuerySchema, 'query'), filterPets); 
router.get('/range/age', authenticate, validate(fromToQuerySchema, 'query'), fromTo('age'));  
router.get('/range/price', authenticate, validate(fromToQuerySchema, 'query'), fromTo('price')); 
router.get('/:id',authenticate, authorizeRoles('admin'), validate(petIdParamSchema, 'params'), getPetById) 
router.get('/tag/:petTag', authenticate, validate(petTagParamSchema, 'params'), getPetByPetTag); 

router.patch('/:id', authenticate, authorizeRoles('admin'), validate(petIdParamSchema, 'params'), validate(updatePetSchema, 'body'), updatePetById); 
router.patch('/tag/:petTag', authenticate, authorizeRoles('admin', 'employee'), validate(petTagParamSchema, 'params'), validate(updatePetSchema, 'body'), updatePetByPetTag); 

router.delete('/bluk/id', authenticate, authorizeRoles('admin'), validate(petIdDeleteSchema, 'body'), deletePetById);
router.delete('/bluk/petTag', authenticate, authorizeRoles('admin'), validate(petTagDeleteSchema, 'body'), deletePetByPetTag);

export default router;