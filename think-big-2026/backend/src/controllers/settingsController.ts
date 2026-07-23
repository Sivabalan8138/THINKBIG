import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { 
      isRegistrationOpen, 
      isCandidateIdOpen,
      certNameX, certNameY,
      certDeptX, certDeptY,
      certQrX, certQrY,
      certNameFontSize
    } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    if (isRegistrationOpen !== undefined) settings.isRegistrationOpen = isRegistrationOpen;
    if (isCandidateIdOpen !== undefined) settings.isCandidateIdOpen = isCandidateIdOpen;
    if (certNameX !== undefined) settings.certNameX = certNameX;
    if (certNameY !== undefined) settings.certNameY = certNameY;
    if (certDeptX !== undefined) settings.certDeptX = certDeptX;
    if (certDeptY !== undefined) settings.certDeptY = certDeptY;
    if (certQrX !== undefined) settings.certQrX = certQrX;
    if (certQrY !== undefined) settings.certQrY = certQrY;
    if (certNameFontSize !== undefined) settings.certNameFontSize = certNameFontSize;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadSampleCertificate = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Since Cloudinary isn't configured in .env, we'll simulate an upload URL or use a local path if stored locally.
    // Assuming multer saved it to a local folder like uploads/
    const fileUrl = `/uploads/${req.file.filename}`;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    settings.sampleCertificateUrl = fileUrl;
    await settings.save();
    
    res.json({ message: 'Upload successful', url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error uploading file' });
  }
};
