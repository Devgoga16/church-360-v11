import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Permission {
  rol: {
    _id: string;
    nombre: string;
    icono: string;
    descripcion: string;
  };
  modulos: Array<{
    module: {
      _id: string;
      nombre: string;
      descripcion: string;
      orden: number;
    };
    opciones: Array<{
      _id: string;
      nombre: string;
      ruta: string;
      orden: number;
    }>;
  }>;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  person?: {
    _id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    telefono: string;
    direccion: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    nombreCompleto: string;
    id: string;
  };
  roles: Array<{
    _id: string;
    nombre: string;
    icono: string;
    descripcion: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  intentosFallidos: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ultimoAcceso: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
    permisos: Permission[];
  };
}

interface AuthContextType {
  user: User | null;
  permisos: Permission[] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permisos, setPermisos] = useState<Permission[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setUser(authData.user);
      setPermisos(authData.permisos);
      setToken(authData.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the local server which acts as a proxy to the external API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("[Auth] Login response status:", response.status);

      if (!response.ok) {
        console.log("[Auth] Response not OK, status:", response.status);
        const errorData = await response.json();
        console.log("[Auth] Error data:", errorData);
        throw new Error(
          errorData.error || `HTTP ${response.status}: Login failed`,
        );
      }

      const data = await response.json();
      console.log("[Auth] Login response data:", data);

      if (data.success && data.data) {
        const authData = {
          user: data.data.user,
          permisos: data.data.permisos,
          token: data.data.token,
        };
        localStorage.setItem("auth", JSON.stringify(authData));
        setUser(data.data.user);
        setPermisos(data.data.permisos);
        setToken(data.data.token);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("[Auth] Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setPermisos(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permisos,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
