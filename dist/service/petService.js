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
exports.deletePets = exports.findAllPetsByAdmin = exports.filterAgePrice = exports.updatePets = exports.savePet = exports.filter = exports.findPetByPetTag = exports.findPetById = exports.findAllPets = void 0;
const petModel_1 = __importDefault(require("../models/petModel"));
const findAllPets = () => __awaiter(void 0, void 0, void 0, function* () {
    const pets = yield petModel_1.default.find({ isAdopted: false });
    if (pets.length === 0)
        throw Error('no pets found');
    return pets;
});
exports.findAllPets = findAllPets;
const findPetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pet = yield petModel_1.default.findById(id);
    if (!pet)
        throw Error('pet not found');
    return pet;
});
exports.findPetById = findPetById;
const findPetByPetTag = (petTag) => __awaiter(void 0, void 0, void 0, function* () {
    const pet = yield petModel_1.default.findOne({ petTag: petTag, isAdopted: false });
    if (!pet)
        throw Error('pet not found');
    return pet;
});
exports.findPetByPetTag = findPetByPetTag;
const filter = (option) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    if (option.kind)
        query.kind = option.kind;
    if (option.price !== undefined)
        query.price = option.price;
    if (option.age !== undefined)
        query.age = option.age;
    if (option.gender)
        query.gender = option.gender;
    if (option.isAdopted !== undefined)
        query.isAdopted = option.isAdopted;
    const pets = yield petModel_1.default.find(query);
    if (pets.length === 0)
        throw Error('pet not found');
    return pets;
});
exports.filter = filter;
const savePet = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newPet = new petModel_1.default(user);
    const savedPet = yield newPet.save();
    if (!savedPet)
        throw Error(`Error saving user`);
    return savedPet;
});
exports.savePet = savePet;
const updatePets = (pet, petP) => __awaiter(void 0, void 0, void 0, function* () {
    Object.assign(pet, petP);
    return yield (0, exports.savePet)(pet);
});
exports.updatePets = updatePets;
const filterAgePrice = (_a) => __awaiter(void 0, [_a], void 0, function* ({ from, to, by }) {
    let query = {};
    if (from && to) {
        query[by] = { $gte: from, $lte: to };
    }
    else if (from) {
        query[by] = { $gte: from };
    }
    else if (to) {
        query[by] = { $lte: to };
    }
    const pets = yield petModel_1.default.find(query);
    if (pets.length === 0)
        throw Error('no pets found');
    return pets;
});
exports.filterAgePrice = filterAgePrice;
const findAllPetsByAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const pets = yield petModel_1.default.find({});
    if (pets.length === 0)
        throw Error('no pets found');
    return pets;
});
exports.findAllPetsByAdmin = findAllPetsByAdmin;
const deletePets = (id, petTag) => __awaiter(void 0, void 0, void 0, function* () {
    if (id) {
        yield petModel_1.default.deleteMany({
            _id: { $in: id }
        });
    }
    if (petTag) {
        yield petModel_1.default.deleteMany({
            petTag: { $in: petTag }
        });
    }
});
exports.deletePets = deletePets;
//# sourceMappingURL=petService.js.map