import { getUserOrders } from "@/sanity/lib/orders/getUserOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  const orders = await getUserOrders(userId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order ID: {order._id}</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-2 border-b">Product</th>
                  <th className="text-right pb-2 border-b">Price</th>
                  <th className="text-right pb-2 border-b">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((product) => (
                  <tr key={product.product?._id} className="border-b">
                    <td className="flex items-center py-4">
                      {product.product?.image?.asset?._ref && (
                        <div className="mr-4">
                          <Image
                            src={imageUrl(product.product.image).url()}
                            alt={product.product.name || ""}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </div>
                      )}
                      <div>{product.product?.name}</div>
                    </td>
                    <td className="text-right py-4">
                      {product.product?.price}
                    </td>
                    <td className="text-right py-4">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
