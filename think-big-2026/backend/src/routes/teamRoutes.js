"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../utils/upload");
const router = express_1.default.Router();
router.post('/register', teamController_1.registerTeam);
router.post('/:teamId/upload', upload_1.upload.fields([
    { name: 'ppt', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
]), teamController_1.uploadFiles);
router.get('/', auth_1.protect, auth_1.adminCheck, teamController_1.getAllTeams);
router.delete('/:id', auth_1.protect, auth_1.adminCheck, teamController_1.deleteTeam);
exports.default = router;
//# sourceMappingURL=teamRoutes.js.map