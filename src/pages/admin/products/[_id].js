import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/contexts/AdminContext";
import withAdminAuth from "@/hocs/withAdminAuth";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ProductDetailPage = () => {
  const {
    getProduct,
    updateProduct,
    deleteProduct,
    loading: adminLoading,
  } = useAdmin();
  const router = useRouter();
  const { _id } = router.query;

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => getProduct(_id),
    enabled: router.isReady && !!_id,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: "",
    images: [],
    sizes: [],
    isFeatured: false,
    lookImages: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        inStock: product.inStock || "",
        images: product.images?.join(", ") || "",
        sizes: product.sizes?.join(", ") || "",
        isFeatured: product.isFeatured || false,
        lookImages: product.lookImages?.join(", ") || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      images: formData.images.split(",").map((img) => img.trim()),
      sizes: formData.sizes.split(",").map((size) => size.trim()),
      lookImages: formData.lookImages.split(",").map((img) => img.trim()),
    };
    await updateProduct.mutateAsync({ id: _id, updatedData });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct.mutateAsync(_id);
        router.push("/admin/");
      }
    });
  };

  if (productLoading || !router.isReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (productError) {
    return <div>Error fetching product details.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaTrash className="mr-2" />
          Delete
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {product?.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name || "Product Image"}
              className="w-full h-auto rounded-lg shadow-md"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="inStock"
                  className="block text-sm font-medium text-gray-700"
                >
                  In Stock
                </label>
                <input
                  type="number"
                  name="inStock"
                  id="inStock"
                  value={formData.inStock}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Images (comma-separated)
                </label>
                <input
                  type="text"
                  name="images"
                  id="images"
                  value={formData.images}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="sizes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  name="sizes"
                  id="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="lookImages"
                  className="block text-sm font-medium text-gray-700"
                >
                  Look Images (comma-separated)
                </label>
                <input
                  type="text"
                  name="lookImages"
                  id="lookImages"
                  value={formData.lookImages}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isFeatured"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Is Featured
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={adminLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {adminLoading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(ProductDetailPage);
