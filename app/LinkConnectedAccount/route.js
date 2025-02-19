/* import { addToDoc } from '@/app/myCodes/Database';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const { userName, email, uid, stripeAccountID } = await request.json();

    const account = stripeAccountID ? {id: stripeAccountID} : await stripe.accounts.create({
      country: 'US',
      type: 'express',
      idempotencyKey: stripeAccountID,
    })

    
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: `${request.headers.get('origin')}/${userName}/Admin`,
      refresh_url: `${request.headers.get('origin')}/${userName}/Admin`,
      type: 'account_onboarding',
    });
    
    //const loginLink = await stripe.accounts.createLoginLink(account.id);
    await addToDoc('Owners', uid, {
      stripeAccountID: account.id,
      //stripeDashboard:loginLink.url
    });


    return NextResponse.json(accountLink.url);
  } catch (error) {
    console.error(
      'An error occurred when calling the Stripe API to create an account link:',
      error
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} */