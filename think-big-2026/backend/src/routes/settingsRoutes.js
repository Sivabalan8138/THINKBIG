"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const settingsController_1 = require("../controllers/settingsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Setup local storage for multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.get('/', settingsController_1.getSettings);
router.put('/', auth_1.protect, auth_1.adminCheck, settingsController_1.updateSettings);
router.post('/upload-certificate', auth_1.protect, auth_1.adminCheck, upload.single('certificate'), settingsController_1.uploadSampleCertificate);
exports.default = router;
//# sourceMappingURL=settingsRoutes.js.map