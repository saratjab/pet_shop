import express from 'express';
import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';
import { adoptIdParamSchema, adoptionSchema, cancelPetsSchema, paymentSchema } from '../schemas/adoptSchema';
import { adoption, getAdoptions, getRemains, payment, getMyPets, cancelPets, getAdoption } from '../controllers/adoptController';
import { paginationQuerySchema } from '../schemas/paginationSchema';

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), validate([paginationQuerySchema], ['query']), getAdoptions); 
router.post('/', authenticate, authorizeRoles('customer'), validate([adoptionSchema], ['body']), adoption); 
router.get('/show', authenticate, authorizeRoles('customer'), getMyPets); 
router.get('/pays', authenticate, authorizeRoles('customer'), getRemains); 
router.post('/pay', authenticate, authorizeRoles('customer'), validate([paymentSchema], ['body']), payment); 
router.post('/cancel', authenticate, authorizeRoles('customer'), validate([cancelPetsSchema], ['body']), cancelPets); 
router.get('/:id', authenticate, authorizeRoles('admin'), validate([adoptIdParamSchema], ['params']), getAdoption); 
export default router;