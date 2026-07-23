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
exports.uploadSampleCertificate = exports.updateSettings = exports.getSettings = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const cloudinaryHelper_1 = require("../utils/cloudinaryHelper");
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield Settings_1.default.findOne();
        if (!settings) {
            settings = yield Settings_1.default.create({});
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getSettings = getSettings;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isRegistrationOpen, isCandidateIdOpen, certNameX, certNameY, certDeptX, certDeptY, certQrX, certQrY, certNameFontSize } = req.body;
        let settings = yield Settings_1.default.findOne();
        if (!settings) {
            settings = new Settings_1.default();
        }
        if (isRegistrationOpen !== undefined)
            settings.isRegistrationOpen = isRegistrationOpen;
        if (isCandidateIdOpen !== undefined)
            settings.isCandidateIdOpen = isCandidateIdOpen;
        if (certNameX !== undefined)
            settings.certNameX = certNameX;
        if (certNameY !== undefined)
            settings.certNameY = certNameY;
        if (certDeptX !== undefined)
            settings.certDeptX = certDeptX;
        if (certDeptY !== undefined)
            settings.certDeptY = certDeptY;
        if (certQrX !== undefined)
            settings.certQrX = certQrX;
        if (certQrY !== undefined)
            settings.certQrY = certQrY;
        if (certNameFontSize !== undefined)
            settings.certNameFontSize = certNameFontSize;
        yield settings.save();
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateSettings = updateSettings;
const uploadSampleCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = yield (0, cloudinaryHelper_1.uploadToCloudinary)(req.file.buffer, req.file.mimetype, 'think-big-2026/certificates', 'raw');
        let settings = yield Settings_1.default.findOne();
        if (!settings) {
            settings = new Settings_1.default();
        }
        settings.sampleCertificateUrl = fileUrl;
        yield settings.save();
        res.json({ message: 'Upload successful', url: fileUrl });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error uploading file' });
    }
});
exports.uploadSampleCertificate = uploadSampleCertificate;
//# sourceMappingURL=settingsController.js.map