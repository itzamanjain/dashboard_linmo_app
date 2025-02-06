import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export async function getStripeAccount(accountId: string) {
    try {
        const account = await stripe.accounts.retrieve(accountId);
        return account;
    } catch (error) {
        console.error("Error retrieving Stripe account:", error);
        throw new Error("Unable to retrieve Stripe account information.");
    }
}

export default stripe;