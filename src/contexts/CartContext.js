import { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart/");
      return data.cart;
    },
    enabled: isAuthenticated,
  });

  const { mutate: addItem } = useMutation({
    mutationFn: async ({ productId, size, quantity }) => {
      const { data } = await api.post("/cart/add/", {
        product_id: productId,
        size,
        quantity,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries("cart");
        Swal.fire("Success!", "Item added to cart.", "success");
      } else {
        Swal.fire(
          "Error!",
          data.message || "Could not add item to cart.",
          "error"
        );
      }
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.message || "Could not add item to cart.",
        "error"
      );
    },
  });

  const { mutate: updateItem } = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const { data } = await api.put(`/cart/item/${itemId}/`, { quantity });
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries("cart");
      } else {
        Swal.fire("Error!", data.message || "Could not update cart.", "error");
      }
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not update cart.", "error");
    },
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: async (itemId) => {
      const { data } = await api.delete(`/cart/item/${itemId}/`);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries("cart");
      } else {
        Swal.fire("Error!", data.message || "Could not remove item.", "error");
      }
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not remove item.", "error");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.setQueryData(["cart"], null);
    }
  }, [isAuthenticated, queryClient]);

  const items = cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const value = {
    items,
    loading: isLoading,
    totalItems,
    totalPrice,
    addItem,
    updateItem,
    removeItem,
    clearCart: () => queryClient.setQueryData(["cart"], null),
    refreshCart: () => queryClient.invalidateQueries("cart"),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
