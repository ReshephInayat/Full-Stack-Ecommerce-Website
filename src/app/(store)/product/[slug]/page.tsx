import { Suspense } from "react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Truck, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/lib/types";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

// Types
interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ProductFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const productFeatures: ProductFeature[] = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Shipping",
    description: "Free shipping on orders over £50",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "Usually ships within 24 hours",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Payment",
    description: "100% secure payment",
  },
];

// Loading component for Suspense
const ProductPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* <Skeleton className="h-96 lg:h-[600px] w-full" />
          <div className="p-6 lg:p-8 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  </div>
);

/**
 * ProductPage Component
 *
 * A full-featured product detail page component for e-commerce
 * Includes:
 * - Responsive image gallery
 * - Product details and description
 * - Add to basket functionality
 * - Stock status
 * - Shipping information
 * - Loading states
 *
 * @param {ProductPageProps} props - Component props
 */
async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as Product | null;

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to products link */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image Section */}
              <div className="relative h-96 lg:h-[600px] w-full">
                {product.image?.asset?._ref ? (
                  <div className="relative h-full w-full group">
                    <Image
                      src={imageUrl(product.image).url() || ""}
                      alt={product.name || "Product image"}
                      fill
                      className="object-contain transition-all duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      quality={90}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <span className="bg-red-600 text-white px-6 py-2 rounded-full text-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col p-6 lg:p-8 h-full">
                <div className="flex-grow">
                  <div className="space-y-4">
                    {/* Product Title and Price */}
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        {product.name}
                      </h1>
                      <div className="flex items-baseline space-x-3">
                        <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                          £{product.price?.toFixed(2)}
                        </span>
                        {!isOutOfStock && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full my-6" />

                    {/* Product Description */}
                    <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-600">
                      {Array.isArray(product.description) && (
                        <PortableText value={product.description} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to Basket Section */}
                <div className="mt-8 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <AddToBasketButton
                      product={product}
                      disable={isOutOfStock}
                      className={`w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white ${
                        isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      }`}
                    />
                    {isOutOfStock && (
                      <p className="text-red-600 font-medium text-center sm:text-left">
                        Currently Unavailable
                      </p>
                    )}
                  </div>

                  {/* Product Features */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {productFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 text-gray-500"
                        >
                          {feature.icon}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {feature.title}
                            </span>
                            <span className="text-sm">
                              {feature.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default ProductPage;
