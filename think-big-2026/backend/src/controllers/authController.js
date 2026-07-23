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
exports.changePassword = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
            token: generateToken(user._id.toString(), user.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = yield bcrypt_1.default.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        user.passwordHash = yield bcrypt_1.default.hash(newPassword, salt);
        user.isFirstLogin = false;
        yield user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=authController.js.map