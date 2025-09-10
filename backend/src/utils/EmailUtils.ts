import { DependencyContainer } from './dependecy-container';
import { IEmailService } from '../interfaces/emailServiceInterface';

export const sendEmail = async (email: string, subject: string, text: string): Promise<void> => {
  const emailService = DependencyContainer.getInstance().getEmailService();
  await emailService.sendOTP(email, text);
};