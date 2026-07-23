"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/:reportType/export/:format', auth_1.protect, auth_1.adminCheck, reportController_1.generateReport);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map