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
const mongoose_1 = __importDefault(require("mongoose"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const testSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Enter name']
    },
    age: {
        type: Number,
        required: [true, 'Enter age']
    },
    email: {
        type: String,
        required: [true, 'Enter Email'],
        validate: [isEmail_1.default, 'Enter a valid Email']
    },
    password: {
        type: String,
        required: [true, 'Enter a password']
    }
});
testSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        const salt = yield bcryptjs_1.default.genSalt();
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        next();
    });
});
exports.default = mongoose_1.default.model('Test', testSchema);
//# sourceMappingURL=test.js.map