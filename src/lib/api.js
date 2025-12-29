// lib/api.js
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE = API_BASE_URL || "https://novarewear-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Refresh flow:
 * - If a request gets 401, we attempt one refresh request.
 * - While refresh is in progress, other requests wait (queued).
 * - If refresh succeeds, we update auth cookie and retry original requests.
 * - If refresh fails, we reject queued requests and optionally trigger logout.
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach current access token header from cookies if present
// lib/api.js
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ CRITICAL: Remove Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Ensure trailing slash
    if (
      config.url &&
      !config.url.startsWith("http") &&
      !config.url.endsWith("/") &&
      !config.url.includes("?")
    ) {
      config.url = config.url + "/";
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor -> handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Helper to format errors into user-friendly messages
    const formatError = (axiosError) => {
      let errorCategory = "UNKNOWN";
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      let statusCode = null;
      let details = null;

      // Timeout error (axios specific)
      if (axiosError.code === "ECONNABORTED") {
        errorCategory = "TIMEOUT";
        friendlyMessage =
          "Request timed out after 45 seconds. Please check your internet connection and try again.";
      }
      // Network error (no response from server)
      else if (!axiosError.response) {
        const msg = axiosError.message || "";
        if (msg.includes("Network Error")) {
          errorCategory = "NETWORK";
          friendlyMessage =
            "Network error. Please check your internet connection.";
        } else if (msg.includes("CORS")) {
          errorCategory = "CORS";
          friendlyMessage =
            "Request blocked by CORS policy. Please try again later.";
        } else {
          errorCategory = "NETWORK";
          friendlyMessage =
            "Unable to connect to the server. Please check your connection.";
        }
      }
      // Server responded with error status
      else {
        statusCode = axiosError.response.status;
        const errorData = axiosError.response.data;

        if (statusCode >= 500) {
          errorCategory = "SERVER_ERROR";
          friendlyMessage = `Server error (${statusCode}). We're working to fix this. Please try again later.`;
          details =
            errorData?.detail || errorData?.message || "Internal server error";
        } else if (statusCode >= 400) {
          errorCategory = "CLIENT_ERROR";
          // Try to extract detailed message from server
          details =
            errorData?.detail ||
            errorData?.message ||
            errorData?.non_field_errors?.[0] ||
            errorData?.error;
          friendlyMessage =
            details ||
            `Request failed (${statusCode}). Please check your input and try again.`;
        }
      }

      return {
        isHandled: true, // Flag to indicate it's been processed
        category: errorCategory,
        message: friendlyMessage,
        status: statusCode,
        details: details,
        originalError: axiosError, // Keep original for debugging
      };
    };

    // If no request config, just format and reject
    if (!originalRequest) {
      return Promise.reject(formatError(error));
    }

    // Prevent infinite retry loops
    if (originalRequest._retry) {
      return Promise.reject(formatError(error));
    }

    const status = error.response ? error.response.status : null;

    // --- Handle 401 (Unauthorized) with token refresh ---
    if (status === 401) {
      // Do not attempt to refresh token for login failures
      if (originalRequest.url.endsWith("/auth/login/")) {
        return Promise.reject(formatError(error));
      }

      if (isRefreshing) {
        // Queue request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              originalRequest._retry = true;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(formatError(err)), // Format queued errors
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const refreshToken = Cookies.get("refreshToken");

          if (!refreshToken) {
            const formattedError = formatError(error);
            formattedError.message = "Session expired. Please log in again.";
            formattedError.category = "AUTH_ERROR";
            processQueue(formattedError, null);
            return reject(formattedError);
          }

          const refreshRes = await axios.post(
            `${API_BASE}/auth/refresh/`,
            { refresh: refreshToken },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          const newAccess = refreshRes.data?.access;
          if (!newAccess) {
            Swal.fire("No access token in refresh response");
          }

          Cookies.set("authToken", newAccess, { expires: 7 });
          if (refreshRes.data?.refresh) {
            Cookies.set("refreshToken", refreshRes.data?.refresh, {
              expires: 14,
            });
          }

          api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          processQueue(null, newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          resolve(api(originalRequest));
        } catch (refreshError) {
          // Format the refresh error
          const formattedError = formatError(refreshError);
          formattedError.message = "Session expired. Please log in again.";
          formattedError.category = "AUTH_ERROR";

          // Clear auth cookies on failed refresh
          try {
            Cookies.remove("authToken");
            Cookies.remove("refreshToken");
            Cookies.remove("user");
            Cookies.remove("userType");
          } catch (e) {}

          processQueue(formattedError, null);
          reject(formattedError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    // --- Handle all other errors (timeout, network, 4xx, 5xx) ---
    return Promise.reject(formatError(error));
  }
);

export default api;
