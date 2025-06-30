import express from 'express';
import { getPets, registerPet, filterPets, fromTo, updatePet, getPetsByAdmin, deletePet, getPet }  from '../controllers/petController';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { petIdSchema, petTagSchema, registerPetSchema, updatePetSchema } from '../schemas/petSchema';

const router = express.Router();

router.post('/pets', authenticate, authorizeRoles('admin', 'employee'), validate(registerPetSchema), registerPet); 
router.get('/pets', authenticate, getPets); 
router.get('/pets/admin', authenticate, authorizeRoles('admin'), getPetsByAdmin) 
router.get('/pets/id/:id',authenticate, authorizeRoles('admin'), validate(petIdSchema, 'params'), getPet) 
router.get('/pets/petTag/:petTag', authenticate, validate(petTagSchema, 'params'), getPet); 
router.get('/pets/filter', authenticate, filterPets); 
router.get('/pets/age', authenticate, fromTo);  
router.get('/pets/price', authenticate, fromTo); 

router.patch('/pets/update/id/:id', authenticate, authorizeRoles('admin'), validate(petIdSchema, 'params'), validate(updatePetSchema), updatePet); 
router.patch('/pets/update/petTag/:petTag', authenticate, authorizeRoles('admin', 'employee'), validate(petTagSchema, 'params'), validate(updatePetSchema), updatePet); 

router.delete('/pets/delete/id/:id', authenticate, authorizeRoles('admin'), deletePet);
router.delete('/pets/delete/petTag/:petTag', authenticate, authorizeRoles('admin'), deletePet);

export default router;