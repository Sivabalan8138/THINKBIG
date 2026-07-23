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
exports.exportWord = exports.exportPdf = exports.exportExcel = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const exceljs_1 = __importDefault(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const docx_1 = require("docx");
const fetchAttendanceData = () => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield Team_1.default.find({ status: 'approved' }).sort({ createdAt: 1 });
    let serialNumber = 1;
    const records = [];
    teams.forEach(team => {
        if (team.teamLeader) {
            records.push({
                sno: serialNumber++,
                teamId: team.teamId,
                teamName: team.teamName,
                studentName: team.teamLeader.studentName,
                registerNumber: team.teamLeader.registerNumber,
                department: team.teamLeader.department,
            });
        }
        if (team.members) {
            team.members.forEach((member) => {
                records.push({
                    sno: serialNumber++,
                    teamId: team.teamId,
                    teamName: team.teamName,
                    studentName: member.studentName,
                    registerNumber: member.registerNumber,
                    department: member.department,
                });
            });
        }
    });
    return records;
});
const exportExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield fetchAttendanceData();
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet('Attendance');
        sheet.columns = [
            { header: 'S.NO', key: 'sno', width: 10 },
            { header: 'TEAM ID', key: 'teamId', width: 15 },
            { header: 'TEAM NAME', key: 'teamName', width: 25 },
            { header: 'STUDENT NAME', key: 'studentName', width: 25 },
            { header: 'REGISTER NUMBER', key: 'registerNumber', width: 20 },
            { header: 'DEPARTMENT', key: 'department', width: 25 },
            { header: 'STUDENT SIGN', key: 'sign', width: 25 },
        ];
        records.forEach(r => sheet.addRow(r));
        sheet.getRow(1).font = { bold: true };
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.xlsx');
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate Excel', error: error.message });
    }
});
exports.exportExcel = exportExcel;
const exportPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield fetchAttendanceData();
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.pdf');
        doc.pipe(res);
        doc.fontSize(16).text('THINK BIG 2026 - Attendance Report', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(8);
        const startX = 30;
        let startY = doc.y;
        const drawRow = (y, r, isHeader = false) => {
            if (isHeader)
                doc.font('Helvetica-Bold');
            else
                doc.font('Helvetica');
            doc.text(r.sno.toString(), startX, y, { width: 30 });
            doc.text(r.teamId || '', startX + 30, y, { width: 60 });
            doc.text(r.teamName || '', startX + 90, y, { width: 100 });
            doc.text(r.studentName || '', startX + 190, y, { width: 100 });
            doc.text(r.registerNumber || '', startX + 290, y, { width: 80 });
            doc.text(r.department || '', startX + 370, y, { width: 80 });
            doc.text(isHeader ? 'STUDENT SIGN' : '________________', startX + 450, y, { width: 100 });
        };
        drawRow(startY, { sno: 'S.NO', teamId: 'TEAM ID', teamName: 'TEAM NAME', studentName: 'STUDENT NAME', registerNumber: 'REGISTER NO', department: 'DEPARTMENT' }, true);
        startY += 20;
        records.forEach(r => {
            if (startY > 750) {
                doc.addPage();
                startY = 30;
            }
            drawRow(startY, r);
            startY += 20;
        });
        doc.end();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
    }
});
exports.exportPdf = exportPdf;
const exportWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield fetchAttendanceData();
        const table = new docx_1.Table({
            columnWidths: [500, 1000, 2000, 2000, 1500, 1500, 1500],
            rows: [
                new docx_1.TableRow({
                    children: [
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "S.NO", bold: true })] })] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "TEAM ID", bold: true })] })] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "TEAM NAME", bold: true })] })] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "STUDENT NAME", bold: true })] })] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "REGISTER NUMBER", bold: true })] })] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "DEPARTMENT", bold: true })] })] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: "STUDENT SIGN", bold: true })] })] }),
                    ],
                }),
                ...records.map(r => new docx_1.TableRow({
                    children: [
                        new docx_1.TableCell({ children: [new docx_1.Paragraph(r.sno.toString())] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph(r.teamId || "")] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph(r.teamName || "")] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph(r.studentName || "")] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph(r.registerNumber || "")] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph(r.department || "")] }),
                        new docx_1.TableCell({ children: [new docx_1.Paragraph("")] }),
                    ],
                }))
            ],
        });
        const doc = new docx_1.Document({
            sections: [{
                    children: [
                        new docx_1.Paragraph({ text: "THINK BIG 2026 - Attendance Report", heading: "Title" }),
                        table
                    ]
                }]
        });
        const buffer = yield docx_1.Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.docx');
        res.send(buffer);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate Word document', error: error.message });
    }
});
exports.exportWord = exportWord;
//# sourceMappingURL=attendanceController.js.map