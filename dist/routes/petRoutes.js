"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const petController_1 = require("../controllers/petController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.post('/pets', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin', 'employee'), petController_1.registerPet);
router.get('/pets', petController_1.getPets);
router.get('/pets/admin', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), petController_1.getPetsByAdmin);
router.get('/pets/id/:id', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), petController_1.getPetById);
router.get('/pets/petTag/:petTag', authenticate_1.authenticate, petController_1.getPetByPetTag);
router.get('/pets/filter', authenticate_1.authenticate, petController_1.filterPets);
router.get('/pets/age', authenticate_1.authenticate, petController_1.fromTo);
router.get('/pets/price', authenticate_1.authenticate, petController_1.fromTo);
router.patch('/pets/update/id/:id', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), petController_1.updatePet);
router.patch('/pets/update/petTag/:petTag', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin', 'employee'), petController_1.updatePet);
router.delete('/pets/delete/id/:id', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), petController_1.deletePet);
router.delete('/pets/delete/petTag/:petTag', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), petController_1.deletePet);
exports.default = router;
//# sourceMappingURL=petRoutes.js.map