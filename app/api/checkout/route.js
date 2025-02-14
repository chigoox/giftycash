import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
    const { amount } = await req.json();
  try {
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'GiftyCash Payment' },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      ui_mode: 'embedded',
      return_url:  `https://booxlit.com/`,
    });
console.log(session)
    return NextResponse.json({ url: session.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}