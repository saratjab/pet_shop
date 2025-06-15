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
exports.updated = exports.deleteByAdmin = exports.unActive = exports.unActiveUser = exports.getUserByUsername = exports.getUserById = exports.getUsers = exports.registerEmployee = exports.registerUser = exports.login = void 0;
const userService_1 = require("../service/userService");
const jwt_1 = require("../utils/jwt");
const handleErrors_1 = require("../utils/handleErrors");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield (0, userService_1.findUserByUsername)(username);
        const match = yield (0, userService_1.verifyPassword)(password, user);
        const token = (0, jwt_1.generateToken)(user.id);
        res.status(200).json({
            token: token,
            user: {
                username: username,
                role: user.role,
                email: user.email,
                address: user.address
            }
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.login = login;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        req.body.role = 'customer';
        const savedUser = yield (0, userService_1.saveUser)(newUser);
        res.status(201).json({
            username: savedUser.username,
            role: savedUser.role,
            email: savedUser.email,
            address: savedUser.address
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.registerUser = registerUser;
const registerEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmp = req.body;
        req.body.role = 'employee';
        const savedEmp = yield (0, userService_1.saveUser)(newEmp);
        res.status(201).json({
            username: savedEmp.username,
            role: savedEmp.role,
            email: savedEmp.email,
            address: savedEmp.address
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.registerEmployee = registerEmployee;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.findAllUsers)();
        res.status(200).json(users.map(user => ({
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address
        })));
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userService_1.findUserById)(req.params.id);
        res.status(200).json({
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getUserById = getUserById;
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userService_1.findUserByUsername)(req.params.username);
        res.status(200).json({
            username: user.username,
            role: user.role,
            email: user.email,
            address: user.address
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.getUserByUsername = getUserByUsername;
<<<<<<< HEAD
||||||| e2363f1
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password, email, address } = req.body;
        const user = yield (0, userService_1.findUserById)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const updatedUser = yield (0, userService_1.updateUserInof)(user, password, email, address);
        res.status(200).json({
            username: updatedUser.username,
            role: updatedUser.role,
            email: updatedUser.email,
            address: updatedUser.address
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.updateUser = updateUser;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const { role } = req.body;
        const user = yield (0, userService_1.findUserByUsername)(username);
        user.role = role;
        yield (0, userService_1.saveUser)(user);
        res.status(200).json({
            message: 'User role updated',
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(500).json(errors);
    }
});
exports.updateUserRole = updateUserRole;
=======
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password, email, address } = req.body;
        const user = yield (0, userService_1.findUserById)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const updatedUser = yield (0, userService_1.updateUserInfo)(user, password, email, address);
        res.status(200).json({
            username: updatedUser.username,
            role: updatedUser.role,
            email: updatedUser.email,
            address: updatedUser.address
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.updateUser = updateUser;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const { role } = req.body;
        const user = yield (0, userService_1.findUserByUsername)(username);
        user.role = role;
        yield (0, userService_1.saveUser)(user);
        res.status(200).json({
            message: 'User role updated',
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(500).json(errors);
    }
});
exports.updateUserRole = updateUserRole;
>>>>>>> improvement/handle-error-types
const unActiveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userService_1.findUserByUsername)(req.params.username);
        user.isActive = false;
        yield (0, userService_1.saveUser)(user);
        res.status(200).json({ message: `${user.username} have been deleted` });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.unActiveUser = unActiveUser;
const unActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield (0, userService_1.findUserById)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        user.isActive = false;
        yield (0, userService_1.saveUser)(user);
        res.status(200).json({ message: 'You delete your account' });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(404).json(errors);
    }
});
exports.unActive = unActive;
const deleteByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user;
        let option;
        if (req.originalUrl.includes('id')) {
            user = yield (0, userService_1.findUserById)(req.params.id);
            option = 'id';
        }
        else {
            user = yield (0, userService_1.findUserByUsername)(req.params.username);
            option = 'username';
        }
        user.isActive = false;
        yield user.save();
        res.send(200).json({ message: `${req.params.option} has been deleted` });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(400).json(errors);
    }
});
exports.deleteByAdmin = deleteByAdmin;
const updated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let UUser;
        if (req.originalUrl.includes('role')) {
            UUser = yield (0, userService_1.update)(yield (0, userService_1.findUserByUsername)(req.params.username), req.body);
        }
        else {
            if (req.body.role)
                throw Error(`You can't change your role`);
            UUser = yield (0, userService_1.update)(yield (0, userService_1.findUserById)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id), req.body);
        }
        res.status(200).json({
            username: UUser.username,
            role: UUser.role,
            email: UUser.email,
            address: UUser.address
        });
    }
    catch (err) {
        const errors = (0, handleErrors_1.handleError)(err);
        res.status(500).json(errors);
    }
});
exports.updated = updated;
//# sourceMappingURL=userController.js.map