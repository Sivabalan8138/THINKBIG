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
exports.generateHallTicket = exports.generateQR = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const cloudinaryHelper_1 = require("./cloudinaryHelper");
const generateQR = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = yield qrcode_1.default.toBuffer(teamId, {
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    });
    return yield (0, cloudinaryHelper_1.uploadToCloudinary)(buffer, 'image/png', 'think-big-2026/qrcodes', 'image');
});
exports.generateQR = generateQR;
const generateHallTicket = (team, qrCodeUrl) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const pdfData = Buffer.concat(buffers);
                    const url = yield (0, cloudinaryHelper_1.uploadToCloudinary)(pdfData, 'application/pdf', 'think-big-2026/halltickets', 'raw');
                    resolve(url);
                }
                catch (err) {
                    reject(err);
                }
            }));
            // Title
            doc.fontSize(24).font('Helvetica-Bold').text('THINK BIG 2026', { align: 'center' });
            doc.fontSize(16).text('Official Team Hall Ticket', { align: 'center' });
            doc.moveDown();
            // Team Details
            doc.fontSize(14).font('Helvetica-Bold').text('Team Information:');
            doc.fontSize(12).font('Helvetica').text(`Team ID: ${team.teamId}`);
            doc.text(`Team Name: ${team.teamName}`);
            doc.text(`Project Title: ${team.projectTitle}`);
            doc.text(`Domain: ${team.domain}`);
            doc.moveDown();
            // Leader
            doc.fontSize(14).font('Helvetica-Bold').text('Team Leader:');
            doc.fontSize(12).font('Helvetica').text(`${team.teamLeader.studentName} (${team.teamLeader.registerNumber}) - ${team.teamLeader.department}, Year ${team.teamLeader.year}`);
            doc.moveDown();
            // Members
            if (team.members && team.members.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text('Team Members:');
                doc.fontSize(12).font('Helvetica');
                team.members.forEach((m, idx) => {
                    doc.text(`${idx + 2}. ${m.studentName} (${m.registerNumber}) - ${m.department}, Year ${m.year}`);
                });
                doc.moveDown(2);
            }
            doc.text('Scan QR Code for Entry:', { align: 'center' });
            doc.moveDown(0.5);
            // QR Code
            if (qrCodeUrl) {
                try {
                    const response = yield fetch(qrCodeUrl);
                    const arrayBuffer = yield response.arrayBuffer();
                    const qrBuffer = Buffer.from(arrayBuffer);
                    const xOffset = (doc.page.width - 100) / 2;
                    doc.image(qrBuffer, xOffset, doc.y, {
                        fit: [100, 100],
                        align: 'center'
                    });
                }
                catch (err) {
                    console.error('Failed to load QR code image for PDF', err);
                }
            }
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.generateHallTicket = generateHallTicket;
//# sourceMappingURL=generatePass.js.map