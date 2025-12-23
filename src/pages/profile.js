import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FiUser,
  FiShoppingBag,
  FiSettings,
  FiHeart,
  FiCamera,
  FiMapPin,
  FiLogOut,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useWishlist } from "@/contexts/WishlistContext";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const {
    isAuthenticated,
    loading: authLoading,
    updateProfile,
    logout,
  } = useAuth();
  const { orders, fetchOrders } = useCart();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const {
    data: user,
    isLoading: userIsLoading,
    isError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await api.get("auth/me/");
        return data.user;
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        return null;
      }
    },
    enabled: isAuthenticated,
  });

  const loading = authLoading || (isAuthenticated && userIsLoading);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await updateProfile(formData);
      refetchUser();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-widest">
            Could not load profile
          </h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderHistory orders={orders || []} />;
      case "wishlist":
        return <Wishlist />;
      case "details":
        return <AccountDetails user={user} onUpdate={refetchUser} />;
      case "address":
        return <Address user={user} onUpdate={refetchUser} />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "orders", label: "Order History", icon: <FiShoppingBag /> },
    { id: "wishlist", label: "Wishlist", icon: <FiHeart /> },
    { id: "details", label: "Account Details", icon: <FiUser /> },
    { id: "address", label: "Address", icon: <FiMapPin /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="lg:col-span-9 xl:col-span-10 bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 mt-14">
          <aside className="lg:col-span-3 xl:col-span-2 mb-8 lg:mb-0">
            <div className="sticky top-32 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-600">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform duration-200 hover:scale-110"
                    aria-label="Change avatar"
                  >
                    <FiCamera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-bold tracking-widest">
                    {user?.firstName || user?.username}
                  </h1>
                  <p className="text-sm tracking-wider text-gray-600">
                    {user?.email}
                  </p>
                  <p className="text-sm tracking-wider text-gray-600 mt-1">
                    Balance:{" "}
                    <span className="font-semibold">
                      ₦{user?.balance?.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <nav className="hidden lg:block space-y-1 ">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <span className="w-full flex items-center gap-4 px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 ease-in-out group">
                      <FiShield />
                      <span>Admin</span>
                    </span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm tracking-widest transition text-red-500 hover:bg-red-50"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          <div className="lg:hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    isMobile
                  />
                ))}
              </nav>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-9 xl:col-span-10"
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

const Tab = ({ label, icon, isActive, onClick, isMobile }) => {
  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={`flex-shrink-0 inline-flex items-center gap-2 p-4 text-sm font-medium border-b-2 whitespace-nowrap ${
          isActive
            ? "border-gray-500 text-gray-900"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-4 px-4 py-3 text-left text-sm font-medium  transition-all duration-200 ease-in-out group ${
        isActive
          ? "bg-gray-900 text-gray-100"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <span
        className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full transition-all duration-200 ease-in-out ${
          isActive ? "bg-gray-900" : "bg-transparent"
        }`}
      ></span>
      {icon}

      <span>{label}</span>
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-sm  overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-6 ${className}`}>{children}</div>
);

const OrderHistory = ({ orders }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold tracking-widest">Order History</h2>
    {orders && orders.length > 0 ? (
      orders.map((order) => (
        <Card key={order._id}>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div>
              <h3 className="font-bold tracking-widest text-sm">
                ORDER #{order._id.slice(-6)}
              </h3>
              <p className="text-xs tracking-widest text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p
                className={`text-xs font-semibold tracking-widest py-1 px-2 rounded-full inline-block ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status.toUpperCase()}
              </p>
              <p className="text-lg font-bold tracking-widest mt-1">
                ₦{order.totalPrice.toFixed(2)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Assuming you have a way to get the product image */}
                  {/* <img
                    src={item.product.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover "
                  /> */}
                  <div>
                    <h4 className="font-semibold tracking-wider text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs tracking-widest text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs tracking-widest text-gray-500">
                      Size: {item.size}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold tracking-wider">
                  ₦{item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))
    ) : (
      <Card>
        <CardContent className="text-center text-gray-500">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No orders yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You have not placed any orders.
          </p>
        </CardContent>
      </Card>
    )}
  </div>
);

const Wishlist = () => {
  const { wishlist, removeItem, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
      </div>
    );
  }

  if (wishlist && wishlist.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <Card key={product._id} className="group relative">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
              <button
                onClick={() => removeItem(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 transition-all duration-200"
                aria-label="Remove from wishlist"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <CardContent>
              <h3 className="font-semibold tracking-widest text-sm">
                {product.name}
              </h3>
              <p className="text-sm font-bold tracking-widest mt-2">
                ₦{product.price.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else {
    return (
      <Card>
        <CardContent className="text-center text-gray-500">
          <FiHeart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Empty Wishlist
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven’t added any items to your wishlist yet.
          </p>
        </CardContent>
      </Card>
    );
  }
};

const FormInput = (props) => (
  <input
    {...props}
    className="w-full p-3 border border-gray-300  shadow-sm focus:ring-black focus:border-black transition"
  />
);

const FormLabel = ({ children, ...props }) => (
  <label {...props} className="block text-xs tracking-widest mb-1 font-medium">
    {children}
  </label>
);

const AccountDetails = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const { updateProfile, isUpdatingProfile } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    onUpdate();
    setIsEditing(false);
  };

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-xs tracking-widest text-gray-500">{label}</p>
      <p className="font-semibold tracking-wider">{value || "N/A"}</p>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-widest">Account Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs tracking-widest font-semibold hover:text-black transition"
        >
          {isEditing ? "CANCEL" : "EDIT"}
        </button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <FormInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormInput
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                <FormInput
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={user?.email}
                className="w-full p-3 border border-gray-300 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full bg-black text-white py-3 tracking-widest  disabled:bg-gray-400 hover:bg-gray-800 transition"
            >
              {isUpdatingProfile ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DetailItem label="First Name" value={user?.firstName} />
              <DetailItem label="Last Name" value={user?.lastName} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DetailItem label="Username" value={user?.username} />
              <DetailItem label="Phone Number" value={user?.phoneNumber} />
            </div>
            <DetailItem label="Email" value={user?.email} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Address = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      address: user?.shippingAddress?.address || "",
      city: user?.shippingAddress?.city || "",
      postalCode: user?.shippingAddress?.postalCode || "",
      country: user?.shippingAddress?.country || "",
    },
    billingAddress: {
      address: user?.billingAddress?.address || "",
      city: user?.billingAddress?.city || "",
      postalCode: user?.billingAddress?.postalCode || "",
      country: user?.billingAddress?.country || "",
    },
  });
  const { updateProfile, isUpdatingProfile } = useAuth();

  const handleChange = (e, addressType) => {
    setFormData({
      ...formData,
      [addressType]: {
        ...formData[addressType],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    onUpdate();
    setIsEditing(false);
  };

  const AddressDetail = ({ title, address }) => (
    <div className="bg-white p-6  shadow-lg transition-shadow duration-300 hover:shadow-2xl border border-gray-200/80">
      <div className="flex items-center border-b-2 border-gray-100 pb-4 mb-4">
        <div className="p-3 bg-indigo-100 rounded-full">
          <FaMapMarkerAlt className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 ml-4 tracking-wide">
          {title}
        </h3>
      </div>
      {address?.address ? (
        <div className="space-y-3 text-gray-600 text-base">
          <p className="flex">
            <strong className="font-semibold text-gray-900 w-32">
              Address:
            </strong>
            <span>{address.address}</span>
          </p>
          <p className="flex">
            <strong className="font-semibold text-gray-900 w-32">City:</strong>
            <span>{address.city}</span>
          </p>
          <p className="flex">
            <strong className="font-semibold text-gray-900 w-32">
              Postal Code:
            </strong>
            <span>{address.postalCode}</span>
          </p>
          <p className="flex">
            <strong className="font-semibold text-gray-900 w-32">
              Country:
            </strong>
            <span>{address.country}</span>
          </p>
        </div>
      ) : (
        <p className="text-gray-500 italic pl-4 pt-2">No address provided.</p>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-widest">Address Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs tracking-widest font-semibold hover:text-black transition"
        >
          {isEditing ? "CANCEL" : "EDIT"}
        </button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-md font-bold tracking-widest mb-4">
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  name="address"
                  placeholder="Address"
                  value={formData.shippingAddress.address}
                  onChange={(e) => handleChange(e, "shippingAddress")}
                />
                <FormInput
                  name="city"
                  placeholder="City"
                  value={formData.shippingAddress.city}
                  onChange={(e) => handleChange(e, "shippingAddress")}
                />
                <FormInput
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.shippingAddress.postalCode}
                  onChange={(e) => handleChange(e, "shippingAddress")}
                />
                <FormInput
                  name="country"
                  placeholder="Country"
                  value={formData.shippingAddress.country}
                  onChange={(e) => handleChange(e, "shippingAddress")}
                />
              </div>
            </div>
            <div>
              <h3 className="text-md font-bold tracking-widest mb-4">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  name="address"
                  placeholder="Address"
                  value={formData.billingAddress.address}
                  onChange={(e) => handleChange(e, "billingAddress")}
                />
                <FormInput
                  name="city"
                  placeholder="City"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleChange(e, "billingAddress")}
                />
                <FormInput
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.billingAddress.postalCode}
                  onChange={(e) => handleChange(e, "billingAddress")}
                />
                <FormInput
                  name="country"
                  placeholder="Country"
                  value={formData.billingAddress.country}
                  onChange={(e) => handleChange(e, "billingAddress")}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full bg-black text-white py-3 tracking-widest  disabled:bg-gray-400 hover:bg-gray-800 transition"
            >
              {isUpdatingProfile ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AddressDetail
              title="Shipping Address"
              address={user.shippingAddress}
            />
            <AddressDetail
              title="Billing Address"
              address={user.billingAddress}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Settings = () => (
  <Card>
    <CardHeader>
      <h2 className="text-lg font-bold tracking-widest">Settings</h2>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h3 className="font-semibold tracking-widest">Notifications</h3>
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <p className="text-sm tracking-wider">Email Notifications</p>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm tracking-wider">SMS Notifications</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold tracking-widest">Password</h3>
        <button className="text-xs tracking-widest font-semibold mt-2 hover:text-black transition">
          CHANGE PASSWORD
        </button>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold tracking-widest">Language</h3>
        <select className="w-full p-3 border border-gray-300 mt-2  shadow-sm focus:ring-black focus:border-black transition">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
    </CardContent>
  </Card>
);
