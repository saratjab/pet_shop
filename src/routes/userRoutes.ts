import express from 'express';
import { validate } from '../middleware/validate';
import { verifyRefreshToken, authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { logOut, refreshToken } from '../controllers/authControllers';
import { loginSchema, registerSchema, updateUserSchema, userIdSchema, usernameSchema } from '../schemas/userSchema';
import { registerUser, getUsers, login, updated, registerEmployee, getUser, deleteUser } from '../controllers/userController'
const router = express.Router();

// ToDo: Favorites or Saved Pets
// POST /user/favorites/:petTag
// GET /user/favorites
// DELETE /user/favorites/:petTag
// Add optional hard delete for admins:

router.post('/user', validate(registerSchema), registerUser); 
router.post('/login', validate(loginSchema), login); 
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyRefreshToken, logOut);

router.post('/user/employee', authenticate, authorizeRoles('admin'), validate(registerSchema), registerEmployee);
router.get('/user', authenticate, getUsers); 
router.get('/user/id/:id', authenticate, authorizeRoles('admin'), validate(userIdSchema, 'params'),  getUser); 
router.get('/user/username/:username', authenticate, validate(usernameSchema, 'params'), getUser); 
router.patch('/user/alter', authenticate, validate(updateUserSchema), updated); 
router.patch('/user/role/:username', authenticate, authorizeRoles('admin'), validate(usernameSchema, 'params'), validate(updateUserSchema), updated); 

router.delete('/user/unactive', authenticate, deleteUser); 

router.delete('/user/delete/id/:id', authenticate, authorizeRoles('admin'), validate(userIdSchema, 'params'), deleteUser);
router.delete('/user/delete/username/:username', authenticate, authorizeRoles('admin'),validate(usernameSchema, 'params'), deleteUser);
// router.get('/user/order');

export default router;