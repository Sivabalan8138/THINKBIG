"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const certificateController_1 = require("../controllers/certificateController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/issue/:teamId', auth_1.protect, auth_1.adminCheck, certificateController_1.issueCertificates);
router.get('/verify/:certificateId', certificateController_1.verifyCertificate);
exports.default = router;
//# sourceMappingURL=certificateRoutes.js.map