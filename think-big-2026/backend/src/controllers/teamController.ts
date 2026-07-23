import { Request, Response } from 'express';
import Team from '../models/Team';
import ActivityLog from '../models/ActivityLog';
import { sendRegistrationEmail, sendSubmissionEmail } from '../services/emailService';
import { generateQR, generateHallTicket } from '../utils/generatePass';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import path from 'path';

export const registerTeam = async (req: Request, res: Response) => {
  try {
    const { teamName, projectTitle, domain, teamLeader, members, abstract } = req.body;

    // Validate member count (min 2, max 4 total)
    const totalMembers = 1 + (members?.length || 0);
    if (totalMembers < 2 || totalMembers > 4) {
      return res.status(400).json({ message: 'Team must have between 2 and 4 members.' });
    }

    const newTeam = new Team({
      teamName,
      projectTitle,
      domain,
      teamLeader,
      members,
      abstract,
    });

    const savedTeam = await newTeam.save();

    // Generate QR Pass & Hall Ticket
    const qrPassUrl = await generateQR(savedTeam.teamId);
    const hallTicketUrl = await generateHallTicket(savedTeam, qrPassUrl);

    savedTeam.qrPassUrl = qrPassUrl;
    savedTeam.hallTicketUrl = hallTicketUrl;
    await savedTeam.save();

    // Store Activity Log
    await ActivityLog.create({
      action: 'TEAM_REGISTERED',
      description: `New team registered: ${savedTeam.teamName} (${savedTeam.domain})`,
      teamId: savedTeam.teamId
    });

    // Send Confirmation Email
    const fullQrUrl = qrPassUrl;
    const fullHallTicketUrl = hallTicketUrl;
    await sendRegistrationEmail(teamLeader.email, teamName, savedTeam.teamId, fullQrUrl, fullHallTicketUrl);

    res.status(201).json({ message: 'Team registered successfully', team: savedTeam });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register team', error: error.message });
  }
};

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { abstract } = req.body;

    const team = await Team.findOne({ teamId: teamId as string });
    if (!team) {
      return res.status(404).json({ message: 'Team not found. Please check your Team ID.' });
    }

    if (files['ppt'] && files['ppt'][0]) {
      const p = files['ppt'][0];
      team.files.pptUrl = await uploadToCloudinary(p.buffer, p.mimetype, 'think-big-2026/teams', 'raw');
    }
    if (files['pdf'] && files['pdf'][0]) {
      const p = files['pdf'][0];
      team.files.pdfUrl = await uploadToCloudinary(p.buffer, p.mimetype, 'think-big-2026/teams', 'raw');
    }
    if (abstract) {
      // Save the single text abstract to the problemStatement field
      team.abstract = { 
        ...team.abstract, 
        problemStatement: abstract 
      } as any;
    }

    team.status = 'approved'; // optionally mark as uploaded/approved
    await team.save();

    await sendSubmissionEmail(team.teamLeader.email, team.teamName);

    res.json({ message: 'Files uploaded successfully', team });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to upload files', error: error.message });
  }
};

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete team', error: error.message });
  }
};
