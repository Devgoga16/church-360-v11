import { RequestHandler } from "express";
import {
  Option,
  CreateOptionRequest,
  UpdateOptionRequest,
  ApiResponse,
} from "@shared/api";
import { mockModules } from "./modules";
import { mockRoles } from "./roles";

// Mock data for options
const mockOptions: Option[] = [
  {
    _id: "69273c2ce265542f632062e0",
    nombre: "Ver Dashboard",
    ruta: "/dashboard",
    icono: "fas fa-chart-line",
    orden: 1,
    module: "69273c2ce265542f632062d5",
    roles: ["69273c2be265542f632062c9", "69273c2be265542f632062ca"],
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69273c2ce265542f632062e1",
    nombre: "Crear Solicitud",
    ruta: "/solicitudes/crear",
    icono: "fas fa-plus",
    orden: 1,
    module: "69273c2ce265542f632062d6",
    roles: ["69273c2be265542f632062ca"],
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "69273c2ce265542f632062e2",
    nombre: "Ver Solicitudes",
    ruta: "/solicitudes",
    icono: "fas fa-list",
    orden: 2,
    module: "69273c2ce265542f632062d6",
    roles: ["69273c2be265542f632062c9", "69273c2be265542f632062ca"],
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const listOptions: RequestHandler = (req, res) => {
  try {
    // Populate module and roles data
    const optionsWithData = mockOptions.map((option) => {
      const moduleData = mockModules.find((m) => m._id === option.module);
      const rolesData = (option.roles as string[]).map(
        (roleId) => mockRoles.find((r) => r._id === roleId) || { _id: roleId },
      );

      return {
        ...option,
        module: moduleData,
        roles: rolesData,
      };
    });

    const response: ApiResponse<Option[]> = {
      success: true,
      data: optionsWithData as Option[],
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch options",
    });
  }
};

export const getOption: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const option = mockOptions.find((o) => o._id === id);

    if (!option) {
      return res.status(404).json({
        success: false,
        error: "Option not found",
      });
    }

    const moduleData = mockModules.find((m) => m._id === option.module);
    const rolesData = (option.roles as string[]).map(
      (roleId) => mockRoles.find((r) => r._id === roleId) || { _id: roleId },
    );

    const populatedOption = {
      ...option,
      module: moduleData,
      roles: rolesData,
    };

    res.json({
      success: true,
      data: populatedOption,
    } as ApiResponse<Option>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch option",
    });
  }
};

export const createOption: RequestHandler = (req, res) => {
  try {
    const {
      nombre,
      ruta,
      icono,
      orden,
      module,
      roles,
      activo,
    }: CreateOptionRequest = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: "Option name is required",
      });
    }

    if (!ruta) {
      return res.status(400).json({
        success: false,
        error: "Route is required",
      });
    }

    if (!module) {
      return res.status(400).json({
        success: false,
        error: "Module is required",
      });
    }

    const moduleExists = mockModules.some((m) => m._id === module);
    if (!moduleExists) {
      return res.status(404).json({
        success: false,
        error: "Module not found",
      });
    }

    const validRoles = roles || [];
    for (const roleId of validRoles) {
      const roleExists = mockRoles.some((r) => r._id === roleId);
      if (!roleExists) {
        return res.status(404).json({
          success: false,
          error: `Role ${roleId} not found`,
        });
      }
    }

    const newOption: Option = {
      _id: Date.now().toString(),
      nombre,
      ruta,
      icono: icono || "fas fa-circle",
      orden: orden || 1,
      module: module,
      roles: validRoles,
      activo: activo !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOptions.push(newOption);

    // Populate module and roles data in response
    const moduleData = mockModules.find((m) => m._id === newOption.module);
    const rolesData = validRoles.map(
      (roleId) => mockRoles.find((r) => r._id === roleId) || { _id: roleId },
    );

    const responseData = {
      ...newOption,
      module: moduleData,
      roles: rolesData,
    };

    res.status(201).json({
      success: true,
      data: responseData,
    } as ApiResponse<Option>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create option",
    });
  }
};

export const updateOption: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      ruta,
      icono,
      orden,
      module,
      roles,
      activo,
    }: UpdateOptionRequest = req.body;

    const optionIndex = mockOptions.findIndex((o) => o._id === id);
    if (optionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Option not found",
      });
    }

    if (module) {
      const moduleExists = mockModules.some((m) => m._id === module);
      if (!moduleExists) {
        return res.status(404).json({
          success: false,
          error: "Module not found",
        });
      }
    }

    if (roles) {
      for (const roleId of roles) {
        const roleExists = mockRoles.some((r) => r._id === roleId);
        if (!roleExists) {
          return res.status(404).json({
            success: false,
            error: `Role ${roleId} not found`,
          });
        }
      }
    }

    const option = mockOptions[optionIndex];
    if (nombre !== undefined) option.nombre = nombre;
    if (ruta !== undefined) option.ruta = ruta;
    if (icono !== undefined) option.icono = icono;
    if (orden !== undefined) option.orden = orden;
    if (module !== undefined) option.module = module;
    if (roles !== undefined) option.roles = roles;
    if (activo !== undefined) option.activo = activo;
    option.updatedAt = new Date().toISOString();

    mockOptions[optionIndex] = option;

    // Populate module and roles data in response
    const moduleData = mockModules.find((m) => m._id === option.module);
    const rolesData = (option.roles as string[]).map(
      (roleId) => mockRoles.find((r) => r._id === roleId) || { _id: roleId },
    );

    const responseData = {
      ...option,
      module: moduleData,
      roles: rolesData,
    };

    res.json({
      success: true,
      data: responseData,
    } as ApiResponse<Option>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update option",
    });
  }
};

export const deleteOption: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const optionIndex = mockOptions.findIndex((o) => o._id === id);
    if (optionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Option not found",
      });
    }

    mockOptions.splice(optionIndex, 1);

    res.json({
      success: true,
      message: "Option deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete option",
    });
  }
};
