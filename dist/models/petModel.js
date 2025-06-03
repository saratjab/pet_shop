"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const petSchema = new mongoose_1.default.Schema({
    petTag: {
        type: String,
        required: [true, 'Enter a petTag'],
        unique: true,
        lowercase: true
    },
    name: {
        type: String
    },
    kind: {
        type: String,
        required: [true, 'Enter the kind']
    },
    age: {
        type: Number,
        required: [true, 'Enter age']
    },
    price: {
        type: Number,
        required: [true, 'Enter the price']
    },
    description: {
        type: String
    },
    gender: {
        type: String,
        required: [true, 'Enter the gender'],
        enum: ['M', 'F']
    },
    isAdopted: {
        type: Boolean,
        required: [true, 'Is the pet Adopted or Not'],
        default: false
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Pet', petSchema);
//# sourceMappingURL=petModel.js.map