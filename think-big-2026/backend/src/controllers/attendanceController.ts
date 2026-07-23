import { Request, Response } from 'express';
import Team from '../models/Team';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';

const fetchAttendanceData = async () => {
  const teams = await Team.find({ status: 'approved' }).sort({ createdAt: 1 });
  let serialNumber = 1;
  const records: any[] = [];
  
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
      team.members.forEach((member: any) => {
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
};

export const exportExcel = async (req: Request, res: Response) => {
  try {
    const records = await fetchAttendanceData();
    
    const workbook = new ExcelJS.Workbook();
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
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to generate Excel', error: error.message });
  }
};

export const exportPdf = async (req: Request, res: Response) => {
  try {
    const records = await fetchAttendanceData();
    
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.pdf');
    doc.pipe(res);

    doc.fontSize(16).text('THINK BIG 2026 - Attendance Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(8);
    const startX = 30;
    let startY = doc.y;

    const drawRow = (y: number, r: any, isHeader: boolean = false) => {
      if (isHeader) doc.font('Helvetica-Bold');
      else doc.font('Helvetica');

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
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
  }
};

export const exportWord = async (req: Request, res: Response) => {
  try {
    const records = await fetchAttendanceData();

    const table = new Table({
      columnWidths: [500, 1000, 2000, 2000, 1500, 1500, 1500],
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "S.NO", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TEAM ID", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TEAM NAME", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "STUDENT NAME", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "REGISTER NUMBER", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "DEPARTMENT", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "STUDENT SIGN", bold: true })] })] }),
          ],
        }),
        ...records.map(r => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(r.sno.toString())] }),
            new TableCell({ children: [new Paragraph(r.teamId || "")] }),
            new TableCell({ children: [new Paragraph(r.teamName || "")] }),
            new TableCell({ children: [new Paragraph(r.studentName || "")] }),
            new TableCell({ children: [new Paragraph(r.registerNumber || "")] }),
            new TableCell({ children: [new Paragraph(r.department || "")] }),
            new TableCell({ children: [new Paragraph("")] }), 
          ],
        }))
      ],
    });

    const doc = new Document({
      sections: [{ 
        children: [
          new Paragraph({ text: "THINK BIG 2026 - Attendance Report", heading: "Title" }), 
          table
        ] 
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.docx');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to generate Word document', error: error.message });
  }
};
