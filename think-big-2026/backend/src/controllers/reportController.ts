import { Request, Response } from 'express';
import Team from '../models/Team';
import Certificate from '../models/Certificate';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { reportType, format } = req.params;
    
    // Fetch Data Based on Report Type
    let data: any[] = [];
    let headers: string[] = [];
    
    if (reportType === 'registration') {
      const teams = await Team.find().sort({ createdAt: -1 });
      headers = ['Team ID', 'Team Name', 'Domain', 'Project Title', 'Leader Name', 'Leader Email'];
      data = teams.map(t => [
        t.teamId, t.teamName, t.domain, t.projectTitle, t.teamLeader.studentName, t.teamLeader.email
      ]);
    } 
    else if (reportType === 'ai-evaluation') {
      const teams = await Team.find().sort({ 'scores.aiScore': -1 });
      headers = ['Team ID', 'Team Name', 'Domain', 'Total AI Score'];
      data = teams.map((t: any) => [
        t.teamId, t.teamName, t.domain, 
        t.scores?.aiScore || 0
      ]);
    }
    else if (reportType === 'judge-evaluation') {
      const teams = await Team.find().sort({ 'scores.judgeScore': -1 });
      headers = ['Team ID', 'Team Name', 'Domain', 'Total Judge Score'];
      data = teams.map((t: any) => [
        t.teamId, t.teamName, t.domain,
        t.scores?.judgeScore || 0
      ]);
    }
    else if (reportType === 'final-ranking') {
      const teams = await Team.find().sort({ 'scores.finalScore': -1 });
      headers = ['Overall Rank', 'Domain Rank', 'Team ID', 'Team Name', 'Domain', 'Final Score'];
      data = teams.map(t => [
        t.rankings?.overallRank || '-',
        t.rankings?.domainRank || '-',
        t.teamId, t.teamName, t.domain,
        t.scores?.finalScore || 0
      ]);
    }
    else if (reportType === 'attendance') {
      const teams = await Team.find().sort({ 'rankings.overallRank': 1 });
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
      const teams = await Team.find({ 'rankings.overallRank': { $lte: 3 } }).sort({ 'rankings.overallRank': 1 });
      headers = ['Rank', 'Award Type', 'Team Name', 'Domain', 'Project Title'];
      data = teams.map(t => [
        t.rankings?.overallRank,
        t.rankings?.overallRank === 1 ? 'Winner' : t.rankings?.overallRank === 2 ? 'Runner-Up 1' : 'Runner-Up 2',
        t.teamName, t.domain, t.projectTitle
      ]);
    }
    else if (reportType === 'certificates') {
      const certs = await Certificate.find().populate('teamId', 'teamName teamId');
      headers = ['Certificate ID', 'Type', 'Team ID', 'Team Name', 'Reg Number'];
      data = certs.map(c => {
        const team = c.teamId as any;
        return [
          c.certificateId, c.certificateType, team?.teamId || '-', team?.teamName || '-', c.memberRegisterNumber
        ];
      });
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    const filename = `${reportType}-report-${Date.now()}`;

    // Export Logic
    if (format === 'excel' || format === 'csv') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');
      worksheet.addRow(headers);
      data.forEach(row => worksheet.addRow(row));

      if (format === 'excel') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
        await workbook.xlsx.write(res);
      } else {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
        await workbook.csv.write(res);
      }
      return res.end();
    } 
    else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
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
        row.forEach((cell: any, i: number) => {
          doc.text(String(cell).substring(0, 30), 30 + (i * colWidth), y, { width: colWidth, align: 'left' });
        });
        y += 15;
      });

      doc.end();
    }
    else if (format === 'word') {
      const tableRows = [
        new TableRow({
          children: headers.map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] }))
        }),
        ...data.map(row => new TableRow({
          children: row.map((cell: any) => new TableCell({ children: [new Paragraph(String(cell))] }))
        }))
      ];

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ text: `THINK BIG 2026 - ${reportType.toUpperCase()} REPORT`, heading: 'Heading1' }),
            new Table({ rows: tableRows })
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.docx`);
      return res.send(buffer);
    } 
    else {
      return res.status(400).json({ message: 'Invalid format requested' });
    }

  } catch (error: any) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};
