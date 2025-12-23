import { createContext, use, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
    enabled: isAuthenticated,
  });

  const { mutate: addItem, loading: isAddingItem } = useMutation({
    mutationFn: async ({ productId, size, quantity }) => {
      const { data } = await api.post("/cart", {
        productId,
        size,
        quantity,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      Swal.fire("Success!", "Item added to cart.", "success");
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
    mutationFn: async ({ productId, quantity, size }) => {
      const { data } = await api.post("/cart", { productId, quantity, size });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not update cart.", "error");
    },
  });

  const { mutate: removeItem, isLoading: isRemovingItem } = useMutation({
    mutationFn: async (cartItemId) => {
      const { data } = await api.delete(`/cart/${cartItemId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not remove item.", "error");
    },
  });

  const { mutate: clearCart, isLoading: isClearingCart } = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete("/cart");
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null);
      Swal.fire("Success!", "Cart cleared.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not clear cart.", "error");
    },
  });

  const { mutate: placeOrder } = useMutation({
    mutationFn: async ({ shippingAddress, paymentMethod }) => {
      const { data } = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null);
      queryClient.invalidateQueries(["orders"]);
      Swal.fire("Success!", "Order placed successfully.", "success");
    },
    onError: (error) => {
      Swal.fire("Error!", error.message || "Could not place order.", "error");
    },
  });

  const { data: orders, refetch: fetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data.orders;
    },
    enabled: false, // Will be manually triggered
  });

  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.setQueryData(["cart"], null);
    }
  }, [isAuthenticated, queryClient]);

  const items = cartResponse?.cart || [];
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
    isAddingItem,
    updateItem,
    removeItem,
    isRemovingItem,
    clearCart,
    isClearingCart,
    placeOrder,
    orders,
    fetchOrders,
    refreshCart: () => queryClient.invalidateQueries(["cart"]),
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
