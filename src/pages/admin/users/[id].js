import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useAdmin } from "@/contexts/AdminContext";

export default function UserDetailsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const { getUser, deleteUser } = useAdmin();
  const { data: userDetails, isLoading, isError } = getUser(id);
  const [activeTab, setActiveTab] = useState("personal");

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(id, {
          onSuccess: () => {
            router.push("/admin");
          },
        });
      }
    });
  };

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading || isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8 mt-14">
          <h1 className="text-2xl font-bold">User Details</h1>
          <p className="text-red-500">Error fetching user details.</p>
        </main>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInformation user={userDetails} />;
      case "wishlist":
        return <WishlistManagement wishlist={userDetails?.wishlist || []} />;
      case "orders":
        return <OrderManagement orders={userDetails?.orders || []} />;
      case "cart":
        return <CartManagement cart={userDetails?.cart || { items: [] }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8 mt-14">
        <div className="max-w-full mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-black mb-6"
          >
            <FiArrowLeft />
            <span>Back to Users</span>
          </button>
          {userDetails && (
            <div className="bg-white shadow-xl rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <img
                    src={userDetails.avatar || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">
                      {userDetails.firstName} {userDetails.lastName}
                    </h1>
                    <p className="text-gray-500">@{userDetails.username}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-full hover:bg-red-200 text-red-500"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("personal")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "personal"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Personal Information
                    </button>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "wishlist"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Wishlist
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "orders"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setActiveTab("cart")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "cart"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Cart
                    </button>
                  </nav>
                </div>
                <div className="mt-6">{renderContent()}</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const PersonalInformation = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email || "",
    role: user.role || "user",
    balance: user.balance || 0,
    phoneNumber: user.phoneNumber || "",
    shippingAddress: user.shippingAddress || {},
    billingAddress: user.billingAddress || {},
  });
  const { updateUser } = useAdmin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [addressType]: { ...prev[addressType], [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser.mutate({ id: user._id, updatedData: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Details</h3>
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Balance</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping Address</h3>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.shippingAddress?.address || ""}
              onChange={(e) => handleAddressChange(e, "shippingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.shippingAddress?.city || ""}
              onChange={(e) => handleAddressChange(e, "shippingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.shippingAddress?.postalCode || ""}
              onChange={(e) => handleAddressChange(e, "shippingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.shippingAddress?.country || ""}
              onChange={(e) => handleAddressChange(e, "shippingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <h3 className="text-lg font-medium mt-6">Billing Address</h3>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.billingAddress?.address || ""}
              onChange={(e) => handleAddressChange(e, "billingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.billingAddress?.city || ""}
              onChange={(e) => handleAddressChange(e, "billingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.billingAddress?.postalCode || ""}
              onChange={(e) => handleAddressChange(e, "billingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.billingAddress?.country || ""}
              onChange={(e) => handleAddressChange(e, "billingAddress")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-black text-white hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const WishlistManagement = ({ wishlist }) => {
  return <div>Wishlist Management</div>;
};

const OrderManagement = ({ orders }) => {
  return <div>Order Management</div>;
};

const CartManagement = ({ cart }) => {
  return <div>Cart Management</div>;
};
