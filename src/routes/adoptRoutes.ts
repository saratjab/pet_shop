import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { adoption, getAdoptions, getRemains, payment, getMyPets, cancelPets, getAdoption } from '../controllers/adoptController';

const router = express.Router();

router.get('adoptions/:id', authenticate, authorizeRoles('admin'), getAdoption); //? Done
router.get('/adoptions', authenticate, authorizeRoles('admin'), getAdoptions); //? Done
router.post('/adoption', authenticate, authorizeRoles('customer'), adoption); //? Done
router.get('/adoptions/show', authenticate, authorizeRoles('customer'), getMyPets); //? Done
router.get('/adoptions/pays', authenticate, authorizeRoles('customer'), getRemains); //? Done
router.post('/adoptions/pay', authenticate, authorizeRoles('customer'), payment); //? Done
router.post('/adoptions/cancel', authenticate, authorizeRoles('customer'), cancelPets); //? Done
export default router;