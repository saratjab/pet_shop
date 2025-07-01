import express from 'express';
import { validate } from '../middleware/validate';
import { verifyRefreshToken, authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { logOut, refreshToken } from '../controllers/authControllers';
import { loginSchema, registerCustomerSchema, registerEmployeeSchema, registerSchema, updateUserSchema, userIdParamSchema, usernamedParamSchema } from '../schemas/userSchema';
import { registerUser, getUsers, login, registerEmployee, getUserById, getUserByUsername, updateByAdmin, updateUserData, deleteUserAccount, deleteUserById, deleteUserByUsername } from '../controllers/userController'
const router = express.Router();

// ToDo: Favorites or Saved Pets
// POST /user/favorites/:petTag
// GET /user/favorites
// DELETE /user/favorites/:petTag
// Add optional hard delete for admins:

router.post('/user', validate(registerCustomerSchema, 'body'), registerUser); 
router.post('/login', validate(loginSchema, 'body'), login); 
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyRefreshToken, logOut);

router.post('/user/employee', authenticate, authorizeRoles('admin'), validate(registerEmployeeSchema, 'body'), registerEmployee);
router.get('/user', authenticate, getUsers); 
router.get('/user/id/:id', authenticate, authorizeRoles('admin'), validate(userIdParamSchema, 'params'),  getUserById); 
router.get('/user/username/:username', authenticate, validate(usernamedParamSchema, 'params'), getUserByUsername); 
router.patch('/user/alter', authenticate, validate(updateUserSchema, 'body'), updateUserData); 
router.patch('/user/role/:username', authenticate, authorizeRoles('admin'), validate(usernamedParamSchema, 'params'), validate(updateUserSchema, 'body'), updateByAdmin); 

router.delete('/user/deactive', authenticate, deleteUserAccount); 

router.delete('/user/delete/id/:id', authenticate, authorizeRoles('admin'), validate(userIdParamSchema, 'params'), deleteUserById);
router.delete('/user/delete/username/:username', authenticate, authorizeRoles('admin'),validate(usernamedParamSchema, 'params'), deleteUserByUsername);
// router.get('/user/order');

export default router;