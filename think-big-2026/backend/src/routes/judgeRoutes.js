"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const judgeController_1 = require("../controllers/judgeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Admin Routes
router.post('/create', auth_1.protect, auth_1.adminCheck, judgeController_1.createJudge);
router.get('/all', auth_1.protect, auth_1.adminCheck, judgeController_1.getAllJudges);
router.put('/:judgeId/assign', auth_1.protect, auth_1.adminCheck, judgeController_1.assignTeamsToJudge);
// Judge Routes
router.get('/assigned-teams', auth_1.protect, auth_1.judgeCheck, judgeController_1.getAssignedTeams);
exports.default = router;
//# sourceMappingURL=judgeRoutes.js.map