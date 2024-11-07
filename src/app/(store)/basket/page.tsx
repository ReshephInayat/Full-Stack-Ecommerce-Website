// app/basket/page.js
"use client";
import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/store/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";

function BasketPage() {
  const pathname = usePathname();
  const groupItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  const handelCheckout = async () => {
    if (isSignedIn) {
      setIsLoading(true);
      try {
        const metadata = {
          orderNumber: crypto.randomUUID(),
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
          clerkUserId: user?.id ?? "Unknown",
        };

        // Call the Route Handler
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: groupItems, metadata }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Failed to create checkout session:", data.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (groupItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-semibold text-gray-600">
          Your basket is empty
        </h1>
        <p className="text-gray-400">
          Add some items to your basket and come back here
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="2xl font-bold mb-4"></h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {groupItems.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between border rounded p-4 mb-4"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-w-0"
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                  <Image
                    src={imageUrl(item.product.image as string).url()}
                    alt={item.product.name ?? "Product image"}
                    className="w-full h-full object-cover rounded"
                    width={96}
                    height={96}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {item.product.name}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Price: £
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items: </span>
              <span>
                {groupItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                £{useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>
          {isSignedIn ? (
            <button
              onClick={handelCheckout}
              disabled={isLoading}
              className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl={pathname}>
              <button className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded">
                Sign in to checkout
              </button>
            </SignInButton>
          )}
        </div>
        <div className="h-64 lg:h-0"></div>
      </div>
    </div>
  );
}

export default BasketPage;
