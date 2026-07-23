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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // or use SMTP settings for Resend / other providers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = (to, subject, html, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: `"THINK BIG 2026" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
        console.log(`Email sent: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=mailer.js.map