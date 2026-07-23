"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activityController_1 = require("../controllers/activityController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.protect, auth_1.adminCheck, activityController_1.getActivities);
exports.default = router;
//# sourceMappingURL=activityRoutes.js.map