import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { FiUsers, FiBox, FiShoppingCart, FiCreditCard } from "react-icons/fi";
import { useAdmin } from "@/contexts/AdminContext";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
      </div>
    );
  }

  const tabs = [
    { id: "users", label: "Users", icon: <FiUsers /> },
    { id: "products", label: "Products", icon: <FiBox /> },
    { id: "orders", label: "Orders", icon: <FiShoppingCart /> },
    { id: "payments", label: "Payments", icon: <FiCreditCard /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "payments":
        return <PaymentManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8 mt-14">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p>Welcome, {user.username}.</p>
        </div>
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-2 border-b-2 ${
                activeTab === tab.id
                  ? "border-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6">{renderContent()}</div>
      </main>
    </div>
  );
}

const UserManagement = () => {
  const { users, usersLoading, usersError, deleteUser } = useAdmin();
  const router = useRouter();

  const handleUserClick = (id) => {
    router.push(`/admin/users/${id}`);
  };

  const handleDelete = (e, userId) => {
    e.stopPropagation();
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
        deleteUser.mutate(userId);
      }
    });
  };

  const handleRowClick = (userId) => {
    router.push(`/admin/users/${userId}`);
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="text-red-500">
        <p>Error fetching users. Please try again later.</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users?.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(user._id)}
              >
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={(e) => handleDelete(e, user._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const { getProducts, deleteProduct } = useAdmin();
  const router = useRouter();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["products"], queryFn: getProducts });

  const handleDelete = (e, productId) => {
    e.stopPropagation();
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
        deleteProduct.mutate(productId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded-md">
        <p>Error fetching products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-xl font-bold">Product Management</h2>
        <button
          onClick={() => router.push("/admin/products/create")}
          className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded"
        >
          Create Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products?.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/products/${product._id}`)}
              >
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">{product.inStock}</td>
                <td className="py-3 px-4 flex items-center">
                  <button
                    onClick={(e) => handleDelete(e, product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManagement = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Order Management</h2>
    <p>Here you can manage all orders.</p>
  </div>
);

const PaymentManagement = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Payment Management</h2>
    <p>Here you can manage all payments.</p>
  </div>
);
