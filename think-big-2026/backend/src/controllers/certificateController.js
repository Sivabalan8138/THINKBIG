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
exports.verifyCertificate = exports.issueCertificates = void 0;
const Certificate_1 = __importDefault(require("../models/Certificate"));
const Team_1 = __importDefault(require("../models/Team"));
const certificateService_1 = require("../services/certificateService");
const emailService_1 = require("../services/emailService");
const issueCertificates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        const { certificateType } = req.body; // e.g., 'Participation Certificate'
        const team = yield Team_1.default.findById(teamId);
        if (!team)
            return res.status(404).json({ message: 'Team not found' });
        const generatedCerts = [];
        // Issue for Leader
        const leaderCertId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const leaderCertPath = yield (0, certificateService_1.generateCertificate)({
            teamName: team.teamName,
            studentName: team.teamLeader.studentName,
            registerNumber: team.teamLeader.registerNumber,
            projectTitle: team.projectTitle,
            eventName: 'THINK BIG 2026',
            certificateType,
            certificateId: leaderCertId,
            department: team.teamLeader.department,
            year: team.teamLeader.year,
        });
        // Email to Leader
        if (team.teamLeader.email) {
            yield (0, emailService_1.sendCertificateEmail)(team.teamLeader.email, team.teamName, leaderCertPath);
        }
        const leaderCert = yield Certificate_1.default.create({
            certificateId: leaderCertId,
            teamId: team._id,
            memberRegisterNumber: team.teamLeader.registerNumber,
            certificateType,
            qrCodeUrl: `https://thinkbig2026.com/verify?id=${leaderCertId}`,
            pdfUrl: `/certificates/${leaderCertId}.pdf` // Local path for now, can be Cloudinary
        });
        generatedCerts.push(leaderCert);
        // Issue for Members
        for (const member of team.members) {
            const memberCertId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            const memberCertPath = yield (0, certificateService_1.generateCertificate)({
                teamName: team.teamName,
                studentName: member.studentName,
                registerNumber: member.registerNumber,
                projectTitle: team.projectTitle,
                eventName: 'THINK BIG 2026',
                certificateType,
                certificateId: memberCertId,
                department: member.department,
                year: member.year,
            });
            // Email to Member (Wait, members might not have emails in the schema, but if they do, we'd send it. Currently the Team model only stores email for teamLeader. The user asked for "Certificate Email: PDF Certificate Attachment". Let's just email all certificates to the team leader for distribution, or assume member.email exists. The schema only has email on teamLeader.)
            if (team.teamLeader.email) {
                // Send member's certificate to the team leader as well, since members don't have emails in the schema
                yield (0, emailService_1.sendCertificateEmail)(team.teamLeader.email, team.teamName, memberCertPath);
            }
            const memberCert = yield Certificate_1.default.create({
                certificateId: memberCertId,
                teamId: team._id,
                memberRegisterNumber: member.registerNumber,
                certificateType,
                qrCodeUrl: `https://thinkbig2026.com/verify?id=${memberCertId}`,
                pdfUrl: `/certificates/${memberCertId}.pdf`
            });
            generatedCerts.push(memberCert);
        }
        res.json({ message: 'Certificates issued successfully', certificates: generatedCerts });
    }
    catch (error) {
        console.error('Certificate Issue Error:', error);
        res.status(500).json({ message: 'Failed to issue certificates', error: error.message });
    }
});
exports.issueCertificates = issueCertificates;
const verifyCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificateId = req.params.certificateId;
        const cert = yield Certificate_1.default.findOne({ certificateId }).populate('teamId');
        if (!cert)
            return res.status(404).json({ valid: false, message: 'Invalid Certificate' });
        const team = cert.teamId;
        let studentName = 'Unknown';
        if (team.teamLeader.registerNumber === cert.memberRegisterNumber) {
            studentName = team.teamLeader.studentName;
        }
        else if (team.members) {
            const member = team.members.find((m) => m.registerNumber === cert.memberRegisterNumber);
            if (member)
                studentName = member.studentName;
        }
        res.json({
            valid: true,
            studentName,
            teamName: team.teamName,
            projectTitle: team.projectTitle,
            eventName: 'THINK BIG 2026',
            certificateType: cert.certificateType
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
});
exports.verifyCertificate = verifyCertificate;
//# sourceMappingURL=certificateController.js.map