import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log("No webhook secret");
    return NextResponse.json({ error: "No webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Checkout session completed", session.id);
    try {
      const order = await createOrderInSanity(session);
      console.log("Order created in Sanity", order);

      // Send confirmation email after the order is created
      await sendConfirmationEmail({
        ...order,
        currency: order.currency || "USD", // Provide a default value if currency is null
      });
      console.log("Confirmation email sent to client");
    } catch (err) {
      console.error("Error processing order or sending email", err);
      return NextResponse.json(
        { error: "Error processing order or sending email" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ["data.price.product"],
    }
  );

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata.id,
    },
    quantity: item.quantity || 0,
    productDetails: {
      name: (item.price?.product as Stripe.Product)?.name,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
      image: (item.price?.product as Stripe.Product)?.images[0],
    },
  }));

  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details?.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });

  return {
    ...order,
    products: sanityProducts.map((item) => ({
      product: item.productDetails,
      quantity: item.quantity,
    })),
  };
}

async function sendConfirmationEmail(order: {
  email: string;
  customerName: string;
  orderNumber: string;
  totalPrice: number;
  currency: string;
  products: Array<{
    product: { name: string; price: number; image: string };
    quantity: number;
  }>;
}) {
  // Set up your transporter (adjust according to your email provider)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use another provider
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Generate the items list for the email (HTML)
  const itemDetails = order.products
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">
          <img src="${item.product.image}" alt="${item.product.name}" style="width: 50px; height: 50px; margin-right: 10px;"/>
          ${item.product.name}
        </td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
          ${item.quantity} x ${item.product.price} ${order.currency}
        </td>
      </tr>
    `
    )
    .join("");

  // Plain text version of the email with item details
  const textDetails = order.products
    .map(
      (item) =>
        `${item.product.name} - ${item.quantity} x ${item.product.price} ${order.currency}`
    )
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_FROM, // your email address
    to: order.email, // customer's email
    subject: "Order Confirmation",
    text: `Hello ${order.customerName},\n\nThank you for your order!\n\nOrder Number: ${order.orderNumber}\nTotal: ${order.totalPrice} ${order.currency}\n\nItems in your order:\n${textDetails}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nYour Company`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <header style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #FF0000;">STYLOR</h1>
          <h2 style="color: #333;">Order Confirmation</h2>
        </header>
        <p>Hello <strong>${order.customerName}</strong>,</p>
        <p>Thank you for shopping with us! Your order has been received and is being processed.</p>
        
        <h3 style="margin-top: 20px; color: #333;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Order Number</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Total</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.totalPrice} ${order.currency}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Order Date</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
        
        <h3 style="margin-top: 20px; color: #333;">Items in Your Order</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${itemDetails}
        </table>

        <p>We will notify you once your order is shipped.</p>
        <p>Best regards,<br>Your Company</p>
      </div>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log("Confirmation email sent to client");
}
