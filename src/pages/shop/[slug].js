import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

const ReviewSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
        <div>
          <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

const EditReviewForm = ({ review, onCancel, productId }) => {
  const { updateReview, isUpdatingReview } = useProducts();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateReview(
      { reviewId: review._id, rating, comment, productId },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
      <h4 className="text-lg font-bold mb-4">Edit Your Review</h4>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={ratingValue} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  className="sr-only"
                  defaultChecked={ratingValue === rating}
                />
                <svg
                  className={`w-7 h-7 ${
                    ratingValue <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.448a1 1 0 00-1.175 0l-3.365 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.323 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              </label>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="edit-comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Comment
        </label>
        <textarea
          id="edit-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows="4"
        ></textarea>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isUpdatingReview}
          className="bg-black text-white py-2 px-4 font-bold tracking-widest text-sm rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {isUpdatingReview ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const ProductReviews = ({ reviews, productId }) => {
  const { user } = useAuth();
  const { deleteReview, isDeletingReview, isLoading } = useProducts();
  const [editingReview, setEditingReview] = useState(null);

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReview({ reviewId, productId });
      }
    });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-widest mb-6 text-center">
          Reviews
        </h2>
        <p className="text-center text-gray-500">
          There are no reviews for this product yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-widest mb-10 text-center">
        Customer Reviews
      </h2>
      <div className="space-y-8">
        {reviews.map((review) =>
          editingReview?._id === review._id ? (
            <EditReviewForm
              key={review._id}
              review={editingReview}
              onCancel={() => setEditingReview(null)}
              productId={productId}
            />
          ) : (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-gray-600">
                      {review.user?.username?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {review.user?.username || "Anonymous"}
                    </p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.448a1 1 0 00-1.175 0l-3.365 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.323 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                {user && user.username === review.user?.username && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setEditingReview(review)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={isDeletingReview}
                      className="text-sm text-red-600 hover:underline disabled:text-gray-400"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed mt-2">
                {review.comment}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const ReviewForm = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const { submitReview, isSubmittingReview } = useProducts();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      Swal.fire("Error!", "Please write a comment.", "error");
      return;
    }
    submitReview(
      { productId, rating, comment },
      {
        onSuccess: () => {
          setRating(5);
          setComment("");
        },
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          You must be{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            logged in
          </a>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 border border-gray-200"
      >
        <h3 className="text-2xl font-bold tracking-widest mb-6 text-center">
          Write a Review
        </h3>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Rating
          </label>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={ratingValue} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="sr-only"
                  />
                  <svg
                    className={`w-8 h-8 ${
                      ratingValue <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.448a1 1 0 00-1.175 0l-3.365 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.323 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                </label>
              );
            })}
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="comment"
            className="block text-lg font-medium text-gray-800 mb-2"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            rows="5"
            placeholder="Share your thoughts about this product..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmittingReview}
          className="w-full bg-black text-white py-3 px-6 font-bold tracking-widest text-lg rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmittingReview ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
};

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { fetchProductBySlug, fetchReviewsByProductId } = useProducts();
  const { addItem, isAddingItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  const { data: reviews, isLoading: areReviewsLoading } = useQuery({
    queryKey: ["reviews", product?._id],
    queryFn: () => fetchReviewsByProductId(product._id),
    enabled: !!product?._id,
  });

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a size!",
      });
      return;
    }
    addItem({ productId: product._id, size: selectedSize, quantity });
  };

  if (isProductLoading)
    return <div className="text-center py-12">Loading...</div>;
  if (isProductError)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading product.
      </div>
    );
  if (!product) return null;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleImageSelect = (index) => {
    setActiveImage(index);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <img
                src={product.images?.[activeImage]?.url || "/placeholder.png"}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((image, index) => (
                <img
                  key={image.public_id}
                  src={image.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  onClick={() => handleImageSelect(index)}
                  className={`w-full h-auto object-cover rounded-md cursor-pointer ${
                    activeImage === index ? "border-2 border-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-widest mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold tracking-widest mb-4">
              ₦{product?.price?.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="flex items-center gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 text-sm tracking-widest border ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "border-black"
                      } hover:bg-black hover:text-white transition`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 border border-black px-3 py-2 text-center"
              />
              <button
                onClick={handleAddToCart}
                disabled={isAddingItem}
                className="w-full bg-black text-white py-3 px-6 font-bold tracking-widest hover:bg-gray-800 transition disabled:bg-gray-400"
              >
                {isAddingItem ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {product.lookImages && product.lookImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-widest mb-6 text-center">
              How to Wear It
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.lookImages.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={`Look ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-gray-200 pt-8">
          {areReviewsLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <ReviewSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductReviews reviews={reviews} productId={product._id} />
          )}
          <ReviewForm productId={product._id} />
        </div>
      </section>
    </div>
  );
}
