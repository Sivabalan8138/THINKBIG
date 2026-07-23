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
exports.generateReport = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const Certificate_1 = __importDefault(require("../models/Certificate"));
const exceljs_1 = __importDefault(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const docx_1 = require("docx");
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reportType, format } = req.params;
        // Fetch Data Based on Report Type
        let data = [];
        let headers = [];
        if (reportType === 'registration') {
            const teams = yield Team_1.default.find().sort({ createdAt: -1 });
            headers = ['Team ID', 'Team Name', 'Domain', 'Project Title', 'Leader Name', 'Leader Email'];
            data = teams.map(t => [
                t.teamId, t.teamName, t.domain, t.projectTitle, t.teamLeader.studentName, t.teamLeader.email
            ]);
        }
        else if (reportType === 'ai-evaluation') {
            const teams = yield Team_1.default.find().sort({ 'scores.aiScore': -1 });
            headers = ['Team ID', 'Team Name', 'Domain', 'Total AI Score'];
            data = teams.map((t) => { var _a; return [
                t.teamId, t.teamName, t.domain,
                ((_a = t.scores) === null || _a === void 0 ? void 0 : _a.aiScore) || 0
            ]; });
        }
        else if (reportType === 'judge-evaluation') {
            const teams = yield Team_1.default.find().sort({ 'scores.judgeScore': -1 });
            headers = ['Team ID', 'Team Name', 'Domain', 'Total Judge Score'];
            data = teams.map((t) => { var _a; return [
                t.teamId, t.teamName, t.domain,
                ((_a = t.scores) === null || _a === void 0 ? void 0 : _a.judgeScore) || 0
            ]; });
        }
        else if (reportType === 'final-ranking') {
            const teams = yield Team_1.default.find().sort({ 'scores.finalScore': -1 });
            headers = ['Overall Rank', 'Domain Rank', 'Team ID', 'Team Name', 'Domain', 'Final Score'];
            data = teams.map(t => { var _a, _b, _c; return [
                ((_a = t.rankings) === null || _a === void 0 ? void 0 : _a.overallRank) || '-',
                ((_b = t.rankings) === null || _b === void 0 ? void 0 : _b.domainRank) || '-',
                t.teamId, t.teamName, t.domain,
                ((_c = t.scores) === null || _c === void 0 ? void 0 : _c.finalScore) || 0
            ]; });
        }
        else if (reportType === 'attendance') {
            const teams = yield Team_1.default.find().sort({ 'rankings.overallRank': 1 });
            headers = ['S.NO', 'TEAM ID', 'TEAM NAME', 'STUDENT NAME', 'REGISTER NUMBER', 'DEPARTMENT', 'STUDENT SIGN'];
            let sno = 1;
            for (const t of teams) {
                data.push([sno++, t.teamId, t.teamName, t.teamLeader.studentName, t.teamLeader.registerNumber, t.teamLeader.department, '']);
                for (const m of t.members) {
                    data.push([sno++, t.teamId, t.teamName, m.studentName, m.registerNumber, m.department, '']);
                }
            }
        }
        else if (reportType === 'winners') {
            const teams = yield Team_1.default.find({ 'rankings.overallRank': { $lte: 3 } }).sort({ 'rankings.overallRank': 1 });
            headers = ['Rank', 'Award Type', 'Team Name', 'Domain', 'Project Title'];
            data = teams.map(t => { var _a, _b, _c; return [
                (_a = t.rankings) === null || _a === void 0 ? void 0 : _a.overallRank,
                ((_b = t.rankings) === null || _b === void 0 ? void 0 : _b.overallRank) === 1 ? 'Winner' : ((_c = t.rankings) === null || _c === void 0 ? void 0 : _c.overallRank) === 2 ? 'Runner-Up 1' : 'Runner-Up 2',
                t.teamName, t.domain, t.projectTitle
            ]; });
        }
        else if (reportType === 'certificates') {
            const certs = yield Certificate_1.default.find().populate('teamId', 'teamName teamId');
            headers = ['Certificate ID', 'Type', 'Team ID', 'Team Name', 'Reg Number'];
            data = certs.map(c => {
                const team = c.teamId;
                return [
                    c.certificateId, c.certificateType, (team === null || team === void 0 ? void 0 : team.teamId) || '-', (team === null || team === void 0 ? void 0 : team.teamName) || '-', c.memberRegisterNumber
                ];
            });
        }
        else {
            return res.status(400).json({ message: 'Invalid report type' });
        }
        const filename = `${reportType}-report-${Date.now()}`;
        // Export Logic
        if (format === 'excel' || format === 'csv') {
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Report');
            worksheet.addRow(headers);
            data.forEach(row => worksheet.addRow(row));
            if (format === 'excel') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
                yield workbook.xlsx.write(res);
            }
            else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
                yield workbook.csv.write(res);
            }
            return res.end();
        }
        else if (format === 'pdf') {
            const doc = new pdfkit_1.default({ margin: 30, size: 'A4', layout: 'landscape' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}.pdf`);
            doc.pipe(res);
            doc.fontSize(16).text(`THINK BIG 2026 - ${reportType.toUpperCase()} REPORT`, { align: 'center' });
            doc.moveDown();
            const colWidth = (doc.page.width - 60) / headers.length;
            let y = doc.y;
            // Draw Headers
            doc.fontSize(10).font('Helvetica-Bold');
            headers.forEach((h, i) => {
                doc.text(h, 30 + (i * colWidth), y, { width: colWidth, align: 'left' });
            });
            y += 20;
            // Draw Data
            doc.font('Helvetica');
            data.forEach(row => {
                if (y > doc.page.height - 50) {
                    doc.addPage();
                    y = 30;
                }
                row.forEach((cell, i) => {
                    doc.text(String(cell).substring(0, 30), 30 + (i * colWidth), y, { width: colWidth, align: 'left' });
                });
                y += 15;
            });
            doc.end();
        }
        else if (format === 'word') {
            const tableRows = [
                new docx_1.TableRow({
                    children: headers.map(h => new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: h, bold: true })] })] }))
                }),
                ...data.map(row => new docx_1.TableRow({
                    children: row.map((cell) => new docx_1.TableCell({ children: [new docx_1.Paragraph(String(cell))] }))
                }))
            ];
            const doc = new docx_1.Document({
                sections: [{
                        properties: {},
                        children: [
                            new docx_1.Paragraph({ text: `THINK BIG 2026 - ${reportType.toUpperCase()} REPORT`, heading: 'Heading1' }),
                            new docx_1.Table({ rows: tableRows })
                        ]
                    }]
            });
            const buffer = yield docx_1.Packer.toBuffer(doc);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}.docx`);
            return res.send(buffer);
        }
        else {
            return res.status(400).json({ message: 'Invalid format requested' });
        }
    }
    catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
});
exports.generateReport = generateReport;
//# sourceMappingURL=reportController.js.map