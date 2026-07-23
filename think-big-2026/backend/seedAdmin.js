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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./src/models/User"));
dotenv_1.default.config();
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/think-big-2026');
        console.log('Connected to MongoDB');
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash('vsbeeeclub', salt);
        yield User_1.default.findOneAndUpdate({ username: 'ELECTRICAL-CLUB' }, { username: 'ELECTRICAL-CLUB', passwordHash, role: 'admin', isFirstLogin: false }, { upsert: true });
        console.log('Admin user successfully seeded (or updated)!');
        console.log('Username: ELECTRICAL-CLUB');
        console.log('Password: vsbeeeclub');
        process.exit(0);
    }
    catch (error) {
        console.error('Failed to seed admin:', error);
        process.exit(1);
    }
});
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map