"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const router = express_1.default.Router();
router.get('/export/excel', attendanceController_1.exportExcel);
router.get('/export/pdf', attendanceController_1.exportPdf);
router.get('/export/word', attendanceController_1.exportWord);
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map