

// // backend/src/services/paymentServices.ts


import { Types } from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env';
import { IPaymentService } from '../interfaces/paymentServiceInterface';
import AppError from '../utils/appError';

export class PaymentService implements IPaymentService {
    private razorpay: Razorpay;

    constructor() {
        if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
            console.error('Razorpay API keys are not set in environment variables.');
            throw new AppError('Razorpay API keys are missing.', 500);
        }
        this.razorpay = new Razorpay({
            key_id: config.RAZORPAY_KEY_ID,
            key_secret: config.RAZORPAY_KEY_SECRET,
        });
    }
  
async createOrder(amount: number, currency: string, enrollmentId: string): Promise<any> {
    if (!Number.isInteger(amount) || amount < 100 || amount > 10000000) {
        console.error(`[createOrder] Invalid amount received: ${amount} paise for enrollment ${enrollmentId}. Must be an integer between 100 and 10000000 paise.`);
        throw new AppError('Invalid amount: Amount must be between 100 and 10000000 paise and an integer.', 400);
    }

    console.log(`[createOrder] Creating order for enrollment ${enrollmentId} with amount ${amount} paise (${amount / 100} INR)`);

    const options = {
        amount,
        currency,
        receipt: `receipt_${enrollmentId}`,
        payment_capture: 1,
    };

    try {
        const order = await this.razorpay.orders.create(options);
        console.log(`[createOrder] Order created successfully: ${order.id}`);
        return order;
    } catch (error: any) {
        console.error('[createOrder] Full Razorpay error:', {
            rawError: error,
            message: error.message,
            status: error.status,
            code: error.code,
            description: error.description,
            source: error.source,
            step: error.step,
            reason: error.reason,
            metadata: error.metadata,
        });
        let errorMessage = 'Unknown error from Razorpay';
        if (error.code === 'BAD_REQUEST_ERROR') {
            errorMessage = error.description || 'Invalid request parameters';
        } else if (error.status === 401) {
            errorMessage = 'Authentication failed. Check Razorpay API keys.';
        }
        throw new AppError(`Failed to create payment order: ${errorMessage}`, 500);
    }
}
    async verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
        try {
            const hmac = crypto.createHmac('sha256', config.RAZORPAY_KEY_SECRET);
            hmac.update(`${orderId}|${paymentId}`);
            const generatedSignature = hmac.digest('hex');

            const isValid = generatedSignature === signature;
            console.log(`[verifyPaymentSignature] Signature verification ${isValid ? 'successful' : 'failed'} for order ${orderId}`);
            return isValid;
        } catch (error: any) {
            console.error('[verifyPaymentSignature] Error verifying signature:', error.message);
            throw new AppError('Failed to verify payment signature: ' + error.message, 400);
        }
    }

    async generateInvoice(
        orderId: string,
        paymentId: string,
        userId: Types.ObjectId,
        courseId: Types.ObjectId,
        amount: number,
        currency: string
    ): Promise<any> {
        try {
            const invoice = {
                invoiceId: `INV_${orderId}_${Date.now()}`,
                orderId,
                paymentId,
                userId: userId.toHexString(),
                courseId: courseId.toHexString(),
                amount: amount / 100, 
                currency,
                status: 'generated',
                generatedAt: new Date(),
                details: {
                    description: `Payment for course enrollment (Course ID: ${courseId.toHexString()})`,
                    userId: userId.toHexString(),
                    tax: (amount / 100) * 0.18, // Example: 18% GST
                    totalAmount: (amount / 100) * 1.18, // Including tax
                },
            };

            console.log(`[generateInvoice] Invoice generated for order ${orderId}:`, invoice.invoiceId);
            return invoice;
        } catch (error: any) {
            console.error('[generateInvoice] Error generating invoice:', error.message);
            throw new AppError('Failed to generate invoice: ' + error.message, 500);
        }
    }
}
