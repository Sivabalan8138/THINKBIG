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
exports.generateCertificate = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Settings_1 = __importDefault(require("../models/Settings"));
const generateCertificate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const doc = new pdfkit_1.default({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });
            const certPath = path_1.default.join(__dirname, `../../public/certificates/${data.certificateId}.pdf`);
            // Ensure directory exists
            fs_1.default.mkdirSync(path_1.default.dirname(certPath), { recursive: true });
            const stream = fs_1.default.createWriteStream(certPath);
            doc.pipe(stream);
            const settings = yield Settings_1.default.findOne();
            let hasTemplate = false;
            if (settings && settings.sampleCertificateUrl) {
                const templatePath = path_1.default.join(__dirname, '../../public', settings.sampleCertificateUrl);
                if (fs_1.default.existsSync(templatePath)) {
                    doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });
                    hasTemplate = true;
                }
            }
            if (!hasTemplate) {
                // Fallback Certificate Background / Styling
                doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#3b82f6');
                doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#0ea5e9');
                // Title (Only draw default title if no template, templates usually have their own titles)
                doc.y = 100;
                doc.font('Helvetica-Bold').fontSize(35).fillColor('#020817')
                    .text('CERTIFICATE OF APPRECIATION', { align: 'center' });
                doc.moveDown(1);
                doc.fontSize(20).fillColor('#333333')
                    .text(data.certificateType.toUpperCase(), { align: 'center' });
                doc.moveDown(2);
                doc.fontSize(16).fillColor('#555555')
                    .text('This is proudly presented to', { align: 'center' });
            }
            if (hasTemplate) {
                // Format Year and Department
                let formattedDept = (data.department || 'UNKNOWN DEPT').toUpperCase();
                if (data.year) {
                    let romanYear = data.year;
                    const y = data.year.toString().toLowerCase();
                    if (y.includes('1') || y === 'i' || y === 'first')
                        romanYear = 'I';
                    else if (y.includes('2') || y === 'ii' || y === 'second')
                        romanYear = 'II';
                    else if (y.includes('3') || y === 'iii' || y === 'third')
                        romanYear = 'III';
                    else if (y.includes('4') || y === 'iv' || y === 'fourth')
                        romanYear = 'IV';
                    formattedDept = `${romanYear} / ${formattedDept}`;
                }
                // Register custom fonts
                const cursivePath = path_1.default.join(__dirname, '../../public/fonts/GreatVibes-Regular.ttf');
                const robotoPath = path_1.default.join(__dirname, '../../public/fonts/Roboto-Bold.ttf');
                let nameFont = 'Helvetica-Bold';
                let nameSize = (_a = settings === null || settings === void 0 ? void 0 : settings.certNameFontSize) !== null && _a !== void 0 ? _a : 48;
                if (fs_1.default.existsSync(robotoPath)) {
                    doc.registerFont('Roboto', robotoPath);
                    nameFont = 'Roboto';
                }
                else if (fs_1.default.existsSync(cursivePath)) {
                    doc.registerFont('Cursive', cursivePath);
                    nameFont = 'Cursive';
                }
                // Name (Title case, maroon color)
                const nameX = (settings === null || settings === void 0 ? void 0 : settings.certNameX) || 0;
                const nameY = (settings === null || settings === void 0 ? void 0 : settings.certNameY) || 325;
                doc.font(nameFont).fontSize(nameSize).fillColor('#8a1b24');
                const safeStudentName = data.studentName || 'UNKNOWN NAME';
                if (nameX === 0) {
                    // Center horizontally across the entire page
                    doc.text(safeStudentName, 0, nameY, { align: 'center', width: doc.page.width });
                }
                else {
                    // If custom X is provided, align relative to that X, falling back to PDFKit's default width logic
                    doc.text(safeStudentName, nameX, nameY, { align: 'center', width: doc.page.width - nameX - 50 });
                }
                // Department (Bold, maroon color)
                const deptX = (_b = settings === null || settings === void 0 ? void 0 : settings.certDeptX) !== null && _b !== void 0 ? _b : 310;
                const deptY = (_c = settings === null || settings === void 0 ? void 0 : settings.certDeptY) !== null && _c !== void 0 ? _c : 386;
                doc.font('Helvetica-Bold').fontSize(14).fillColor('#000000');
                // Prevent word wrapping for long department names by measuring width and centering manually
                // The original logic centered within a 120px box starting at deptX. The center of that box is deptX + 60.
                const deptCenterX = deptX + 60;
                const deptTextWidth = doc.widthOfString(formattedDept);
                doc.text(formattedDept, deptCenterX - (deptTextWidth / 2), deptY);
                // QR Code
                const verifyUrl = `https://thinkbig2026.com/verify?id=${data.certificateId}`;
                const qrImageBuffer = yield qrcode_1.default.toBuffer(verifyUrl);
                doc.image(qrImageBuffer, (_d = settings === null || settings === void 0 ? void 0 : settings.certQrX) !== null && _d !== void 0 ? _d : 46, (_e = settings === null || settings === void 0 ? void 0 : settings.certQrY) !== null && _e !== void 0 ? _e : 461, { fit: [86, 86] });
            }
            else {
                // Adjust starting Y depending on whether template exists (assuming template has blank space starting lower down)
                const startY = doc.y + 20;
                // Student Name
                const safeStudentName = data.studentName || 'UNKNOWN NAME';
                doc.font('Helvetica-Bold').fontSize(30).fillColor('#3b82f6')
                    .text(safeStudentName, 50, startY, { align: 'center', width: doc.page.width - 100 });
                doc.moveDown(0.5);
                doc.font('Helvetica').fontSize(14).fillColor('#111827')
                    .text(`(Reg. No: ${data.registerNumber}) from Team ${data.teamName}`, { align: 'center' });
                doc.moveDown(1.5);
                doc.fontSize(16).fillColor('#111827')
                    .text(`For presenting the project titled "${data.projectTitle}"`, { align: 'center' });
                doc.moveDown(0.5);
                doc.fontSize(14).fillColor('#111827')
                    .text(`at ${data.eventName}, Department of EEE, VSB Engineering College.`, { align: 'center' });
                // Generate QR Code
                const verifyUrl = `https://thinkbig2026.com/verify?id=${data.certificateId}`;
                const qrImageBuffer = yield qrcode_1.default.toBuffer(verifyUrl);
                doc.image(qrImageBuffer, 50, doc.page.height - 150, { fit: [100, 100] });
                doc.fontSize(10).fillColor('#777777')
                    .text(`Certificate ID: ${data.certificateId}`, 50, doc.page.height - 40);
            }
            // End
            doc.end();
            stream.on('finish', () => resolve(certPath));
            stream.on('error', (err) => reject(err));
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.generateCertificate = generateCertificate;
//# sourceMappingURL=certificateService.js.map