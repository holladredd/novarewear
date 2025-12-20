import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { login, register, loading, loginWithGoogle } = useAuth();

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin === window.location.origin &&
        event.data.accessToken &&
        event.data.user
      ) {
        loginWithGoogle({
          accessToken: event.data.accessToken,
          refreshToken: event.data.user.refresh, // Or however your refresh token is structured
          user: event.data.user,
        });
        onClose();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [loginWithGoogle, onClose]);

  const handleSwitch = (loginState) => {
    setIsLogin(loginState);
    setEmail("");
    setPassword("");
    setUsername("");
    setPhoneNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register({ username, email, password, phoneNumber });
    }
    if (result.success) {
      onClose();
    }
  };

  const openGoogleLoginPopup = () => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    window.open(
      url,
      "google-login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

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
        <div className="w-full h-screen flex items-center justify-center">
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
                  onClick={() => handleSwitch(true)}
                  className={`w-1/2 pb-2 text-lg font-semibold text-center ${
                    isLogin ? "border-b-2 border-gray-800" : "text-gray-400"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleSwitch(false)}
                  className={`w-1/2 pb-2 text-lg font-semibold text-center ${
                    !isLogin ? "border-b-2 border-gray-800" : "text-gray-400"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="email"
                  >
                    {isLogin ? "Email or Username" : "Email"}
                  </label>
                  <input
                    type={isLogin ? "text" : "email"}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                {!isLogin && (
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700"
                      htmlFor="phoneNumber"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                  </div>
                )}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Continue"}
                </button>
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                {/* <button
                  type="button"
                  onClick={openGoogleLoginPopup}
                  className="w-full py-3 font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
                >
                  <FcGoogle className="mr-2" />
                  Continue with Google
                </button> */}
              </form>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
