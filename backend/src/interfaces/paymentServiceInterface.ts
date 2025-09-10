

// // backend/src/interfaces/paymentServiceInterface.ts

// export interface IPaymentService {
//     createOrder(amount: number, currency: string, receiptId: string): Promise<any>; // 'any' for the Razorpay order object
//     // --- NEW METHOD REQUIRED BY userCourseController.ts ---
//     verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
//     // You might also want methods for fetching payments, refunds, etc.
//     // getPaymentDetails(paymentId: string): Promise<any>;
//     // refundPayment(paymentId: string, amount: number): Promise<any>;
// }


import { Types } from 'mongoose';

export interface IPaymentService {
    createOrder(amount: number, currency: string, receiptId: string): Promise<any>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean>;
    generateInvoice(
        orderId: string,
        paymentId: string,
        userId: Types.ObjectId,
        courseId: Types.ObjectId,
        amount: number,
        currency: string
    ): Promise<any>;
    // getPaymentDetails(paymentId: string): Promise<any>;
    // refundPayment(paymentId: string, amount: number): Promise<any>;
}
