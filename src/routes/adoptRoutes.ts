import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { adoption, getAdoptions, getRemains, payment, getMyPets, cancelPets, getAdoption } from '../controllers/adoptController';
import { validate } from '../middleware/validate';
import { adoptIdParamSchema, adoptionSchema, cancelPetsSchema, paymentSchema } from '../schemas/adoptSchema';

const router = express.Router();

router.get('/adoptions', authenticate, authorizeRoles('admin'), getAdoptions); 
router.post('/adoption', authenticate, authorizeRoles('customer'), validate(adoptionSchema, 'body'), adoption); 
router.get('/adoptions/show', authenticate, authorizeRoles('customer'), getMyPets); 
router.get('/adoptions/pays', authenticate, authorizeRoles('customer'), getRemains); 
router.post('/adoptions/pay', authenticate, authorizeRoles('customer'), validate(paymentSchema, 'body'), payment); 
router.post('/adoptions/cancel', authenticate, authorizeRoles('customer'), validate(cancelPetsSchema, 'body'), cancelPets); 
router.get('/adoptions/:id', authenticate, authorizeRoles('admin'), validate(adoptIdParamSchema, 'params'), getAdoption); 
export default router;
