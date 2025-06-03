"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const adoptSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Enter user id'],
        ref: 'User'
    },
    pets: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        required: [true, 'Enter pets'],
        ref: 'Pet'
    },
    payMoney: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: [true, 'total not calculated']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Adopt', adoptSchema);
//# sourceMappingURL=adoptModel.js.map