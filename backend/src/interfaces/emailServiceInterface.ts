
export interface IEmailService {
    sendOTP(email: string, otp: string): Promise<void>;
    sendPasswordReset(email: string, url: string): Promise<void>;
}