

import nodemailer from 'nodemailer';
import { IEmailService } from '../interfaces/emailServiceInterface';
import { config } from '../config/env';

export class EmailServiceImpl implements IEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: config.emailUser,
                pass: config.emailPass,
            },
        });
    }

    async sendOTP(to: string, text: string): Promise<void> {
        const mailOptions = {
            from: config.emailUser,
            to,
            subject: 'Your OTP Code',
            text,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
        const mailOptions = {
            from: config.emailUser,
            to,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
        };
        await this.transporter.sendMail(mailOptions);
    }
}