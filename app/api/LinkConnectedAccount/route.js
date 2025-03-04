import { addToDoc } from '@/app/myCodes/Database';
import { isDev } from '@/app/myCodes/Util';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const { email, uid, } = await request.json();

    const account =  await stripe.accounts.create({
      country: 'US',
    })

    
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: isDev()? 'https://test.com'  : `${request.headers.get('origin')}/`.replace('http', 'https'),
      refresh_url: isDev()? 'https://test.com'  : `${request.headers.get('origin')}/`.replace('http', 'https'),
      type: 'account_onboarding',
    });
    await addToDoc('users', email, {
      stripeAccountID: account.id,
    });

console.log(accountLink)
    return NextResponse.json(accountLink.url);
  } catch (error) {
    console.error(
      'An error occurred when calling the Stripe API to create an account link:',
      error
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}