import { RequestHandler } from "express";
import { Ministry, ApiResponse, PaginatedResponse } from "@shared/api";

// Mock data for ministries
const mockMinistries: Ministry[] = [
  {
    id: 1,
    code: 'MIN001',
    name: 'Ministerio de Alabanza',
    description: 'Responsable de la música y adoración',
    responsibleUserId: 4,
    budgetLimit: 5000.00,
    currency: 'PEN',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'MIN002',
    name: 'Ministerio de Jóvenes',
    description: 'Actividades y discipulado de jóvenes',
    responsibleUserId: 4,
    budgetLimit: 8000.00,
    currency: 'PEN',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: 'MIN003',
    name: 'Ministerio de Niños',
    description: 'Cuidado y educación de niños',
    responsibleUserId: 5,
    budgetLimit: 6000.00,
    currency: 'PEN',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    code: 'MIN004',
    name: 'Ministerio de Obras Sociales',
    description: 'Ayuda a la comunidad',
    responsibleUserId: 6,
    budgetLimit: 10000.00,
    currency: 'PEN',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    code: 'MIN005',
    name: 'Ministerio de Misiones',
    description: 'Actividades misioneras y evangelismo',
    responsibleUserId: 3,
    budgetLimit: 15000.00,
    currency: 'PEN',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const listMinistries: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;

    let filtered = [...mockMinistries];

    if (status) {
      filtered = filtered.filter(m => m.status === status);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedMinistries = filtered.slice(start, end);

    const response: PaginatedResponse<Ministry> = {
      success: true,
      data: paginatedMinistries,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ministries',
    });
  }
};

export const getMinistry: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const ministry = mockMinistries.find(m => m.id === parseInt(id));

    if (!ministry) {
      return res.status(404).json({
        success: false,
        error: 'Ministry not found',
      });
    }

    res.json({
      success: true,
      data: ministry,
    } as ApiResponse<Ministry>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ministry',
    });
  }
};
