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
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[500px] overflow-y-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6"
            >
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-700">
                  <span className="font-semibold">Total Amount:</span> $
                  {order.products
                    ?.reduce((total, product) => {
                      return (
                        total +
                        (product.product?.price || 0) * (product.quantity || 0)
                      );
                    }, 0)
                    .toFixed(2) || "0.00"}
                </p>
                <p className="text-lg font-medium text-gray-700">
                  <span className="font-semibold">Status:</span> {order.status}
                </p>
                {order.amountDiscount && order.amountDiscount > 0 && (
                  <p className="text-lg font-medium text-gray-700">
                    <span className="font-semibold">Discount:</span> -$
                    {order.amountDiscount.toFixed(2)}
                  </p>
                )}
              </div>

              <table className="w-full text-gray-600">
                <thead>
                  <tr className="text-sm text-gray-500 uppercase border-b">
                    <th className="text-left pb-2">Product</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products?.map((product) => (
                    <tr
                      key={product.product?._id}
                      className="border-b hover:bg-gray-50"
                    >
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
                        <div className="text-gray-700">
                          {product.product?.name}
                        </div>
                      </td>
                      <td className="text-right py-4 text-gray-700">
                        $
                        {product.product?.price
                          ? product.product.price.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="text-right py-4 text-gray-700">
                        {product.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
