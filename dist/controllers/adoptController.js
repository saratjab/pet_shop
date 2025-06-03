"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdoption = exports.cancelPets = exports.payment = exports.getRemains = exports.getMyPets = exports.getAdoptions = exports.adoption = void 0;
const adoptService_1 = require("../service/adoptService");
const handleErrors_1 = require("../utils/handleErrors");
const adoption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedAdopt = yield (0, adoptService_1.saveAdopt)(req.user.id, req.body);
        res.status(201).json({
            user_id: savedAdopt.user_id,
            pets: savedAdopt.pets,
            payMoney: savedAdopt.payMoney,
            total: savedAdopt.total,
            status: savedAdopt.status
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.adoption = adoption;
const getAdoptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adoptions = yield (0, adoptService_1.findAllAdopts)();
        res.status(200).json(adoptions.map(adopts => ({
            user_id: adopts.user_id,
            pets: adopts.pets,
            payMoney: adopts.payMoney,
            total: adopts.total,
            status: adopts.status
        })));
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getAdoptions = getAdoptions;
const getMyPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const pets = yield (0, adoptService_1.findMyPets)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        res.status(200).json({
            user_id: pets.user_id,
            pets: pets.pets,
            payMoney: pets.payMoney,
            total: pets.total,
            status: pets.status
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getMyPets = getMyPets;
const getRemains = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const infoPay = yield (0, adoptService_1.getMoney)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        res.status(200).json(infoPay);
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.getRemains = getRemains;
const payment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const money = req.body.payMoney;
        const pays = yield (0, adoptService_1.payments)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, money);
        res.status(200).json(pays);
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.payment = payment;
const cancelPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const pets = req.body.pets;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const adopt = yield (0, adoptService_1.cancelingPets)(user_id, pets);
        res.status(200).json(adopt);
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.cancelPets = cancelPets;
const getAdoption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adopt = yield (0, adoptService_1.findAdoptById)(req.body.adopt_id);
        res.status(200).json({
            user_id: adopt.user_id,
            pets: adopt.pets,
            payMoney: adopt.payMoney,
            total: adopt.total,
            status: adopt.status
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.getAdoption = getAdoption;
//# sourceMappingURL=adoptController.js.map