import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/contexts/AdminContext";
import withAdminAuth from "@/hocs/withAdminAuth";
import {
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const ProductDetailPage = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { getProduct, updateProduct, deleteProduct } = useAdmin();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => getProduct(_id),
    enabled: !!_id,
  });

  const categories = [
    "Tees",
    "Hoodies",
    "Pants",
    "Jackets",
    "Shorts",
    "Accessories",
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: "",
    gender: "",
    isFeatured: false,
  });
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [details, setDetails] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingLookImages, setExistingLookImages] = useState([]);
  const [newLookImages, setNewLookImages] = useState([]);

  // State for controlled inputs for complex fields
  const [sizeInput, setSizeInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [colorHexInput, setColorHexInput] = useState("#000000");
  const [detailInput, setDetailInput] = useState("");

  const imageInputRef = useRef(null);
  const lookImageInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        inStock: product.inStock || "",
        gender: product.gender || "",
        isFeatured: product.isFeatured || false,
      });
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setDetails(product.details || []);
      setExistingImages(product.images || []);
      setNewImages([]);
      setExistingLookImages(product.lookImages || []);
      setNewLookImages([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handlers for adding/removing complex field items
  const addSize = () => {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const addColor = () => {
    if (colorNameInput.trim()) {
      setColors([
        ...colors,
        { name: colorNameInput.trim(), hex: colorHexInput },
      ]);
      setColorNameInput("");
      setColorHexInput("#000000");
    }
  };
  const removeColor = (index) =>
    setColors(colors.filter((_, i) => i !== index));

  const addDetail = () => {
    if (detailInput.trim()) {
      setDetails([...details, detailInput.trim()]);
      setDetailInput("");
    }
  };
  const removeDetail = (index) =>
    setDetails(details.filter((_, i) => i !== index));

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "main") {
      setNewImages((prev) => [...prev, ...files]);
    } else {
      setNewLookImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index, type) => {
    if (type === "existing") {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "new") {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "existing-look") {
      setExistingLookImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewLookImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!product?._id) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Cannot Update",
  //       text: "Product ID is missing. Please refresh the page.",
  //     });
  //     return;
  //   }

  //   if (!formData.category) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Validation Error",
  //       text: "A category must be selected.",
  //     });
  //     return;
  //   }

  //   Swal.fire({
  //     title: "Updating Product...",
  //     text: "Please wait while we save the changes.",
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     },
  //   });

  //   try {
  //     const payload = new FormData();

  //     // Append simple form data fields directly
  //     payload.append("name", formData.name);
  //     payload.append("description", formData.description);
  //     payload.append("price", formData.price);
  //     payload.append("inStock", formData.inStock);
  //     payload.append("gender", formData.gender);
  //     payload.append("isFeatured", formData.isFeatured);

  //     // Filter and append stringified arrays for complex fields
  //     // In handleSubmit, ensure sizes is always a valid array
  //     const validSizes = sizes.filter((s) => s && String(s).trim() !== "");
  //     payload.append("sizes", JSON.stringify(validSizes)); // Must be array

  //     // Send category as plain string (not JSON)
  //     payload.append("category", formData.category); // "Tees", "Hoodies", etc.

  //     const validColors = colors.filter(
  //       (c) => c && c.name && c.name.trim() !== "" && c.hex
  //     );
  //     payload.append("colors", JSON.stringify(validColors));

  //     const validDetails = details.filter((d) => d && d.trim() !== "");
  //     payload.append("details", JSON.stringify(validDetails));

  //     // Append existing image public_ids
  //     const retainedImageIds = existingImages
  //       .map((img) => img.public_id)
  //       .filter(Boolean);
  //     payload.append("existingImages", JSON.stringify(retainedImageIds));

  //     const retainedLookImageIds = existingLookImages
  //       .map((img) => img.public_id)
  //       .filter(Boolean);
  //     payload.append(
  //       "existingLookImages",
  //       JSON.stringify(retainedLookImageIds)
  //     );

  //     // Append new image files
  //     newImages.forEach((file) => {
  //       payload.append("images", file);
  //     });

  //     newLookImages.forEach((file) => {
  //       payload.append("lookImages", file);
  //     });

  //     await updateProduct.mutateAsync({
  //       id: product._id,
  //       productData: payload,
  //     });

  //     Swal.fire({
  //       icon: "success",
  //       title: "Product Updated!",
  //       text: "The product has been successfully updated.",
  //     });
  //     setIsEditing(false);
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.error ||
  //       err.message ||
  //       "An unexpected error occurred.";
  //     Swal.fire({
  //       icon: "error",
  //       title: "Update Failed",
  //       text: errorMessage,
  //     });
  //   }
  // };

  // [_id].js - handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Updating Product...",
      text: "Please wait while we save the changes.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("category", formData.category);
    payload.append("inStock", formData.inStock);
    payload.append("description", formData.description);
    payload.append("sizes", JSON.stringify(sizes));
    payload.append("isFeatured", formData.isFeatured);

    // ✅ LOG FILES BEFORE SENDING
    console.log("Selected images:", newImages.length);
    console.log("Selected lookImages:", newLookImages.length);

    newImages.forEach((file, i) => {
      console.log(`Image ${i}:`, file.name, file.size);
      payload.append("images", file);
    });

    newLookImages.forEach((file, i) => {
      console.log(`LookImage ${i}:`, file.name, file.size);
      payload.append("lookImages", file);
    });

    await updateProduct.mutateAsync({ id: product._id, updatedData: payload });
  };
  const handleDelete = () => {
    if (!product?._id) {
      Swal.fire({
        icon: "error",
        title: "Cannot Delete",
        text: "Product ID is missing. Please refresh the page.",
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct.mutateAsync(product._id);
          Swal.fire("Deleted!", "The product has been deleted.", "success");
          router.push("/admin/products");
        } catch (err) {
          Swal.fire(
            "Failed!",
            err.message || "Could not delete the product.",
            "error"
          );
        }
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading product details...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        <FaExclamationTriangle className="mx-auto h-12 w-12" />
        <h2 className="mt-4 text-xl font-bold">Error Loading Product</h2>
        <p className="mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {product?.name}
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={updateProduct.isLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                <FaSave className="mr-2" /> Save
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleteProduct.isLoading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Product Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${
                      isEditing ? "border-gray-300" : "border-transparent"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    disabled={!isEditing}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    In Stock
                  </label>
                  <input
                    type="number"
                    name="inStock"
                    value={formData.inStock}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Additional Info
              </h2>
              <div className="space-y-6">
                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Sizes
                  </label>
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        placeholder="Add size"
                        className="flex-grow mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={addSize}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((size, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                      >
                        {size}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="ml-2 text-red-500 hover:text-red-700 font-bold"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Colors
                  </label>
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={colorNameInput}
                        onChange={(e) => setColorNameInput(e.target.value)}
                        placeholder="Color name"
                        className="flex-grow mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <input
                        type="color"
                        value={colorHexInput}
                        onChange={(e) => setColorHexInput(e.target.value)}
                        className="h-10 w-10 rounded-lg border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={addColor}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                      >
                        <span
                          style={{ backgroundColor: color.hex }}
                          className="w-4 h-4 rounded-full mr-2 border border-gray-400"
                        ></span>
                        {color.name}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="ml-2 text-red-500 hover:text-red-700 font-bold"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Details
                  </label>
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={detailInput}
                        onChange={(e) => setDetailInput(e.target.value)}
                        placeholder="Add detail"
                        className="flex-grow mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={addDetail}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    {details.map((detail, index) => (
                      <li key={index} className="flex items-center">
                        {detail}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index)}
                            className="ml-4 text-red-500 hover:text-red-700 font-bold"
                          >
                            &times;
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Main Images Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Product Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Existing Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeImage(index, "existing")}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                {newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New Preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeImage(index, "new")}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
              <input
                type="file"
                multiple
                ref={imageInputRef}
                onChange={(e) => handleImageChange(e, "main")}
                className="hidden"
              />
            </div>

            {/* Look Images Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Look Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingLookImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Look ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeImage(index, "existing-look")}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                {newLookImages.map((file, index) => (
                  <div key={`new-look-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New Look Preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeImage(index, "new-look")}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => lookImageInputRef.current.click()}
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
              <input
                type="file"
                multiple
                ref={lookImageInputRef}
                onChange={(e) => handleImageChange(e, "look")}
                className="hidden"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(ProductDetailPage);
