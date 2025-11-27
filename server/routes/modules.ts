import { RequestHandler } from "express";
import { Module, CreateModuleRequest, UpdateModuleRequest, ApiResponse } from "@shared/api";

// Mock data for modules
export const mockModules: Module[] = [
  {
    _id: "69273c2ce265542f632062d5",
    nombre: "Dashboard",
    descripcion: "Panel de control principal",
    icono: "fas fa-tachometer-alt",
    orden: 1,
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69273c2ce265542f632062d6",
    nombre: "Solicitudes",
    descripcion: "Gestión de solicitudes financieras",
    icono: "fas fa-file-invoice-dollar",
    orden: 2,
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const listModules: RequestHandler = (req, res) => {
  try {
    const response: ApiResponse<Module[]> = {
      success: true,
      data: mockModules,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch modules",
    });
  }
};

export const getModule: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const module = mockModules.find((m) => m._id === id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: "Module not found",
      });
    }

    res.json({
      success: true,
      data: module,
    } as ApiResponse<Module>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch module",
    });
  }
};

export const createModule: RequestHandler = (req, res) => {
  try {
    const { nombre, descripcion, orden, activo }: CreateModuleRequest = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: "Module name is required",
      });
    }

    const newModule: Module = {
      _id: Date.now().toString(),
      nombre,
      descripcion: descripcion || "",
      icono: "fas fa-cube",
      orden: orden || mockModules.length + 1,
      activo: activo !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockModules.push(newModule);

    res.status(201).json({
      success: true,
      data: newModule,
    } as ApiResponse<Module>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create module",
    });
  }
};

export const updateModule: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden, activo }: UpdateModuleRequest = req.body;

    const moduleIndex = mockModules.findIndex((m) => m._id === id);
    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Module not found",
      });
    }

    const module = mockModules[moduleIndex];
    if (nombre !== undefined) module.nombre = nombre;
    if (descripcion !== undefined) module.descripcion = descripcion;
    if (orden !== undefined) module.orden = orden;
    if (activo !== undefined) module.activo = activo;
    module.updatedAt = new Date().toISOString();

    mockModules[moduleIndex] = module;

    res.json({
      success: true,
      data: module,
    } as ApiResponse<Module>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update module",
    });
  }
};

export const deleteModule: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const moduleIndex = mockModules.findIndex((m) => m._id === id);
    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Module not found",
      });
    }

    mockModules.splice(moduleIndex, 1);

    res.json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete module",
    });
  }
};
