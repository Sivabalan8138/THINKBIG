import PDFDocument from 'pdfkit';
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import Settings from '../models/Settings';

export const generateCertificate = async (data: {
  teamName: string;
  studentName: string;
  registerNumber: string;
  projectTitle: string;
  eventName: string;
  certificateType: string;
  certificateId: string;
  department: string;
  year?: string;
}): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const certPath = path.join(__dirname, `../../public/certificates/${data.certificateId}.pdf`);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(certPath), { recursive: true });

      const stream = fs.createWriteStream(certPath);
      doc.pipe(stream);

      const settings = await Settings.findOne();
      let hasTemplate = false;
      if (settings && settings.sampleCertificateUrl) {
        const templatePath = path.join(__dirname, '../../public', settings.sampleCertificateUrl);
        if (fs.existsSync(templatePath)) {
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
          if (y.includes('1') || y === 'i' || y === 'first') romanYear = 'I';
          else if (y.includes('2') || y === 'ii' || y === 'second') romanYear = 'II';
          else if (y.includes('3') || y === 'iii' || y === 'third') romanYear = 'III';
          else if (y.includes('4') || y === 'iv' || y === 'fourth') romanYear = 'IV';
          
          formattedDept = `${romanYear} / ${formattedDept}`;
        }

        // Register custom fonts
        const cursivePath = path.join(__dirname, '../../public/fonts/GreatVibes-Regular.ttf');
        const robotoPath = path.join(__dirname, '../../public/fonts/Roboto-Bold.ttf');
        
        let nameFont = 'Helvetica-Bold';
        let nameSize = settings?.certNameFontSize ?? 48;
        
        if (fs.existsSync(robotoPath)) {
          doc.registerFont('Roboto', robotoPath);
          nameFont = 'Roboto';
        } else if (fs.existsSync(cursivePath)) {
          doc.registerFont('Cursive', cursivePath);
          nameFont = 'Cursive';
        }

        // Name (Title case, maroon color)
        const nameX = settings?.certNameX || 0;
        const nameY = settings?.certNameY || 325;
        
        doc.font(nameFont).fontSize(nameSize).fillColor('#8a1b24');
        const safeStudentName = data.studentName || 'UNKNOWN NAME';
        if (nameX === 0) {
            // Center horizontally across the entire page
            doc.text(safeStudentName, 0, nameY, { align: 'center', width: doc.page.width });
        } else {
            // If custom X is provided, align relative to that X, falling back to PDFKit's default width logic
            doc.text(safeStudentName, nameX, nameY, { align: 'center', width: doc.page.width - nameX - 50 });
        }
        
        // Department (Bold, maroon color)
        const deptX = settings?.certDeptX ?? 310;
        const deptY = settings?.certDeptY ?? 386;
        
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#000000');
        // Prevent word wrapping for long department names by measuring width and centering manually
        // The original logic centered within a 120px box starting at deptX. The center of that box is deptX + 60.
        const deptCenterX = deptX + 60;
        const deptTextWidth = doc.widthOfString(formattedDept);
        doc.text(formattedDept, deptCenterX - (deptTextWidth / 2), deptY);

        // QR Code
        const verifyUrl = `https://thinkbig2026.com/verify?id=${data.certificateId}`;
        const qrImageBuffer = await qrcode.toBuffer(verifyUrl);
        doc.image(qrImageBuffer, settings?.certQrX ?? 46, settings?.certQrY ?? 461, { fit: [86, 86] });
        
      } else {
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
        const qrImageBuffer = await qrcode.toBuffer(verifyUrl);
        
        doc.image(qrImageBuffer, 50, doc.page.height - 150, { fit: [100, 100] });

        doc.fontSize(10).fillColor('#777777')
           .text(`Certificate ID: ${data.certificateId}`, 50, doc.page.height - 40);
      }

      // End
      doc.end();

      stream.on('finish', () => resolve(certPath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
