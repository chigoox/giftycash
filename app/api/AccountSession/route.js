import { isDev } from "@/app/myCodes/Util";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
   
    let data = await request.json();
    let {
   
        stripeAccountID = '',
    } = data;
    const accountSession = await stripe.accountSessions.create({
        account: stripeAccountID,
        components: {
          payments: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
            },
          },
          balances: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
            },
          },
          notification_banner: {
            enabled: true,
            features: {
              external_account_collection: true,
            },
          },
          payouts: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
              external_account_collection: true,
            },
          },

         
        },
      })

   
        return NextResponse.json({ client_secret: accountSession.client_secret})
    
   
}