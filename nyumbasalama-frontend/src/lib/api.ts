import axios from "axios";

// ============================================================
// BASE URL
// ============================================================

const configuredBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export const API_BASE_URL = configuredBaseUrl
  .replace(/\/+$/, "")   // Remove trailing slashes
  .replace(/\/api$/, ""); // Remove trailing /api

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const resolveVideoUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Request interceptor – attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTH API
// ============================================================

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: unknown) => api.post("/auth/register", data),
  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),
  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data),
  logout: () => api.post("/auth/logout"),
};

// ============================================================
// USER API
// ============================================================

export const userApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: unknown) => api.put("/users/profile", data),
  getById: (id: string) => api.get(`/users/${id}`),
  getDashboard: () => api.get("/users/dashboard"),
  getStats: () => api.get("/users/stats"),
};

// ============================================================
// PROPERTY API
// ============================================================

export const propertyApi = {
  getAll: (params?: unknown) => api.get("/properties", { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (data: unknown) => api.post("/properties", data),
  update: (id: string, data: unknown) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
  getByUniversity: (university: string) =>
    api.get(`/properties/university/${university}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/properties/${id}/status`, { status }),
};

// ============================================================
// VIDEO API (Legacy – consider removing if not used)
// ============================================================

export const videoApi = {
  getAll: (params?: unknown) => api.get("/videos", { params }),
  getById: (id: string) => api.get(`/videos/${id}`),
  getMyVideos: () => api.get("/videos"),
  getUserVideos: (userId?: string) =>
    userId ? api.get(`/videos/user/${userId}`) : api.get("/videos/user"),
  upload: (formData: FormData) =>
    api.post("/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  verify: (id: string, data: { status: string }) =>
    api.put(`/videos/${id}/verify`, data),
  like: (id: string) => api.post(`/videos/${id}/like`),
  delete: (id: string) => api.delete(`/videos/${id}`),
};

// ============================================================
// FAVORITES API
// ============================================================

export const favoritesApi = {
  getAll: () => api.get("/favorites"),
  add: (propertyId: string) => api.post("/favorites", { propertyId }),
  remove: (propertyId: string) => api.delete(`/favorites/${propertyId}`),
  check: (propertyId: string) => api.get(`/favorites/check/${propertyId}`),
};

// ============================================================
// REVIEWS API
// ============================================================

export const reviewApi = {
  getByProperty: (propertyId: string) =>
    api.get(`/reviews/property/${propertyId}`),
  create: (data: { propertyId: string; rating: number; comment: string }) =>
    api.post("/reviews", data),
  update: (id: string, data: unknown) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// ============================================================
// CHATBOT API – FIXED ENDPOINT ✅
// ============================================================

export const chatbotApi = {
  ask: (
    message: string,
    history: Array<{ role: "user" | "assistant"; content: string }> = [],
    sessionId?: string
  ) =>
    api.post("/chat", {
      message,
      session_id: sessionId,
      // history is not used by the simple chatbot; remove if your backend doesn't support it
    }),
};

// ============================================================
// ADMIN API
// ============================================================

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (params?: unknown) => api.get("/admin/users", { params }),
  getProperties: (params?: unknown) => api.get("/admin/properties", { params }),
  getVideos: (params?: unknown) => api.get("/admin/videos", { params }),

  updateUser: (id: string, data: unknown) =>
    api.put(`/admin/users/${id}`, data),
  updateUserStatus: (id: string, status: string) =>
    api.put(`/admin/users/${id}/status`, { status }),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  updateUserPermission: (id: string, canUpload: boolean) =>
    api.put(`/admin/users/${id}/upload-permission`, { can_upload: canUpload }),
  toggleBan: (id: string, isBanned: boolean) =>
    api.put(`/admin/users/${id}/ban`, { is_banned: isBanned }),

  updateProperty: (id: string, data: unknown) =>
    api.put(`/admin/properties/${id}`, data),
  updatePropertyStatus: (id: string, status: string) =>
    api.put(`/admin/properties/${id}/status`, { status }),

  updateVideo: (id: string, data: unknown) =>
    api.put(`/admin/videos/${id}`, data),
  updateVideoStatus: (id: string, status: string) =>
    api.put(`/admin/videos/${id}/status`, { status }),
  verifyVideo: (id: string) =>
    api.put(`/admin/videos/${id}/status`, { status: "VERIFIED" }),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  deleteProperty: (id: string) => api.delete(`/admin/properties/${id}`),
  deleteVideo: (id: string) => api.delete(`/admin/videos/${id}`),
};

export default api;