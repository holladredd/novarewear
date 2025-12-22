import { createContext, useContext, useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import Swal from "sweetalert2";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sizes: [],
    price: [0, 1000],
    isFeatured: false,
    sort: "newest",
    page: 1,
    limit: 10,
  });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          if (value.length > 0) params.append(key, value.join(","));
        } else {
          params.append(key, value);
        }
      }
    });
    return params;
  }, [filters]);

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", queryParams.toString()],
    queryFn: async () => {
      const { data } = await api.get(`/products?${queryParams.toString()}`);
      return data;
    },
  });

  const fetchReviewsByProductId = async (productId) => {
    if (!productId) return [];
    const { data } = await api.get(`/reviews/${productId}`);
    return data.reviews;
  };

  const { mutate: submitReview, isLoading: isSubmittingReview } = useMutation({
    mutationFn: async ({ productId, rating, comment }) => {
      const { data } = await api.post(`/reviews/${productId}`, {
        rating,
        comment,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["reviews", variables.productId]);
      Swal.fire("Success!", "Review submitted successfully.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not submit review.", "error");
    },
  });

  const { mutate: updateReview, isLoading: isUpdatingReview } = useMutation({
    mutationFn: async ({ reviewId, rating, comment }) => {
      const { data } = await api.put(`/reviews/${reviewId}`, {
        rating,
        comment,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["reviews", variables.productId]);
      Swal.fire("Success!", "Review updated successfully.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not update review.", "error");
    },
  });

  const { mutate: deleteReview, isLoading: isDeletingReview } = useMutation({
    mutationFn: async ({ reviewId }) => {
      return api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["reviews", variables.productId]);
      Swal.fire("Success!", "Review deleted successfully.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not delete review.", "error");
    },
  });

  const fetchProductBySlug = async (slug) => {
    const { data } = await api.get(`/products/${slug}`);
    return data.product;
  };

  const fetchLookbook = async () => {
    const { data } = await api.get(`/products/lookbook`);
    return data.products;
  };

  const value = {
    products: productsData?.products || [],
    pagination: productsData?.pagination || {},
    isLoading,
    isError,
    filters,
    setFilters,
    fetchProductBySlug,
    fetchLookbook,
    submitReview,
    isSubmittingReview,
    fetchReviewsByProductId,
    updateReview,
    isUpdatingReview,
    deleteReview,
    isDeletingReview,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
