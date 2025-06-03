"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const adoptController_1 = require("../controllers/adoptController");
const router = express_1.default.Router();
router.get('adoptions/:id', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), adoptController_1.getAdoption);
router.get('/adoptions', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('admin'), adoptController_1.getAdoptions);
router.post('/adoption', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('customer'), adoptController_1.adoption);
router.get('/adoptions/show', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('customer'), adoptController_1.getMyPets);
router.get('/adoptions/pays', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('customer'), adoptController_1.getRemains);
router.post('/adoptions/pay', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('customer'), adoptController_1.payment);
router.post('/adoptions/cancel', authenticate_1.authenticate, (0, authorize_1.authorizeRoles)('customer'), adoptController_1.cancelPets);
exports.default = router;
//# sourceMappingURL=adoptRoutes.js.map