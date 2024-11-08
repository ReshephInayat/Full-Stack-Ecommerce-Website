import Link from "next/link";
import { Product } from "../../sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { Heart, Eye } from "lucide-react";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const isOnSale = product.price && product.price > product.price;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price || 0);

  const formattedOriginalPrice = product.price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.price)
    : null;

  // const discount = product.price
  //   ? Math.round(((product.price - (product.price || 0)) / product.price) * 100)
  //   : 0;

  return (
    <div
      className="group relative h-full"
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`h-full bg- shadow-2xl px-10 rounded-xl transition-all duration-300
        }`}
      >
        {/* Image and Badges Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
          {/* Main Product Image */}
          <Link href={`/product/${product.slug?.current ?? "not-found"}`}>
            {product.image ? (
              <Image
                src={imageUrl(product.image).url()}
                fill
                alt={product.name || "Product Image"}
                className="object-contain transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <svg
                  className="w-16 h-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </Link>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {/* {isOnSale && (
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                {discount}% OFF
              </span>
            )} */}
            {/* {product.name && (
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                NEW
              </span>
            )} */}
          </div>

          {/* Quick Actions */}
          <div className="absolute right-3 top-2 flex flex-col gap-2">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-200 group/btn">
              <Heart className="w-5 h-5 text-gray-600 group-hover/btn:text-red-500 transition-colors duration-200" />
            </button>
            <Link href={`/product/${product.slug?.current ?? "not-found"}`}>
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-200 group/btn">
                <Eye className="w-5 h-5 text-gray-600 group-hover/btn:text-blue-500 transition-colors duration-200" />
              </button>
            </Link>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute  inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
              <span className="bg-white bg-opacity-15 border-2 text-gray-900 border-gray-800  px-4 py-2 rounded-md text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {/* <div className="text-xs text-gray-500 mb-1">
            {product.categories?.join(", ")}
          </div> */}

          {/* Title */}
          <Link href={`/product/${product.slug?.current ?? "not-found"}`}>
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>

          {
            // Description
            product.description && (
              <div className="text-sm text-gray-500 line-clamp-3 mt-1">
                {product.description.map((desc, index) => (
                  <p key={index}>
                    {"children" in desc
                      ? desc.children?.map((child) => child.text).join(" ")
                      : ""}
                  </p>
                ))}
              </div>
            )
          }

          {/* Rating */}
          {/* <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.reviews || 0})
            </span>
          </div> */}

          {/* Price */}
          <div className="flex gap-2 items-center">
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formattedPrice}
              </span>
              {isOnSale && (
                <span className="text-sm text-gray-500 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={isOutOfStock}
              className={` w-full mt-3 flex items-center justify-center rounded-full px-4 text-xs font-medium transition-all duration-200 ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-800 cursor-not-allowed"
                  : "bg-green-600 bg-opacity-25 border border-green-500 text-green-800"
              }`}
            >
              {/* <ShoppingBag className="w-4 h-4" /> */}
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductThumb;
