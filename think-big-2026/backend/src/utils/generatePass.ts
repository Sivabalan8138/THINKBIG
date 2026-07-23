import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { ITeam } from '../models/Team';
import { uploadToCloudinary } from './cloudinaryHelper';

export const generateQR = async (teamId: string): Promise<string> => {
  const buffer = await QRCode.toBuffer(teamId, {
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  return await uploadToCloudinary(buffer, 'image/png', 'think-big-2026/qrcodes', 'image');
};

export const generateHallTicket = (team: ITeam, qrCodeUrl: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        try {
          const pdfData = Buffer.concat(buffers);
          const url = await uploadToCloudinary(pdfData, 'application/pdf', 'think-big-2026/halltickets', 'raw');
          resolve(url);
        } catch (err) {
          reject(err);
        }
      });

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
          const response = await fetch(qrCodeUrl);
          const arrayBuffer = await response.arrayBuffer();
          const qrBuffer = Buffer.from(arrayBuffer);
          const xOffset = (doc.page.width - 100) / 2;
          doc.image(qrBuffer, xOffset, doc.y, {
            fit: [100, 100],
            align: 'center'
          });
        } catch (err) {
          console.error('Failed to load QR code image for PDF', err);
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
