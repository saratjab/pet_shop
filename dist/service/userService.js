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
exports.updateUserInfo = exports.verifyPassword = exports.saveUser = exports.findUserByUsername = exports.findUserById = exports.findAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({ isActive: true });
    if (users.length === 0)
        throw Error('No Users found');
    return users;
});
exports.findAllUsers = findAllUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ _id: id, isActive: true });
    if (!user)
        throw Error('User not found');
    return user;
});
exports.findUserById = findUserById;
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ username: username, isActive: true });
    if (!user)
        throw Error('User not found');
    return user;
});
exports.findUserByUsername = findUserByUsername;
const saveUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new userModel_1.default(user);
    const savedUser = yield newUser.save();
    if (!savedUser) {
        throw Error(`Error saving user`);
    }
    return savedUser;
});
exports.saveUser = saveUser;
const verifyPassword = (password, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw Error(`Wrong Password`);
    return isMatch;
});
exports.verifyPassword = verifyPassword;
const updateUserInfo = (user, password, email, address) => __awaiter(void 0, void 0, void 0, function* () {
    if (password)
        user.password = password;
    if (email)
        user.email = email;
    if (address)
        user.address = address;
    return yield user.save();
});
exports.updateUserInfo = updateUserInfo;
//# sourceMappingURL=userService.js.map