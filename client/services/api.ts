/**
 * Centralized API Service using Axios
 * Frontend-only HTTP client for all API calls
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

// Initialize axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://iglesia360-api.unify-tec.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add auth token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("[API] Error parsing auth data:", error);
      }
    }
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as any;
    const errorMessage = data?.error || data?.message || error.message;

    console.error("[API] Response error:", {
      status,
      data,
      message: errorMessage,
    });

    // Show toast notification for all errors
    let toastTitle = "Error";
    let toastMessage = errorMessage || "Ocurrió un error inesperado";

    if (status === 401) {
      // Clear auth on unauthorized
      toastTitle = "Sesión expirada";
      toastMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      localStorage.removeItem("auth");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else if (status === 403) {
      toastTitle = "Acceso denegado";
      toastMessage = "No tienes permiso para acceder a este recurso.";
    } else if (status === 404) {
      toastTitle = "No encontrado";
      toastMessage = "El recurso solicitado no existe.";
    } else if (status === 500) {
      toastTitle = "Error del servidor";
      toastMessage = "El servidor está experimentando problemas. Intenta de nuevo más tarde.";
    } else if (!status) {
      toastTitle = "Error de conexión";
      toastMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
    }

    toast({
      title: toastTitle,
      description: toastMessage,
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

/**
 * Auth API calls
 */
export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post("/api/auth/login", { username, password }),

  logout: () => {
    localStorage.removeItem("auth");
  },

  getProfile: () => apiClient.get("/api/users/me"),
};

/**
 * Users API calls
 */
export const usersApi = {
  getAll: () => apiClient.get("/api/users"),
  getById: (id: string | number) => apiClient.get(`/api/users/${id}`),
  create: (data: any) => apiClient.post("/api/users", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/api/users/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/api/users/${id}`),
};

/**
 * Ministries API calls
 */
export const ministriesApi = {
  getAll: () => apiClient.get("/api/ministries"),
  getById: (id: string | number) => apiClient.get(`/api/ministries/${id}`),
};

/**
 * Solicitudes API calls
 */
export const solicitudesApi = {
  getAll: () => apiClient.get("/api/solicitudes"),
  getById: (id: string | number) => apiClient.get(`/api/solicitudes/${id}`),
  create: (data: any) => apiClient.post("/api/solicitudes", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/api/solicitudes/${id}`, data),
  submit: (id: string | number, data?: any) =>
    apiClient.post(`/api/solicitudes/${id}/submit`, data),
  getDashboardStats: () => apiClient.get("/api/solicitudes/dashboard/stats"),
};

/**
 * Approvals API calls
 */
export const approvalsApi = {
  getApprovals: (solicitudId: string | number) =>
    apiClient.get(`/api/solicitudes/${solicitudId}/approvals`),
  approve: (solicitudId: string | number, data: any) =>
    apiClient.post(`/api/solicitudes/${solicitudId}/approve`, data),
  reject: (solicitudId: string | number, data: any) =>
    apiClient.post(`/api/solicitudes/${solicitudId}/reject`, data),
};

/**
 * Roles API calls
 */
export const rolesApi = {
  getAll: () => apiClient.get("/api/roles"),
  getById: (id: string) => apiClient.get(`/api/roles/${id}`),
  create: (data: any) => apiClient.post("/api/roles", data),
  update: (id: string, data: any) => apiClient.put(`/api/roles/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/roles/${id}`),
};

/**
 * Modules API calls
 */
export const modulesApi = {
  getAll: () => apiClient.get("/api/modules"),
  getById: (id: string) => apiClient.get(`/api/modules/${id}`),
  create: (data: any) => apiClient.post("/api/modules", data),
  update: (id: string, data: any) => apiClient.put(`/api/modules/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/modules/${id}`),
};

/**
 * Options API calls (Opciones/Acciones dentro de módulos)
 */
export const optionsApi = {
  getAll: () => apiClient.get("/api/options"),
  getById: (id: string) => apiClient.get(`/api/options/${id}`),
  create: (data: any) => apiClient.post("/api/options", data),
  update: (id: string, data: any) => apiClient.put(`/api/options/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/options/${id}`),
};

export default apiClient;
