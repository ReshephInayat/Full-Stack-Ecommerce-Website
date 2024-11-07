import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/lib/types";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as Product | null;

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image Section */}
            <div className="relative h-96 lg:h-full min-h-[400px] w-full">
              {product.image?.asset?._ref ? (
                <div className="relative h-full w-full group">
                  <Image
                    src={imageUrl(product.image).url() || ""}
                    alt={product.name || "Product image"}
                    width={400}
                    height={400}
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
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

                  <div className="h-px bg-gray-200 w-full my-6" />

                  <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-600">
                    {Array.isArray(product.description) && (
                      <PortableText value={product.description} />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="flex-1 sm:flex-none">
                    <AddToBasketButton
                      product={product}
                      disable={isOutOfStock}
                      className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white ${
                        isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      }`}
                    />
                  </div>
                  {isOutOfStock && (
                    <p className="text-red-600 font-medium text-center sm:text-left">
                      Currently Unavailable
                    </p>
                  )}
                </div>

                {/* Additional Product Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Usually ships within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
