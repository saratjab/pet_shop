import express from 'express';
import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { logOut, refreshToken } from '../controllers/authControllers';
import { verifyRefreshToken, authenticate } from '../middleware/authenticate';
import { loginSchema, registerCustomerSchema, registerEmployeeSchema, updateUserSchema, userIdParamSchema, usernamedParamSchema } from '../schemas/userSchema';
import { registerUser, getUsers, login, registerEmployee, getUserById, getUserByUsername, updateByAdmin, updateUserData, deleteUserAccount, deleteUserById, deleteUserByUsername } from '../controllers/userController'
import { paginationQuerySchema } from '../schemas/paginationSchema';
const router = express.Router();

// ToDo: Favorites or Saved Pets
// POST /user/favorites/:petTag
// GET /user/favorites
// DELETE /user/favorites/:petTag
// Add optional hard delete for admins:

router.post('/register', validate(registerCustomerSchema, null, null), registerUser); 
router.post('/login', validate(loginSchema, null, null), login); 
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyRefreshToken, logOut);
router.post('/employees', authenticate, authorizeRoles('admin'),validate(registerEmployeeSchema, null, null), registerEmployee);

router.get('/', authenticate, validate(null, paginationQuerySchema, null), getUsers); 
router.patch('/alter', authenticate, validate(updateUserSchema, null, null), updateUserData); 
router.patch('/role/:username', authenticate, authorizeRoles('admin'), validate(updateUserSchema, null, usernamedParamSchema), updateByAdmin);
router.get('/username/:username', authenticate, validate(null, null, usernamedParamSchema), getUserByUsername); 
router.get('/:id', authenticate, authorizeRoles('admin'), validate(null, null, userIdParamSchema),  getUserById); 

router.patch('/me', authenticate, deleteUserAccount); 
router.delete('/:id', authenticate, authorizeRoles('admin'), validate(null, null, userIdParamSchema), deleteUserById);
router.delete('/username/:username', authenticate, authorizeRoles('admin'), validate(null, null, usernamedParamSchema), deleteUserByUsername);

export default router;