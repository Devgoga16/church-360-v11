import { RequestHandler } from "express";
import { ApiResponse } from "@shared/api";

console.log("[Auth Module] Loaded");

interface LoginRequest {
  email: string;
  password: string;
}

// Mock users database - matching the expected User structure
const mockUsers = [
  {
    _id: "1",
    username: "admin",
    email: "admin@iglesia360.com",
    password: "admin123",
    person: {
      _id: "1",
      nombres: "Juan",
      apellidos: "García",
      tipoDocumento: "DNI",
      numeroDocumento: "12345678",
      fechaNacimiento: "1990-01-01",
      telefono: "123456789",
      direccion: "Calle 1",
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      nombreCompleto: "Juan García",
      id: "1",
    },
    roles: [
      {
        _id: "1",
        nombre: "Administrador",
        icono: "fa-shield",
        descripcion: "Admin",
        activo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
    ],
    intentosFallidos: 0,
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    ultimoAcceso: new Date().toISOString(),
  },
];

// Mock permissions/modules for demo
const mockPermisos = [
  {
    rol: {
      _id: "1",
      nombre: "Administrador",
      icono: "fa-shield",
      descripcion: "Admin",
    },
    modulos: [
      {
        module: {
          _id: "1",
          nombre: "Solicitudes",
          descripcion: "Gestión de solicitudes",
          orden: 1,
        },
        opciones: [
          {
            _id: "1",
            nombre: "Mis Solicitudes",
            ruta: "/solicitudes",
            orden: 1,
          },
          {
            _id: "2",
            nombre: "Nueva Solicitud",
            ruta: "/solicitudes/nueva",
            orden: 2,
          },
        ],
      },
    ],
  },
];

export const login: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    console.log("Login attempt:", { email });

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      console.log("User not found or password invalid:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    console.log("Login successful:", { email, id: user._id });

    // Generate a simple token (in production, use JWT)
    const token = `token_${user._id}_${Date.now()}`;

    const response: ApiResponse<{
      token: string;
      user: typeof user;
      permisos: typeof mockPermisos;
    }> = {
      success: true,
      data: {
        token,
        user,
        permisos: mockPermisos,
      },
    };

    return res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};
