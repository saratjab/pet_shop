"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.post('/user', userController_1.registerUser);
router.post('/login', userController_1.login);
router.post('/user/employee', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), userController_1.registerEmployee);
router.get('/user', authenticate_1.authenticate, userController_1.getUsers);
router.get('/user/id/:id', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), userController_1.getUserById);
router.get('/user/username/:username', authenticate_1.authenticate, userController_1.getUserByUsername);
router.patch('/user/alter', authenticate_1.authenticate, userController_1.updated);
router.patch('/user/role/:username', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), userController_1.updated);
router.delete('/user/unactive/:username', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), userController_1.unActiveUser);
router.delete('/user/unactive', authenticate_1.authenticate, userController_1.unActive);
router.delete('/user/delete/id/:id', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), userController_1.deleteByAdmin);
router.delete('/user/delete/username/:username', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), userController_1.deleteByAdmin);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map