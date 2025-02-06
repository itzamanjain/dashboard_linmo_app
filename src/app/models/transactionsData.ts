import Creator from "./Creator";

export default interface TransactionData {
    transactionId: string;
    amount: string;
    currency: string;
    connectedAccountId: string;
    fromUserId: string;
    toUserId: string;
    isPaid: boolean;
    trainingType: string;
    user?: Creator;
    trainingId: string;
    method: string;
    createdAt: Date;
}