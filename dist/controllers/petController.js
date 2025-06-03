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
exports.updatePet = exports.fromTo = exports.filterPets = exports.getPetByPetTag = exports.getPetById = exports.getPets = exports.registerPet = void 0;
const petService_1 = require("../service/petService");
const handleErrors_1 = require("../utils/handleErrors");
const registerPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPet = req.body;
        const savedPet = yield (0, petService_1.savePet)(newPet);
        res.status(201).json({
            petTag: savedPet.petTag,
            name: savedPet.name,
            kind: savedPet.kind,
            age: savedPet.age,
            price: savedPet.price,
            description: savedPet.description,
            gender: savedPet.gender,
            isAdopted: savedPet.isAdopted
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.registerPet = registerPet;
const getPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPets = yield (0, petService_1.findAllPets)();
        res.status(200).json(allPets.map(pet => ({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes' : 'No'
        })));
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.json(404).json(errors);
    }
});
exports.getPets = getPets;
const getPetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pet = yield (0, petService_1.findPetById)(req.params.id);
        res.status(200).json({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes' : 'No'
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getPetById = getPetById;
const getPetByPetTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pet = yield (0, petService_1.findPetByPetTag)(req.params.petTag);
        res.status(200).json({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes' : 'No'
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getPetByPetTag = getPetByPetTag;
const filterPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { kind, gender } = req.query;
        const age = req.query.age ? parseInt(req.query.age) : undefined;
        const price = req.query.price ? parseInt(req.query.price) : undefined;
        const isAdopted = req.query.isAdopted === 'true' ? true : req.query.isAdopted === 'false' ? false : undefined;
        const pets = yield (0, petService_1.filter)({
            kind: kind,
            gender: gender,
            age,
            price,
            isAdopted
        });
        res.status(200).json(pets.map(pet => ({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes' : 'No'
        })));
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.filterPets = filterPets;
const fromTo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const from = req.query.from ? parseInt(req.query.from) : null;
        const to = req.query.to ? parseInt(req.query.to) : null;
        let by = '';
        if (req.originalUrl.includes('age')) {
            by = 'age';
        }
        else if (req.originalUrl.includes('price')) {
            by = 'price';
        }
        const pets = yield (0, petService_1.filterAgePrice)({ from, to, by });
        res.status(200).json(pets.map(pet => ({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes' : 'No'
        })));
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.fromTo = fromTo;
const updatePet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pet;
        if (req.originalUrl.includes('id')) {
            pet = yield (0, petService_1.findPetById)(req.params.id);
        }
        else {
            pet = yield (0, petService_1.findPetByPetTag)(req.params.petTag);
        }
        const uPet = req.body;
        const updatedPet = yield (0, petService_1.updatePets)(pet, uPet);
        res.status(200).json({
            petTag: updatedPet.petTag,
            name: updatedPet.name,
            kind: updatedPet.kind,
            age: updatedPet.age,
            price: updatedPet.price,
            description: updatedPet.description,
            gender: updatedPet.gender,
            isAdopted: updatedPet.isAdopted ? 'Yes' : 'No'
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.updatePet = updatePet;
//# sourceMappingURL=petController.js.map