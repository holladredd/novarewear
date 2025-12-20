import { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
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
