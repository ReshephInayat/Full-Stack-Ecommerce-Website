import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getUserOrders(userId: string) {
  if (!userId) {
    throw new Error("No user ID provided");
  }
  const USER_ORDERS_QUERY = defineQuery(`
        *[_type == "order" && clerkUserId == $userId] | order(orderDate desc){
            ...,
            products[]{
                ...,
                product->
            },
        } 
        `);
  try {
    const orders = await sanityFetch({
      query: USER_ORDERS_QUERY,
      params: { userId },
    });
    return orders.data || [];
  } catch (error) {
    console.error("Error fetching user orders", error);
    throw new Error("Error fetching user orders");
  }
}
