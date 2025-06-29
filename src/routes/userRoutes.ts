import express from 'express';
import { registerUser, getUsers, getUserById, getUserByUsername, login, updated, unActiveUser, unActive, deleteByAdmin, registerEmployee } from '../controllers/userController'
import { logOut, refreshToken } from '../controllers/authControllers';
import { verifyRefreshToken } from '../middleware/authenticate';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../schemas/userSchema';
const router = express.Router();

// ToDo: handle errors in middlewares

// ToDo: Favorites or Saved Pets
// POST /user/favorites/:petTag
// GET /user/favorites
// DELETE /user/favorites/:petTag
// Add optional hard delete for admins:

router.post('/user', validate(registerSchema), registerUser); 
router.post('/login', validate(loginSchema), login); 
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyRefreshToken, logOut);

router.post('/user/employee', authenticate, authorizeRoles('admin'), registerEmployee);
router.get('/user',authenticate ,getUsers); 
router.get('/user/id/:id',authenticate,authorizeRoles('admin'),  getUserById); 
router.get('/user/username/:username',authenticate, getUserByUsername); 
router.patch('/user/alter', authenticate, updated); 
router.patch('/user/role/:username', authenticate, authorizeRoles('admin'), updated); 


router.delete('/user/unactive/:username',authenticate, authorizeRoles('admin'), unActiveUser); 
router.delete('/user/unactive', authenticate, unActive); 

router.delete('/user/delete/id/:id', authenticate, authorizeRoles('admin'), deleteByAdmin);
router.delete('/user/delete/username/:username', authenticate, authorizeRoles('admin'), deleteByAdmin);
// router.get('/user/order');

export default router;


// router.get('/test', authenticate, (req: Request, res: Response) => {
//     res.send(req.user);
// })


// ┌────────────────────────┐
// │   1. User Registers    │  ← /register (POST)
// └────────────────────────┘
//           │
//           ▼
// [Client sends username, email, password, role]
//           │
//           ▼
// 📦 Controller (`registerUser`)
//     └─ Calls `hashing(password)`
//     └─ Calls `saveUser()` with hashed password
//           │
//           ▼
// 💾 MongoDB stores user securely
//           │
//           ▼
// ✅ Respond with: username, email, role, address (no password)

// ────────────────────────────────────────────────────────────

// ┌────────────────────────┐
// │     2. User Logs In    │  ← /login (POST)
// └────────────────────────┘
//           │
//           ▼
// [Client sends username and password]
//           │
//           ▼
// 📦 Controller (`login`)
//     └─ Calls `findUserByUsername()`
//     └─ Calls `verifyPassword()` using bcrypt
//     └─ If correct:
//         └─ 🔐 `generateToken(userId)` using JWT_SECRET
//           │
//           ▼
// 🎟️ Token returned to client
// {
//    token: "...",
//    user: { username, role, email, ... }
// }

// Client stores token in localStorage or sends it in header:
// Authorization: Bearer <token>

// ────────────────────────────────────────────────────────────

// ┌──────────────────────────────────────────────┐
// │ 3. Access Protected Route (GET /users)       │
// └──────────────────────────────────────────────┘
//           │
//           ▼
// 🛡️ Middleware: `authenticate`
//     └─ Reads `Authorization` header
//     └─ Extracts and verifies JWT using `jwt.verify()`
//     └─ Gets `userId` from payload
//     └─ Calls `findUserById(userId)`
//     └─ Sets `req.user = user`
//           │
//           ▼
// ✅ If verified → call next()
// ❌ If invalid or expired → 401 Unauthorized

// ────────────────────────────────────────────────────────────

// ┌────────────────────────┐
// │ 4. Controller Handles  │
// └────────────────────────┘
//           │
//           ▼
// 📦 Controller (e.g., `getUsers`)
//     └─ Uses `req.user` info (authenticated user)
//     └─ Can also restrict by role (e.g. only admin)
//           │
//           ▼
// 📨 Responds with protected data