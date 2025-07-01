import express from 'express';
import { getPets, registerPet, filterPets, fromTo, getPetById, getPetByPetTag, updatePetById, updatePetByPetTag, deletePetById, deletePetByPetTag }  from '../controllers/petController';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { filterPetsQuerySchema, fromToQuerySchema, petIdDeleteSchema, petIdParamSchema, petTagDeleteSchema, petTagParamSchema, registerPetSchema, updatePetSchema } from '../schemas/petSchema';

const router = express.Router();

router.post('/pets', authenticate, authorizeRoles('admin', 'employee'), validate(registerPetSchema, 'body'), registerPet); 
router.get('/pets', authenticate, getPets); 
router.get('/pets/id/:id',authenticate, authorizeRoles('admin'), validate(petIdParamSchema, 'params'), getPetById) 
router.get('/pets/petTag/:petTag', authenticate, validate(petTagParamSchema, 'params'), getPetByPetTag); 
router.get('/pets/filter', authenticate, validate(filterPetsQuerySchema, 'query'), filterPets); 
router.get('/pets/age', authenticate, validate(fromToQuerySchema, 'query'), fromTo('age'));  
router.get('/pets/price', authenticate, validate(fromToQuerySchema, 'query'), fromTo('price')); 

router.patch('/pets/id/:id', authenticate, authorizeRoles('admin'), validate(petIdParamSchema, 'params'), validate(updatePetSchema, 'body'), updatePetById); 
router.patch('/pets/petTag/:petTag', authenticate, authorizeRoles('admin', 'employee'), validate(petTagParamSchema, 'params'), validate(updatePetSchema, 'body'), updatePetByPetTag); 

router.delete('/pets/id', authenticate, authorizeRoles('admin'), validate(petIdDeleteSchema, 'body'), deletePetById);
router.delete('/pets/petTag', authenticate, authorizeRoles('admin'), validate(petTagDeleteSchema, 'body'), deletePetByPetTag);

export default router;