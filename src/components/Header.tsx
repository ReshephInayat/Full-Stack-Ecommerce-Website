"use client";

import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { TrolleyIcon } from "@sanity/icons";
import { PackageIcon, Search, LogIn } from "lucide-react";
import useBasketStore from "@/store/store";
import { usePathname } from "next/navigation";

function Header() {
  const { user } = useUser();
  const pathname = usePathname(); // Get the current page path
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-4 space-y-4 lg:space-y-0">
          {/* Logo and Search Section */}
          <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto space-y-4 sm:space-y-0 sm:space-x-8">
            {/* Brand */}
            <Link
              href="/"
              className="text-3xl font-bold text-red-500 hover:text-red-600 transition-colors duration-200"
            >
              STYLOR
            </Link>

            {/* Search Form */}
            <Form
              action="/search"
              className="w-full sm:w-[400px] relative group"
            >
              <div className="relative">
                <input
                  type="text"
                  name="query"
                  placeholder="Search for Products"
                  className="w-full bg-gray-50 text-gray-800 py-2.5 pl-4 pr-10 rounded-lg border border-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           transition-all duration-200"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Form>
          </div>

          {/* Navigation and User Actions */}
          <nav className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* Basket Link */}
            <button>
              <span
                className="absolute top-3 right-96 bg-white text-red-600
rounded-full w-6 h-6 flex font-bold items-center justify-center text-xs border-2 border-red-800"
              >
                {itemCount}
              </span>
              <Link
                href="/basket"
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 
                       rounded-lg font-medium transition-all duration-200 hover:shadow-lg w-full sm:w-auto 
                       justify-center group"
              >
                <TrolleyIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />

                <span>My Basket</span>
              </Link>
            </button>

            {/* User Area */}
            <ClerkLoaded>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                {user && (
                  <Link
                    href="/orders"
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white 
                             px-4 py-2.5 rounded-lg font-medium transition-all duration-200 
                             hover:shadow-lg w-full sm:w-auto justify-center group"
                  >
                    <PackageIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>My Orders</span>
                  </Link>
                )}

                {user ? (
                  <div className="flex items-center space-x-3">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9",
                        },
                      }}
                    />
                    <div className="hidden lg:block">
                      <p className="text-sm text-gray-600">Welcome back</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <SignInButton mode="modal" forceRedirectUrl={pathname}>
                    <button
                      className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white 
                                     px-4 py-2.5 rounded-lg font-medium transition-all duration-200 
                                     hover:shadow-lg w-full sm:w-auto justify-center group"
                    >
                      <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                )}
              </div>
            </ClerkLoaded>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
