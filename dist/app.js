"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const petRoutes_1 = __importDefault(require("./routes/petRoutes"));
const adoptRoutes_1 = __importDefault(require("./routes/adoptRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', userRoutes_1.default);
app.use('/api', petRoutes_1.default);
app.use('/api', adoptRoutes_1.default);
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    throw new Error('Mongo Url is not define');
}
mongoose_1.default.connect(mongoUrl)
    .then(data => app.listen(3000, () => console.log('Server started')))
    .catch(err => new Error(err));
//# sourceMappingURL=app.js.map