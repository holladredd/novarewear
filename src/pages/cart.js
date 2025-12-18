import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Oversized Tee Black",
    price: 120,
    image: "/products/tee-1.jpg",
    quantity: 1,
  },
  {
    id: 4,
    name: "Novare Hoodie",
    price: 220,
    image: "/products/hoodie-1.jpg",
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (id, amount) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl font-bold tracking-widest mb-8 text-center">
          My Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-lg tracking-widest mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-black text-white py-3 px-8 tracking-widest hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 border-b border-gray-200 pb-6"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold tracking-widest">
                      {item.name}
                    </h2>
                    <p className="text-md tracking-widest opacity-70">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-gray-50 p-8 h-fit">
              <h2 className="text-2xl font-bold tracking-widest mb-6">
                Summary
              </h2>
              <div className="space-y-4 text-md tracking-wider">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-300">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full bg-black text-white py-3 mt-8 tracking-widest hover:bg-gray-800 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
