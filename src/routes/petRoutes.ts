import express from 'express';
import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';
import { registerPet, filterPets, getPetById, getPetByPetTag, updatePetById, updatePetByPetTag, deletePetById, deletePetByPetTag }  from '../controllers/petController';
import { filterPetsQuerySchema, petIdDeleteSchema, petIdParamSchema, petTagDeleteSchema, petTagParamSchema, registerPetSchema, updatePetSchema } from '../schemas/petSchema';
import { paginationParamSchema } from '../schemas/paginationSchema';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'employee'), validate([registerPetSchema], ['body']), registerPet); 
router.get('/', authenticate, validate([filterPetsQuerySchema, paginationParamSchema], ['query', 'query']), filterPets); 
router.get('/:id',authenticate, authorizeRoles('admin'), validate([petIdParamSchema], ['params']), getPetById) 
router.get('/tag/:petTag', authenticate, validate([petTagParamSchema], ['params']), getPetByPetTag); 

router.patch('/:id', authenticate, authorizeRoles('admin'), validate([petIdParamSchema, updatePetSchema], ['params', 'body']), updatePetById); 
router.patch('/tag/:petTag', authenticate, authorizeRoles('admin', 'employee'), validate([petTagParamSchema, updatePetSchema], ['params', 'body']), updatePetByPetTag); 

router.delete('/bluk/id', authenticate, authorizeRoles('admin'), validate([petIdDeleteSchema], ['body']), deletePetById);
router.delete('/bluk/petTag', authenticate, authorizeRoles('admin'), validate([petTagDeleteSchema], ['body']), deletePetByPetTag);

export default router;