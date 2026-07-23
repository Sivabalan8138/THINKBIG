"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluationController_1 = require("../controllers/evaluationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/:teamId/ai', auth_1.protect, auth_1.adminCheck, evaluationController_1.triggerAiEvaluation);
router.post('/:teamId/admin-score', auth_1.protect, auth_1.adminCheck, evaluationController_1.submitAdminJudgeScore);
router.post('/:teamId/judge', auth_1.protect, auth_1.judgeCheck, evaluationController_1.submitJudgeEvaluation);
router.post('/unlock/:evalId', auth_1.protect, auth_1.adminCheck, evaluationController_1.adminUnlockEvaluation);
router.post('/publish', auth_1.protect, auth_1.adminCheck, evaluationController_1.publishResults);
router.post('/calculate-rankings', auth_1.protect, auth_1.adminCheck, evaluationController_1.calculateRankings);
router.get('/leaderboard', evaluationController_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=evaluationRoutes.js.map