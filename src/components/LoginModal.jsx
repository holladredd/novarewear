import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { delay: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
            variants={modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FiX size={24} />
            </button>
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 pb-2 text-lg font-semibold text-center ${
                  isLogin ? "border-b-2 border-gray-800" : "text-gray-400"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 pb-2 text-lg font-semibold text-center ${
                  !isLogin ? "border-b-2 border-gray-800" : "text-gray-400"
                }`}
              >
                Sign Up
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900"
              >
                Continue
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
