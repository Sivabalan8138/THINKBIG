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
exports.sendCertificateEmail = exports.sendResultEmail = exports.sendSubmissionEmail = exports.sendRegistrationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendRegistrationEmail = (email, teamName, teamId, qrPassUrl, hallTicketUrl) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.EMAIL_USER) {
        console.warn('EMAIL_USER not set. Skipping email send.');
        return;
    }
    try {
        const mailOptions = {
            from: `"THINK BIG 2026" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Registration Successful - THINK BIG 2026',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to THINK BIG 2026, Team ${teamName}!</h2>
          <p>Your registration is complete and your team is ready to go.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your Team ID:</strong> <span style="font-size: 1.2em; color: #1d4ed8;">${teamId}</span></p>
          </div>
          <p>Please find your essential access passes below. Keep these safe!</p>
          <ul>
            <li><a href="${qrPassUrl}" style="color: #2563eb; font-weight: bold;">Download QR Pass</a></li>
            <li><a href="${hallTicketUrl}" style="color: #2563eb; font-weight: bold;">Download Hall Ticket</a></li>
          </ul>
          <br/>
          <p>We look forward to seeing your innovation!</p>
        </div>
      `
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Registration email sent to ${email}`);
    }
    catch (err) {
        console.error(`Failed to send registration email to ${email}`, err);
    }
});
exports.sendRegistrationEmail = sendRegistrationEmail;
const sendSubmissionEmail = (email, teamName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.EMAIL_USER)
        return;
    try {
        const mailOptions = {
            from: `"THINK BIG 2026" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Submission Received - THINK BIG 2026',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Hello, Team ${teamName}</h2>
          <p>Your PPT and Project Abstract have been successfully uploaded to the THINK BIG 2026 portal.</p>
          <p>Your submission is now queued for review by our automated AI Evaluation Engine.</p>
          <br/>
          <p>Thank you and best of luck!</p>
        </div>
      `
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Submission email sent to ${email}`);
    }
    catch (err) {
        console.error(`Failed to send submission email to ${email}`, err);
    }
});
exports.sendSubmissionEmail = sendSubmissionEmail;
const sendResultEmail = (email, teamName, rank, domainRank, score) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.EMAIL_USER)
        return;
    try {
        const mailOptions = {
            from: `"THINK BIG 2026" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Final Results Published - THINK BIG 2026',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="color: #d97706;">Congratulations, Team ${teamName}!</h2>
          <p>The THINK BIG 2026 final evaluations are complete.</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; display: inline-block; text-align: left;">
            <p style="margin: 5px 0;"><strong>Final Score:</strong> <span style="font-size: 1.2em; color: #b45309;">${score.toFixed(2)} / 100</span></p>
            <p style="margin: 5px 0;"><strong>Overall Rank:</strong> <span style="font-size: 1.2em; color: #b45309;">#${rank}</span></p>
            <p style="margin: 5px 0;"><strong>Domain Rank:</strong> <span style="font-size: 1.2em; color: #b45309;">#${domainRank}</span></p>
          </div>
          
          <p>Check the public leaderboard for the complete standings!</p>
        </div>
      `
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Result email sent to ${email}`);
    }
    catch (err) {
        console.error(`Failed to send result email to ${email}`, err);
    }
});
exports.sendResultEmail = sendResultEmail;
const sendCertificateEmail = (email, teamName, certificatePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.EMAIL_USER)
        return;
    try {
        const mailOptions = {
            from: `"THINK BIG 2026" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Participation Certificate - THINK BIG 2026',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Hello, Team ${teamName}</h2>
          <p>Thank you for participating in THINK BIG 2026!</p>
          <p>Please find your official certificate attached to this email.</p>
          <br/>
          <p>We hope to see you again next year!</p>
        </div>
      `,
            attachments: [
                {
                    filename: `${teamName}_Certificate.pdf`,
                    path: certificatePath,
                    contentType: 'application/pdf'
                }
            ]
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Certificate email sent to ${email}`);
    }
    catch (err) {
        console.error(`Failed to send certificate email to ${email}`, err);
    }
});
exports.sendCertificateEmail = sendCertificateEmail;
//# sourceMappingURL=emailService.js.map