import express from 'express';
import { getPets, registerPet, getPetById, getPetByPetTag, filterPets, fromTo, updatePet, getPetsByAdmin, deletePet }  from '../controllers/petController';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';

const router = express.Router();

router.post('/pets', authenticate, authorizeRoles('admin', 'employee') ,registerPet); //? Done
router.get('/pets', authenticate, getPets /* should return void */); //? Done
router.get('/pets/admin', authenticate, authorizeRoles('admin'), getPetsByAdmin) 
router.get('/pets/id/:id',authenticate, authorizeRoles('admin'), getPetById) //? Done
router.get('/pets/petTag/:petTag', authenticate, getPetByPetTag); //? Done
router.get('/pets/filter', authenticate, filterPets); //? Done
router.get('/pets/age', authenticate, fromTo); //? Done 
router.get('/pets/price', authenticate, fromTo); //? Done

router.patch('/pets/update/id/:id', authenticate, authorizeRoles('admin'), updatePet); //? Done
router.patch('/pets/update/petTag/:petTag', authenticate, authorizeRoles('admin', 'employee'), updatePet); //? Done

router.delete('/pets/delete/id/:id', authenticate, authorizeRoles('admin'), deletePet);
router.delete('/pets/delete/petTag/:petTag', authenticate, authorizeRoles('admin'), deletePet);

export default router;