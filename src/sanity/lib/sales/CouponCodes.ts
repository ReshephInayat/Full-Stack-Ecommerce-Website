export const COUPON_CODES = {
  BFRIDAY: "BFRIDAY",
  XMAS: "XMAS",
  NEWYEAR: "NEWYEAR",
  EASTER: "EASTER",
  HALLOWEEN: "HALLOWEEN",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;
