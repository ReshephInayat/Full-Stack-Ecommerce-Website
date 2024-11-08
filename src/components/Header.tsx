"use client";

import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { TrolleyIcon } from "@sanity/icons";
import {
  PackageIcon,
  Search,
  LogIn,
  Menu,
  X,
  Heart,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import useBasketStore from "@/store/store";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Header() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isHoveringCategories, setIsHoveringCategories] = useState(false);
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const categories = [
    "New Arrivals",
    "Men",
    "Women",
    "Kids",
    // "Accessories",
    "Sale",
  ];

  return (
    <div className="border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>Free Shipping on Orders Over $100</span>
              <span>•</span>
              <span className="text-red-400 font-medium">
                Sale: Up to 24% Off
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/help"
                className="hover:text-gray-300 flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
              <span>|</span>
              <Link href="/orders" className="hover:text-gray-300">
                Your Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo and Categories */}
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors duration-200"
              >
                STYLOR
              </Link>

              {/* Desktop Categories */}
              <nav className="hidden lg:flex items-center space-x-6">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {category}
                  </Link>
                ))}
                <button
                  className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                  // onMouseEnter={() => setIsHoveringCategories(true)}
                  // onMouseLeave={() => setIsHoveringCategories(false)}
                >
                  More
                  <ChevronDown className="w-4 h-4" />
                </button>
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <Form action="/search" className="hidden lg:block w-[300px]">
                <div className="relative">
                  <input
                    type="text"
                    name="query"
                    placeholder="Search products..."
                    className="w-full bg-gray-50 text-gray-800 py-2 pl-10 pr-4 rounded-full border border-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                             transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </Form>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="hidden lg:flex items-center text-gray-600 hover:text-gray-900"
                >
                  <div className="relative">
                    <Heart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      0
                    </span>
                  </div>
                </Link>

                {/* Cart */}
                <Link href="/basket" className="relative group">
                  <div className="relative">
                    <TrolleyIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {itemCount}
                    </span>
                  </div>
                </Link>

                {/* User Account */}
                <ClerkLoaded>
                  {user ? (
                    <div className="hidden lg:flex items-center space-x-3">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                          },
                        }}
                      />
                      <div className="hidden xl:block">
                        <p className="text-xs text-gray-500">Welcome back</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <SignInButton mode="modal" forceRedirectUrl={pathname}>
                      <button className="hidden lg:flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                        <LogIn className="w-6 h-6" />
                        <span className="font-medium">Sign In</span>
                      </button>
                    </SignInButton>
                  )}
                </ClerkLoaded>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-gray-100">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <Form action="/search">
                <div className="relative">
                  <input
                    type="text"
                    name="query"
                    placeholder="Search products..."
                    className="w-full bg-gray-50 text-gray-800 py-2 pl-10 pr-4 rounded-full border border-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </Form>

              {/* Mobile Categories */}
              <nav className="space-y-4">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                    className="block text-gray-600 hover:text-gray-900 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="space-y-4">
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>

                {user && (
                  <Link
                    href="/orders"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PackageIcon className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;
