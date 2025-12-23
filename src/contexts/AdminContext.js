import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Swal from "sweetalert2";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users");
      return data.users;
    },
  });

  const getUser = (id) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const { data } = await api.get(`/admin/users/${id}`);
        return data.user;
      },
      enabled: !!id,
    });
  };

  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.delete(`/admin/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire("Deleted!", "User has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const { data } = await api.put(`/admin/users/${id}`, updatedData);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire("Success!", "User updated successfully.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
    },
  });

  // ------------------ Product Management ------------------

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/admin/products");
      return data.products;
    },
  });

  const getProduct = async (_id) => {
    const { data } = await api.get(`/admin/products/${_id}`);
    return data.product;
  };

  const createProduct = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await api.post("/admin/products", newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Success!", "Product created successfully.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const { data } = await api.put(`/admin/products/${id}`, updatedData);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Success!", "Product updated successfully.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId) => {
      const { data } = await api.delete(`/admin/products/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Deleted!", "Product has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
    },
  });

  const value = {
    users,
    usersLoading,
    usersError,
    getUser,
    deleteUser,
    updateUser,
    products,
    productsLoading,
    productsError,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
