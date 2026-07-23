import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { ITeam } from '../models/Team';

const ensureUploadsDir = () => {
  const dir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const generateQR = async (teamId: string): Promise<string> => {
  const uploadsDir = ensureUploadsDir();
  const filename = `${teamId}-qr.png`;
  const filepath = path.join(uploadsDir, filename);
  await QRCode.toFile(filepath, teamId, {
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  return `/uploads/${filename}`;
};

export const generateHallTicket = (team: ITeam, qrCodeUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = ensureUploadsDir();
      const filename = `${team.teamId}-hallticket.pdf`;
      const filepath = path.join(uploadsDir, filename);
      const qrCodePath = path.join(__dirname, '../../public', qrCodeUrl);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

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
      if (fs.existsSync(qrCodePath)) {
        // Calculate center position for 100x100 image
        const xOffset = (doc.page.width - 100) / 2;
        doc.image(qrCodePath, xOffset, doc.y, {
          fit: [100, 100],
          align: 'center'
        });
      }

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/${filename}`);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
