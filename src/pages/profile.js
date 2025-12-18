import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { FiUser, FiShoppingBag, FiSettings } from "react-icons/fi";

// Mock data
const user = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  avatar: "/user/avatar.png", // Placeholder avatar
};

const orders = [
  {
    id: "NOV-12345",
    date: "2023-10-15",
    total: "$340.00",
    status: "Delivered",
    items: [
      { name: "Oversized Tee Black", price: "$120.00" },
      { name: "Novare Hoodie", price: "$220.00" },
    ],
  },
  {
    id: "NOV-12344",
    date: "2023-09-21",
    total: "$180.00",
    status: "Delivered",
    items: [{ name: "Relaxed Pants", price: "$180.00" }],
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderHistory />;
      case "details":
        return <AccountDetails />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 pt-40 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-widest">
                {user.name}
              </h1>
              <p className="text-md tracking-wider text-gray-600">
                {user.email}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <Tab
              label="Order History"
              icon={<FiShoppingBag />}
              isActive={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <Tab
              label="Account Details"
              icon={<FiUser />}
              isActive={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
            <Tab
              label="Settings"
              icon={<FiSettings />}
              isActive={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </div>

          {/* Tab Content */}
          <div>{renderContent()}</div>
        </motion.div>
      </section>
    </div>
  );
}

const Tab = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm tracking-widest transition ${
      isActive
        ? "border-b-2 border-black font-semibold"
        : "text-gray-500 hover:text-black"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const OrderHistory = () => (
  <div className="space-y-6">
    {orders.map((order) => (
      <div key={order.id} className="p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold tracking-widest">{order.id}</h3>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.status}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="text-gray-600">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end font-bold pt-2 border-t border-gray-100">
          Total: {order.total}
        </div>
      </div>
    ))}
  </div>
);

const AccountDetails = () => (
  <div className="max-w-md">
    <form className="space-y-6">
      <div>
        <label className="block text-sm tracking-widest mb-1">Name</label>
        <input
          type="text"
          defaultValue={user.name}
          className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="block text-sm tracking-widest mb-1">Email</label>
        <input
          type="email"
          defaultValue={user.email}
          className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
        />
      </div>
      <button
        type="submit"
        className="bg-black text-white px-8 py-3 tracking-widest hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </form>
  </div>
);

const Settings = () => (
  <div className="max-w-md space-y-6">
    <div>
      <h3 className="text-lg font-semibold tracking-widest mb-2">Password</h3>
      <button className="border border-black px-6 py-2 tracking-widest hover:bg-gray-100 transition">
        Change Password
      </button>
    </div>
    <div>
      <h3 className="text-lg font-semibold tracking-widest mb-2">
        Notifications
      </h3>
      <label className="flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4" defaultChecked />
        <span>Receive marketing emails and promotions.</span>
      </label>
    </div>
  </div>
);
