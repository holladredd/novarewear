import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get("/wishlist");
      return data.wishlist;
    },
    enabled: isAuthenticated,
  });

  const { mutate: addItem, isLoading: isAddingItem } = useMutation({
    mutationFn: async (productId) => {
      const { data } = await api.post("/wishlist", { productId });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["wishlist"], data.wishlist);
      Swal.fire("Success!", "Item added to wishlist.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.message || "Could not add item to wishlist.",
        "error"
      );
    },
  });

  const { mutate: removeItem, isLoading: isRemovingItem } = useMutation({
    mutationFn: async (productId) => {
      const { data } = await api.delete(`/wishlist/${productId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["wishlist"], data.wishlist);
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.message || "Could not remove item from wishlist.",
        "error"
      );
    },
  });

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        addItem,
        isAddingItem,
        removeItem,
        isRemovingItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
