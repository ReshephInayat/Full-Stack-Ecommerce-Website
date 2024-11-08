"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { Product } from "@/lib/types";
import useBasketStore from "@/store/store";
import { Trash } from "lucide-react";

interface AddToBasketButtonProps {
  product: Product;
  disable?: boolean;
  className?: string;
}

function AddToBasketButton({ product, disable }: AddToBasketButtonProps) {
  const { addItem, clearBasket, removeItem, getItemCount } = useBasketStore(); // Use getItemCount to get current quantity in cart
  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);
  const [quantity, setQuantity] = useState(0); // Local quantity state

  useEffect(() => {
    setIsClient(true);
    // Set initial quantity based on the current count in the cart
    const initialQuantity = getItemCount(product._id);
    setQuantity(initialQuantity);
  }, [getItemCount, product._id]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Item Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (quantity > 0) {
              setQuantity(quantity - 1);
              removeItem(product._id);
            }
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            quantity === 0
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          disabled={quantity === 0 || disable}
        >
          <span
            className={`text-xl font-bold ${quantity === 0 ? "text-gray-400" : "text-gray-600"}`}
          >
            -
          </span>
        </button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => {
            setQuantity(quantity + 1);
            if (pathname === "/basket") {
              addItem(product);
            }
            // addItem(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            disable
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          disabled={disable}
        >
          <span className="text-xl font-bold">+</span>
        </button>
      </div>

      {/* Add to Cart Button */}
      {pathname === `/product/${product.slug?.current}` && (
        <button
          onClick={() => {
            for (let i = 0; i < quantity; i++) {
              addItem(product);
            }
            if (pathname !== "/basket") {
              toast.success(`${quantity} ${product.name} added to cart`);
            }
          }}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
            disable || quantity === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
          disabled={disable || quantity === 0}
        >
          Add to Cart
        </button>
      )}

      {/* Clear Cart Button */}
      {pathname === "/basket" && (
        <button
          onClick={() => {
            clearBasket();
            setQuantity(0); // Reset quantity to 0 after clearing cart
            toast.success("Cart cleared");
          }}
        >
          <Trash />
        </button>
      )}
    </div>
  );
}

export default AddToBasketButton;
