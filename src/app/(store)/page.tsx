import BlackFridaySale from "@/components/BlackFridaySale";
import HalloweenSale from "@/components/HalloweenSale";
// import Hero from "@/components/Hero";
import ProductView from "@/components/ProductView";
import XmaxSale from "@/components/XmaxSale";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import React from "react";

export const dynamic = "force-static";
export const revalidate = 60;

async function page() {
  const products = await getAllProducts();
  const category = await getAllCategories();
  return (
    <div>
      {/* Sales */}
      <div>
        <BlackFridaySale />
        <XmaxSale />
        <HalloweenSale />
        {/* <Hero /> */}
      </div>
      {/* Render all Products */}
      <ProductView products={products} categories={category} />
    </div>
  );
}

export default page;
