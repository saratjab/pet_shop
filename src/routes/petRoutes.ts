import express from 'express';
import { getPets, registerPet, getPetById, getPetByPetTag, filterPets, fromTo, updatePet, getPetsByAdmin, deletePet }  from '../controllers/petController';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';

const router = express.Router();

router.post('/pets', authenticate, authorizeRoles('admin', 'employee') ,registerPet); 
router.get('/pets', authenticate, getPets /* should return void */); 
router.get('/pets/admin', authenticate, authorizeRoles('admin'), getPetsByAdmin) 
router.get('/pets/id/:id',authenticate, authorizeRoles('admin'), getPetById) 
router.get('/pets/petTag/:petTag', authenticate, getPetByPetTag); 
router.get('/pets/filter', authenticate, filterPets); 
router.get('/pets/age', authenticate, fromTo);  
router.get('/pets/price', authenticate, fromTo); 

router.patch('/pets/update/id/:id', authenticate, authorizeRoles('admin'), updatePet); 
router.patch('/pets/update/petTag/:petTag', authenticate, authorizeRoles('admin', 'employee'), updatePet); 

router.delete('/pets/delete/id/:id', authenticate, authorizeRoles('admin'), deletePet);
router.delete('/pets/delete/petTag/:petTag', authenticate, authorizeRoles('admin'), deletePet);

export default router;