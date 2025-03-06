import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {

    let data = await request.json();
    const { amount, name, email, phone, stripeAccountID } = data;


    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const balance = await stripe.balance.retrieve();
   
   
    if (balance.instant_available[0].amount > 50) {
        const payout = await stripe.payouts.create({
            amount: 100,
            currency: 'usd',
            method: 'instant',
            destination: '{{CARD_ID}}',
        });
    }else{
        console.log('Insufficient funds')
    }





        
        return NextResponse.json(({ clientSecret: session.client_secret }))
        
}