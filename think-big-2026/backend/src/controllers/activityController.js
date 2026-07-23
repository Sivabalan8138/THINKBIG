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
exports.getActivities = void 0;
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const getActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield ActivityLog_1.default.find().sort({ createdAt: -1 }).limit(50);
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
    }
});
exports.getActivities = getActivities;
//# sourceMappingURL=activityController.js.map