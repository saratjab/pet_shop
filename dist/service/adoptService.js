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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelingPets = exports.meakPetsFalse = exports.payments = exports.getMoney = exports.findMyPets = exports.findAdoptById = exports.findAllAdopts = exports.saveAdopt = exports.makePetsTrueAndGetTotal = exports.isCustomerOld = exports.isPetValid = void 0;
const adoptModel_1 = __importDefault(require("../models/adoptModel"));
const petModel_1 = __importDefault(require("../models/petModel"));
const userService_1 = require("../service/userService");
const petService_1 = require("../service/petService");
const mongodb_1 = require("mongodb");
const isPetValid = (pets) => __awaiter(void 0, void 0, void 0, function* () {
    const petsData = yield petModel_1.default.find({
        _id: { $in: pets }
    });
    if (petsData.some(p => !p || p.isAdopted)) {
        throw Error('One or more pets not found or already adopted');
    }
    return petsData;
});
exports.isPetValid = isPetValid;
const isCustomerOld = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adoptModel_1.default.findOne({ user_id });
    if (user)
        return true;
    return false;
});
exports.isCustomerOld = isCustomerOld;
const makePetsTrueAndGetTotal = (pets) => __awaiter(void 0, void 0, void 0, function* () {
    let total = 0;
    yield petModel_1.default.updateMany({ _id: { $in: pets.map(pet => pet.id) } }, { $set: { isAdopted: false } });
    return total;
});
exports.makePetsTrueAndGetTotal = makePetsTrueAndGetTotal;
const saveAdopt = (user_id, adopt) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield (0, userService_1.findUserById)(user_id);
    const pets = yield (0, exports.isPetValid)(adopt.pets);
    const total = yield (0, exports.makePetsTrueAndGetTotal)(pets);
    const isOld = yield (0, exports.isCustomerOld)(user.id);
    let adoptDoc;
    if (isOld) {
        const userDB = yield adoptModel_1.default.findOne({ user_id: user.id });
        if (!userDB)
            throw Error('user not found');
        adoptDoc = userDB;
        adoptDoc.pets.push(...adopt.pets);
        adoptDoc.total += total;
        adoptDoc.payMoney += (_a = adopt.payMoney) !== null && _a !== void 0 ? _a : 0;
    }
    else {
        adoptDoc = new adoptModel_1.default({
            user_id: user_id,
            pets: adopt.pets,
            payMoney: (_b = adopt.payMoney) !== null && _b !== void 0 ? _b : 0,
            total: total
        });
    }
    if (adoptDoc.payMoney < adoptDoc.total) {
        adoptDoc.status = 'pending';
    }
    else if (adoptDoc.payMoney === adoptDoc.total) {
        adoptDoc.status = 'completed';
    }
    else {
        let remaining = adoptDoc.payMoney - adoptDoc.total;
        adoptDoc.payMoney = adoptDoc.total;
        throw Error(`remining ${remaining}$`);
    }
    return yield adoptDoc.save();
});
exports.saveAdopt = saveAdopt;
const findAllAdopts = () => __awaiter(void 0, void 0, void 0, function* () {
    const adopts = yield adoptModel_1.default.find({});
    if (!adopts || adopts.length === 0)
        throw Error('No Adopts found');
    return adopts;
});
exports.findAllAdopts = findAllAdopts;
const findAdoptById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const adopt = yield adoptModel_1.default.findById(id);
    if (!adopt)
        throw new Error('Adopt not found');
    return adopt;
});
exports.findAdoptById = findAdoptById;
const findMyPets = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const adopt = yield adoptModel_1.default.findOne({ user_id });
    if (!adopt)
        throw Error('no adoption');
    return adopt;
});
exports.findMyPets = findMyPets;
const getMoney = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const adopt = yield adoptModel_1.default.findOne({ user_id });
    if (!adopt)
        throw Error('no adoption');
    return {
        total: adopt.total,
        payMoney: adopt.payMoney,
        remian: adopt.total - adopt.payMoney
    };
});
exports.getMoney = getMoney;
const payments = (user_id, money) => __awaiter(void 0, void 0, void 0, function* () {
    const adopt = yield adoptModel_1.default.findOne({ user_id });
    if (!adopt)
        throw Error('no adoption');
    adopt.payMoney += money;
    if (adopt.payMoney < adopt.total) {
        adopt.status = 'pending';
    }
    else if (adopt.payMoney === adopt.total) {
        adopt.status = 'completed';
    }
    else {
        let remaining = adopt.payMoney - adopt.total;
        adopt.payMoney = adopt.total;
        adopt.status = 'completed';
    }
    yield adopt.save();
    return { total: adopt.total, payMoney: adopt.payMoney, remian: adopt.total - adopt.payMoney };
});
exports.payments = payments;
const meakPetsFalse = (pets) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(pets.map((pet) => __awaiter(void 0, void 0, void 0, function* () {
        const nPet = yield (0, petService_1.findPetById)(pet);
        nPet.isAdopted = false;
        nPet.save();
    })));
});
exports.meakPetsFalse = meakPetsFalse;
const cancelingPets = (user_id, pets) => __awaiter(void 0, void 0, void 0, function* () {
    const adopt = yield adoptModel_1.default.findOne({ user_id });
    if (!adopt)
        throw Error('no adoption');
    let total = 0;
    let flag = true;
    const petDelete = yield Promise.all(pets.map((pet) => __awaiter(void 0, void 0, void 0, function* () {
        const dPet = yield (0, petService_1.findPetById)(pet);
        const objId = new mongodb_1.ObjectId(pet);
        if (!adopt.pets.includes(objId.toString())) {
            flag = false;
        }
        total += dPet.price;
        return dPet;
    })));
    if (!flag) {
        throw Error('one or more pets not adopted by you');
    }
    (0, exports.meakPetsFalse)(pets);
    let newTotal = adopt.total - total;
    if (adopt.payMoney >= newTotal) {
        adopt.payMoney = newTotal;
        adopt.status = 'completed';
    }
    else if (adopt.payMoney < newTotal) {
        adopt.status = 'pending';
    }
    adopt.pets = adopt.pets.filter(pet => !pets.includes(pet.toString()));
    adopt.total = newTotal;
    return yield adopt.save();
});
exports.cancelingPets = cancelingPets;
//# sourceMappingURL=adoptService.js.map