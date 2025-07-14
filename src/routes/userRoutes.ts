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
/**
 * @swagger
 *   /api/users/register:
 *     post:
 *       summary: Register a new customer
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterCustomer'
 *       responses:
 *         '201':
 *           description: User successfully registered
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserResponse'
 *         '400':
 *           description: Validation error
 *           content:
 *             application/json:
 *               example:
 *                 error: "Passwords do not match"
 */
router.post('/register', validate(registerCustomerSchema, null, null), registerUser); 
/**
 * @swagger
*   /api/users/login:
 *     post:
 *       summary: Login a user and receive tokens
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginInput'
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/LoginResponse'
 *         '400':
 *           description: Invalid credentials or validation errors
 *           content:
 *             application/json:
 *               example:
 *                 error: "Invalid username or password"
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterCustomer:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - confirmPassword
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           example: sarat123
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 32
 *           format: password
 *           example: strongpassword
 *         confirmPassword:
 *           type: string
 *           minLength: 8
 *           maxLength: 32
 *           format: password
 *           example: strongpassword
 *         email:
 *           type: string
 *           format: email
 *           example: sarat@example.com
 *         role:
 *           type: string
 *           enum: [customer]
 *           example: customer
 *         address:
 *           type: string
 *           example: "Hebron, Palestine"
 *         isActive:
 *           type: boolean
 *           example: true
 * 
 *     LoginInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: sarat123
 *         password:
 *           type: string
 *           format: password
 *           example: strongpassword
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: sarat123
 *         role:
 *           type: string
 *           example: customer
 *         email:
 *           type: string
 *           example: sarat@example.com
 *         address:
 *           type: string
 *           example: "Hebron, Palestine"
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 */

export default router;