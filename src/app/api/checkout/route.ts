// app/api/stripe/create-checkout-session/route.js
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { imageUrl } from "@/lib/imageUrl";
import { BasketItem } from "@/store/store";

export async function POST(request: Request) {
  try {
    const { items, metadata } = await request.json();

    // Validate that all items have a price
    const itemsWithoutPrice = items.filter(
      (item: BasketItem) => !item.product.price
    );
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price set.");
    }

    // Check if the customer already exists in Stripe
    const customerList = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId =
      customerList.data.length > 0 ? customerList.data[0].id : undefined;

    // Define URLs for success and cancellation
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_URL}`;
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: items.map((item: BasketItem) => ({
        price_data: {
          currency: "usd",
          unit_amount: item.product.price
            ? Math.round(item.product.price * 100)
            : 0,
          product_data: {
            name: item.product.name || "Product Name",
            description: `PRODUCT ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Session Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
