import express from 'express';

import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';
import {
  adoptIdParamSchema,
  adoptionSchema,
  cancelPetsSchema,
  paymentSchema,
} from '../schemas/adoptSchema';
import {
  adoption,
  getAdoptions,
  getRemains,
  payment,
  getMyPets,
  cancelPets,
  getAdoption,
} from '../controllers/adoptController';
import { paginationQuerySchema } from '../schemas/paginationSchema';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('admin'),
  validate(null, paginationQuerySchema, null),
  getAdoptions
);
router.post(
  '/',
  authenticate,
  authorizeRoles('customer'),
  validate(adoptionSchema, null, null),
  adoption
);
router.get('/show', authenticate, authorizeRoles('customer'), getMyPets);
router.get('/pays', authenticate, authorizeRoles('customer'), getRemains);
router.post(
  '/pay',
  authenticate,
  authorizeRoles('customer'),
  validate(paymentSchema, null, null),
  payment
);
router.post(
  '/cancel',
  authenticate,
  authorizeRoles('customer'),
  validate(cancelPetsSchema, null, null),
  cancelPets
);
router.get(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  validate(null, null, adoptIdParamSchema),
  getAdoption
);

export default router;
