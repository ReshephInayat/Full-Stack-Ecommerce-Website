import Link from "next/link";
import { Product } from "../../sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price || 0);

  return (
    <Link
      href={`/product/${product.slug?.current ?? "not-found"}`}
      className="block h-full"
    >
      <div
        className={`group relative flex flex-col h-full bg-white px-14 rounded-xl transition-all duration-300 shadow-xl ${
          isOutOfStock ? "opacity-80" : ""
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-gray-100">
          {product.image ? (
            <Image
              src={imageUrl(product.image).url()}
              fill
              alt={product.name || "Product Image"}
              className="object-cover transition-all duration-500 group-hover:scale-110"
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

          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow p-4 space-y-2">
          {/* Title and Description */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description?.[0]?._type === "block" &&
                product.description[0].children?.[0]?.text}
            </p>
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <span className="text-lg font-bold text-gray-900">
              {formattedPrice}
            </span>
            {!isOutOfStock && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductThumb;
