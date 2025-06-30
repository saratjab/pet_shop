import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { adoption, getAdoptions, getRemains, payment, getMyPets, cancelPets, getAdoption } from '../controllers/adoptController';
import { validate } from '../middleware/validate';
import { adoptionSchema, cancelPetsSchema, getAdoptionSchema, paymentSchema } from '../schemas/adoptSchema';

const router = express.Router();

router.get('adoptions/:id', validate(getAdoptionSchema), authenticate, authorizeRoles('admin'), getAdoption); 
router.get('/adoptions', authenticate, authorizeRoles('admin'), getAdoptions); 
router.post('/adoption', validate(adoptionSchema), authenticate, authorizeRoles('customer'), adoption); 
router.get('/adoptions/show', authenticate, authorizeRoles('customer'), getMyPets); 
router.get('/adoptions/pays', authenticate, authorizeRoles('customer'), getRemains); 
router.post('/adoptions/pay', validate(paymentSchema), authenticate, authorizeRoles('customer'), payment); 
router.post('/adoptions/cancel', validate(cancelPetsSchema), authenticate, authorizeRoles('customer'), cancelPets); 
export default router;
