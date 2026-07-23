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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const User_1 = __importDefault(require("./models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const evaluationRoutes_1 = __importDefault(require("./routes/evaluationRoutes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to Database
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminCount = yield User_1.default.countDocuments({ role: 'admin' });
        if (adminCount === 0) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield bcrypt_1.default.hash('vsbeeeclub', salt);
            yield User_1.default.create({
                username: 'ELECTRICAL-CLUB',
                passwordHash,
                role: 'admin',
                isFirstLogin: true,
            });
            console.log('Default Admin seeded successfully: ELECTRICAL-CLUB');
        }
    }
    catch (error) {
        console.error('Failed to seed admin:', error);
    }
});
(0, db_1.default)().then(() => {
    seedAdmin();
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/teams', teamRoutes_1.default);
app.use('/api/evaluations', evaluationRoutes_1.default);
app.use('/api/certificates', certificateRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.send('THINK BIG 2026 API is running...');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map