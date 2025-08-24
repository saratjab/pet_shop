import express from 'express';

import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';
import {
  registerPet,
  filterPets,
  getPetById,
  getPetByPetTag,
  updatePetById,
  updatePetByPetTag,
  deletePetById,
  deletePetByPetTag,
} from '../controllers/petController';
import {
  filterPetsQueryAndPaginationSchema,
  petIdDeleteSchema,
  petIdParamSchema,
  petTagDeleteSchema,
  petTagParamSchema,
  registerPetSchema,
  updatePetSchema,
} from '../schemas/petSchema';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'employee'),
  validate(registerPetSchema, null, null),
  registerPet
);
router.get(
  '/',
  authenticate,
  validate(null, filterPetsQueryAndPaginationSchema, null),
  filterPets
);
router.get(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  validate(null, null, petIdParamSchema),
  getPetById
);
router.get(
  '/tag/:petTag',
  authenticate,
  validate(null, null, petTagParamSchema),
  getPetByPetTag
);

router.patch(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  validate(updatePetSchema, null, petIdParamSchema),
  updatePetById
);
router.patch(
  '/tag/:petTag',
  authenticate,
  authorizeRoles('admin', 'employee'),
  validate(updatePetSchema, null, petTagParamSchema),
  updatePetByPetTag
);

router.delete(
  '/bluk/id',
  authenticate,
  authorizeRoles('admin'),
  validate(petIdDeleteSchema, null, null),
  deletePetById
);
router.delete(
  '/bluk/petTag',
  authenticate,
  authorizeRoles('admin'),
  validate(petTagDeleteSchema, null, null),
  deletePetByPetTag
);

export default router;
