// BlackFridaySale.tsx (Server Component)
import { COUPON_CODES } from "@/sanity/lib/sales/CouponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSalebyCouponCode";
import { Tag } from "lucide-react";
import { CountdownTimer } from "./CodeCountdownTimer";
import { CopyButton } from "./CopyCodeButton";

async function BlackFridaySale() {
  const activeSale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY);

  if (!activeSale?.isActive) {
    return null;
  }

  const sale = {
    isActive: activeSale.isActive ?? false,
    endDate: activeSale.validUntil || "",
    title: activeSale.title || "",
    description: activeSale.description || "",
    couponCode: activeSale.couponCode || "",
    discountAmount: activeSale.discountAmount || 0,
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-700 to-black opacity-90" />

      {/* Sale Content */}
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Section: Title and Description */}
            <div className="flex-1 text-center lg:text-left">
              {/* Sale Tag */}
              <div className="inline-flex items-center bg-gray-900 text-white px-4 py-1 rounded-full mb-4">
                <Tag className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Limited Time Offer
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                {sale.title}
              </h2>

              <p className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl">
                {sale.description}
              </p>

              {/* Coupon Code Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <CopyButton couponCode={sale.couponCode} />
                <span className="text-2xl font-bold text-white">
                  = {sale.discountAmount}% OFF
                </span>
              </div>
            </div>

            {/* Right Section: Countdown Timer */}
            <CountdownTimer endDate={sale.endDate} />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-red-500/20 rounded-full blur-xl" />
    </div>
  );
}

export default BlackFridaySale;
