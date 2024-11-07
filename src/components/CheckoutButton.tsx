import { BasketItem } from "@/store/store";
import React from "react";

interface Props {
  items: BasketItem[];
  metadata: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
  };
}

const CheckoutButton: React.FC<Props> = ({ items, metadata }) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, metadata }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
};

export default CheckoutButton;
