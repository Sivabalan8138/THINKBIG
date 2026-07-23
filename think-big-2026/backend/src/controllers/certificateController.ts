import { Request, Response } from 'express';
import Certificate from '../models/Certificate';
import Team from '../models/Team';
import { generateCertificate } from '../services/certificateService';
import { sendCertificateEmail } from '../services/emailService';

export const issueCertificates = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { certificateType } = req.body; // e.g., 'Participation Certificate'

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const generatedCerts = [];

    // Issue for Leader
    const leaderCertId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const leaderCertPath = await generateCertificate({
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
      await sendCertificateEmail(team.teamLeader.email, team.teamName, leaderCertPath);
    }

    const leaderCert = await Certificate.create({
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
      const memberCertPath = await generateCertificate({
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
        await sendCertificateEmail(team.teamLeader.email, team.teamName, memberCertPath);
      }

      const memberCert = await Certificate.create({
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
  } catch (error: any) {
    console.error('Certificate Issue Error:', error);
    res.status(500).json({ message: 'Failed to issue certificates', error: error.message });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const certificateId = req.params.certificateId as string;
    const cert = await Certificate.findOne({ certificateId }).populate('teamId');

    if (!cert) return res.status(404).json({ valid: false, message: 'Invalid Certificate' });

    const team = cert.teamId as any;
    let studentName = 'Unknown';
    if (team.teamLeader.registerNumber === cert.memberRegisterNumber) {
      studentName = team.teamLeader.studentName;
    } else if (team.members) {
      const member = team.members.find((m: any) => m.registerNumber === cert.memberRegisterNumber);
      if (member) studentName = member.studentName;
    }

    res.json({
      valid: true,
      studentName,
      teamName: team.teamName,
      projectTitle: team.projectTitle,
      eventName: 'THINK BIG 2026',
      certificateType: cert.certificateType
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};
