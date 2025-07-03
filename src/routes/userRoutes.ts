import express from 'express';
import { validate } from '../middleware/validate';
import { authorizeRoles } from '../middleware/authorize';
import { logOut, refreshToken } from '../controllers/authControllers';
import { verifyRefreshToken, authenticate } from '../middleware/authenticate';
import { loginSchema, registerCustomerSchema, registerEmployeeSchema, updateUserSchema, userIdParamSchema, usernamedParamSchema } from '../schemas/userSchema';
import { registerUser, getUsers, login, registerEmployee, getUserById, getUserByUsername, updateByAdmin, updateUserData, deleteUserAccount, deleteUserById, deleteUserByUsername } from '../controllers/userController'
const router = express.Router();

// ToDo: Favorites or Saved Pets
// POST /user/favorites/:petTag
// GET /user/favorites
// DELETE /user/favorites/:petTag
// Add optional hard delete for admins:

router.post('/register', validate(registerCustomerSchema, 'body'), registerUser); 
router.post('/login', validate(loginSchema, 'body'), login); 
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyRefreshToken, logOut);
router.post('/employees', authenticate, authorizeRoles('admin'), validate(registerEmployeeSchema, 'body'), registerEmployee);

router.get('/', authenticate, getUsers); 
router.patch('/alter', authenticate, validate(updateUserSchema, 'body'), updateUserData); 
router.patch('/role/:username', authenticate, authorizeRoles('admin'), validate(usernamedParamSchema, 'params'), validate(updateUserSchema, 'body'), updateByAdmin); 
router.get('/:id', authenticate, authorizeRoles('admin'), validate(userIdParamSchema, 'params'),  getUserById); 
router.get('/username/:username', authenticate, validate(usernamedParamSchema, 'params'), getUserByUsername); 

router.patch('/me', authenticate, deleteUserAccount); 
router.delete('/:id', authenticate, authorizeRoles('admin'), validate(userIdParamSchema, 'params'), deleteUserById);
router.delete('/username/:username', authenticate, authorizeRoles('admin'),validate(usernamedParamSchema, 'params'), deleteUserByUsername);

export default router;