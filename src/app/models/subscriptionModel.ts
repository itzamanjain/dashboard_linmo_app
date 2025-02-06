export default interface SubscriptionModel {
    subscriptionId?: string | undefined;
    subscriptionName: string;
    subscriptionDescription: string;
    credits: number;
    userId: string | undefined;
    isDeleted: boolean;
    clubId: string | null;
    intervalCount: number;
    price: number | undefined;
    createdAt: string;
    isBookingUnlimited: boolean;
    isValidityUnlimited: boolean;
    intervalType: string;
    currency: string;
    stripeProductId: string;
    stripePriceId: string;
}