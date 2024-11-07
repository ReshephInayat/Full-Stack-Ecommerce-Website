import React from "react";
import { Category, Product } from "../../sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelectorComponent } from "./ui/category-selector";

interface ProductViewProps {
  products: Product[];
  categories: Category[];
}

function ProductView({ products, categories }: ProductViewProps) {
  return (
    <>
      <div className="flex flex-col">
        {/* category */}
        <div className="w-full sm:w-[200px]">
          <CategorySelectorComponent categories={categories} />
        </div>
        {/* products */}
        <div className="flex-1">
          <div>
            <ProductGrid products={products} />
            <hr className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductView;
