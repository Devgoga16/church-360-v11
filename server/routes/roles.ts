import { RequestHandler } from "express";
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ApiResponse,
} from "@shared/api";

// Mock data for roles
export const mockRoles: Role[] = [
  {
    _id: "69273c2be265542f632062c9",
    nombre: "Administrador",
    icono: "fas fa-user-shield",
    descripcion: "Acceso completo al sistema",
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69273c2be265542f632062ca",
    nombre: "Tesorero",
    icono: "fas fa-wallet",
    descripcion: "Gestión de finanzas",
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69273c2be265542f632062cb",
    nombre: "Pastor General",
    icono: "fas fa-cross",
    descripcion: "Lider principal de la iglesia",
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const listRoles: RequestHandler = (req, res) => {
  try {
    const response: ApiResponse<Role[]> = {
      success: true,
      data: mockRoles,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch roles",
    });
  }
};

export const getRole: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const role = mockRoles.find((r) => r._id === id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: "Role not found",
      });
    }

    res.json({
      success: true,
      data: role,
    } as ApiResponse<Role>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch role",
    });
  }
};

export const createRole: RequestHandler = (req, res) => {
  try {
    const { nombre, icono, descripcion, activo }: CreateRoleRequest = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: "Role name is required",
      });
    }

    const newRole: Role = {
      _id: Date.now().toString(),
      nombre,
      icono: icono || "fas fa-user",
      descripcion: descripcion || "",
      activo: activo !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockRoles.push(newRole);

    res.status(201).json({
      success: true,
      data: newRole,
    } as ApiResponse<Role>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create role",
    });
  }
};

export const updateRole: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, icono, descripcion, activo }: UpdateRoleRequest = req.body;

    const roleIndex = mockRoles.findIndex((r) => r._id === id);
    if (roleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Role not found",
      });
    }

    const role = mockRoles[roleIndex];
    if (nombre !== undefined) role.nombre = nombre;
    if (icono !== undefined) role.icono = icono;
    if (descripcion !== undefined) role.descripcion = descripcion;
    if (activo !== undefined) role.activo = activo;
    role.updatedAt = new Date().toISOString();

    mockRoles[roleIndex] = role;

    res.json({
      success: true,
      data: role,
    } as ApiResponse<Role>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update role",
    });
  }
};

export const deleteRole: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const roleIndex = mockRoles.findIndex((r) => r._id === id);
    if (roleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Role not found",
      });
    }

    mockRoles.splice(roleIndex, 1);

    res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete role",
    });
  }
};
