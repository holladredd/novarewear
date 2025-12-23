import { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import api from "@/lib/api";
import Swal from "sweetalert2";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!Cookies.get("authToken")) return null;
      try {
        const { data } = await api.get("auth/me/");
        return data.user;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ login, password }) => {
      const { data } = await api.post("auth/login/", { login, password });
      return data;
    },
    onSuccess: (data) => {
      const { accessToken, refresh, user: userData } = data;
      Cookies.set("authToken", accessToken, { expires: 7 });
      if (refresh) {
        Cookies.set("refreshToken", refresh, { expires: 14 });
      }
      queryClient.setQueryData(["user"], userData);
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Swal.fire({
        icon: "success",
        title: "Logged In!",
        text: "Welcome back.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.detail || "An error occurred during login.",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post("auth/register/", userData);
      return data;
    },
    onSuccess: (data) => {
      const { accessToken, refresh, user: newUserData } = data;
      Cookies.set("authToken", accessToken, { expires: 7 });
      if (refresh) {
        Cookies.set("refreshToken", refresh, { expires: 14 });
      }
      queryClient.setQueryData(["user"], newUserData);
      Cookies.set("user", JSON.stringify(newUserData), { expires: 7 });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "Your account has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
      const errorMessages = Object.values(error.response?.data || {})
        .flat()
        .join("\n");
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessages || "An error occurred during registration.",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.patch("auth/updateprofile/", userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("Profile update failed:", error.message);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.nmessage || "An error occurred during profile update.",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        await api.post("auth/logout/", { refresh: refreshToken });
      }
    },
    onSuccess: () => {
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
      window.location.reload();
    },
  });

  const login = useCallback(
    async (login, password) => {
      try {
        const data = await loginMutation.mutateAsync({ login, password });
        return { success: true, user: data.user };
      } catch (error) {
        return {
          success: false,
          message: error.message || "An error occurred during login.",
        };
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (userData) => {
      try {
        const data = await registerMutation.mutateAsync(userData);
        return { success: true, user: data.user };
      } catch (error) {
        return {
          success: false,
          message: error.message || "An error occurred during registration.",
        };
      }
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const updateProfile = useCallback(
    async (userData) => {
      try {
        const data = await updateProfileMutation.mutateAsync(userData);
        return { success: true, user: data.user };
      } catch (error) {
        return {
          success: false,
          message: error.message || "An error occurred during profile update.",
        };
      }
    },
    [updateProfileMutation]
  );

  const loginWithGoogle = useCallback(
    async ({ accessToken, refreshToken, user: googleUser }) => {
      try {
        // Normalize the user object to ensure consistency
        const normalizedUser = googleUser
          ? {
              id: googleUser._id,
              username: googleUser.username,
              email: googleUser.email,
              role: googleUser.role,
            }
          : null;

        Cookies.set("authToken", accessToken, { expires: 7 });

        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, { expires: 14 });
        }
        if (normalizedUser) {
          Cookies.set("user", JSON.stringify(normalizedUser), { expires: 7 });
          queryClient.setQueryData(["user"], normalizedUser);
        }

        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        Swal.fire({
          icon: "success",
          title: "Logged In!",
          text: "Welcome back!",
          timer: 2000,
          showConfirmButton: false,
        });

        return { success: true, user: normalizedUser };
      } catch (error) {
        console.error("Google login processing failed:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "An error occurred during Google login.",
        });
        return { success: false, message: error.message };
      }
    },
    [queryClient]
  );

  const value = {
    user,
    isAuthenticated: !!user,
    loading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending ||
      updateProfileMutation.isPending,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle,
    query: {
      refetch: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
