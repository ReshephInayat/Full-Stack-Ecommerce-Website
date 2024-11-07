import { COUPON_CODES } from "@/sanity/lib/sales/CouponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSalebyCouponCode";
import React from "react";

async function BlackFridaySale() {
  const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY);
  if (!sale?.isActive) {
    return null;
  }
  return (
    <div
      className="bg-gradient-to-r from-red-600 to-black text-white px-6
py-6 mx-4 mt-2 rounded-lg shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-left mb-4">
            {sale.title}
          </h2>
          <p className="text-left text-xl sm:text-2xl font-bold mb-4 uppercase">
            {sale.description}
          </p>
          <div className="flex ">
            <div className="bg-white text-black py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300">
              <span className="font-bold text-base">
                Use code: {""}
                <span className="text-red-600">{sale.couponCode}</span>
              </span>
              <span className="ml-2 font-bold text-base ">
                for {sale.discountAmount}% OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlackFridaySale;
