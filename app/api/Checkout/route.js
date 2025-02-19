import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
    console.log('test')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let data = await request.json();
   const { amount, name, email, phone, stripeAccountID } = data;

        const session = await stripe.checkout.sessions.create({
           // redirect_on_completion: 'never',
            ui_mode: 'embedded',
            return_url: 'https://giftycash.vercel.app',
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Gifty Cash"
                        },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }
            ],
            payment_intent_data: {
                on_behalf_of: stripeAccountID,
                transfer_data: {
                  destination: stripeAccountID,
                },
              },
            mode: 'payment',
        /*     metadata: {
                customerID: customer,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                
            }, */
    
        })
        console.log(session.client_secret)
        return NextResponse.json(({ clientSecret: session.client_secret }))
        
}