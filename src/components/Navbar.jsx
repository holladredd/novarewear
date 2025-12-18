import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FiShoppingBag, FiUser } from "react-icons/fi";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state

  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const links = [
    { name: "SHOP", href: "/shop" },
    { name: "LOOKBOOK", href: "/lookbook" },
    { name: "ABOUT", href: "/about" },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl flex items-center">
          <Image
            src="/logo/novare-wordmark.svg"
            alt="NØVÁRE Logo"
            width={120}
            height={50}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-sm tracking-widest">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:opacity-60 transition-all duration-200 relative"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Cart & Mobile Menu */}
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="hover:opacity-60 transition"
              aria-label="User Profile"
            >
              <FiUser size={24} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-black/5"
                >
                  {isLoggedIn ? (
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <Link
                        href="/cart"
                        className="relative hover:opacity-60 transition  justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 items-center flex"
                        aria-label="Shopping Cart"
                      >
                        Cart
                        <span className=" bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          2
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setLoginModalOpen(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login / Sign Up
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger Mobile */}
          <button
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? (
              <HiOutlineX size={24} />
            ) : (
              <HiOutlineMenu size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-t border-black/5"
        >
          <div className="flex flex-col gap-4 p-6 text-center">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-semibold hover:opacity-60 transition"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-lg font-semibold hover:opacity-60 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  PROFILE
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-lg font-semibold hover:opacity-60 transition"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setLoginModalOpen(true);
                  setMobileOpen(false);
                }}
                className="text-lg font-semibold hover:opacity-60 transition"
              >
                LOGIN
              </button>
            )}
            <Link
              href="/cart"
              className="text-lg font-semibold hover:opacity-60 transition"
              onClick={() => setMobileOpen(false)}
            >
              CART
            </Link>
          </div>
        </motion.div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </motion.div>
  );
}
