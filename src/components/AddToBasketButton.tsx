"use client";

interface AddToBasketButtonProps {
  product: Product;
  disable?: boolean;
  className?: string;
}

import { Product } from "@/lib/types";
import useBasketStore from "@/store/store";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

function AddToBasketButton({ product, disable }: AddToBasketButtonProps) {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  const itemCount = getItemCount(product._id);
  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => removeItem(product._id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center
transition-colors duration-200 ${
          itemCount === 0
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        disabled={itemCount === 0 || disable}
      >
        <span
          className={`text-xl font-bold ${
            itemCount === 0 ? "text-gray-400" : "text-gray-600"
          }`}
        >
          -
        </span>
      </button>
      <span className="w-8 text-center font-semibold">{itemCount}</span>
      <button
        onClick={() => {
          addItem(product);
          if (pathname !== "/basket") {
            toast.success("Item added to cart");
          }
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center
transition-colors duration-200 ${
          disable ? "bg-gray-100 cursor-not-allowed" : "bg-red-600"
        }`}
        disabled={disable}
      >
        <span className=" text-white">+</span>
      </button>
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        {/* <h1>Click here to Add To Cart 🔥 </h1> */}
      </div>
    </div>
  );
}

export default AddToBasketButton;
