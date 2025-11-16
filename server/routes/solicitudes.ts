import { RequestHandler } from "express";
import {
  Solicitud,
  SolicitudStatus,
  PaymentType,
  CreateSolicitudRequest,
  UpdateSolicitudRequest,
  SubmitSolicitudRequest,
  ApiResponse,
  PaginatedResponse,
  AuditLog,
  WorkflowStep,
  ProofOfPaymentStatus,
} from "@shared/api";

// Mock data for solicitudes
const mockSolicitudes: Solicitud[] = [
  {
    id: 1,
    code: "SOL001",
    ministryId: 1,
    ministryName: "Ministerio de Alabanza",
    requesterUserId: 5,
    requesterName: "Pedro Sánchez",
    responsibleUserId: 4,
    responsibleName: "Ana Martínez",
    title: "Equipos de sonido para alabanza",
    description:
      "Compra de micrófono inalámbrico, amplificador y cables de audio de alta calidad para mejorar la calidad de sonido en los servicios.",
    totalAmount: 2500.0,
    currency: "USD",
    status: SolicitudStatus.BORRADOR,
    paymentType: PaymentType.TERCEROS,
    paymentDetail: "Pagar a proveedor TechSound Inc.",
    items: [
      {
        itemNumber: 1,
        description: "Micrófono inalámbrico profesional",
        amount: 800.0,
        quantity: 2,
        unitPrice: 400.0,
      },
      {
        itemNumber: 2,
        description: "Amplificador de audio 500W",
        amount: 1200.0,
        quantity: 1,
        unitPrice: 1200.0,
      },
      {
        itemNumber: 3,
        description: "Cables de audio y conectores",
        amount: 500.0,
        quantity: 5,
        unitPrice: 100.0,
      },
    ],
    attachments: [],
    approvals: [],
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 2,
    code: "SOL002",
    ministryId: 2,
    ministryName: "Ministerio de Jóvenes",
    requesterUserId: 5,
    requesterName: "Pedro Sánchez",
    responsibleUserId: 4,
    responsibleName: "Ana Martínez",
    title: "Retiro de jóvenes verano 2024",
    description:
      "Viaje de campamento para jóvenes incluyendo transporte, alojamiento y comidas para 40 personas.",
    totalAmount: 4500.0,
    currency: "USD",
    status: SolicitudStatus.PENDIENTE,
    paymentType: PaymentType.TERCEROS,
    paymentDetail: "Pagar a empresa de turismo Valle Bonito",
    items: [
      {
        itemNumber: 1,
        description: "Transporte en autobús (4 buses)",
        amount: 2000.0,
        quantity: 4,
        unitPrice: 500.0,
      },
      {
        itemNumber: 2,
        description: "Alojamiento (2 noches)",
        amount: 1800.0,
        quantity: 40,
        unitPrice: 45.0,
      },
      {
        itemNumber: 3,
        description: "Comidas (desayuno, almuerzo, cena)",
        amount: 700.0,
        quantity: 40,
        unitPrice: 17.5,
      },
    ],
    attachments: [],
    approvals: [
      {
        id: 1,
        solicitudId: 2,
        approverUserId: 4,
        approverName: "Ana Martínez",
        approvalOrder: 1,
        status: "pendiente",
        requiredApproval: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        solicitudId: 2,
        approverUserId: 2,
        approverName: "María López",
        approvalOrder: 2,
        status: "pendiente",
        requiredApproval: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    submittedAt: new Date(Date.now() - 1728000000).toISOString(),
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    updatedAt: new Date(Date.now() - 1728000000).toISOString(),
  },
  {
    id: 3,
    code: "SOL003",
    ministryId: 3,
    ministryName: "Ministerio de Niños",
    requesterUserId: 6,
    requesterName: "Rosa González",
    responsibleUserId: 4,
    responsibleName: "Ana Martínez",
    title: "Material did��ctico para niños",
    description:
      "Libros de colorear, juguetes educativos y materiales para las lecciones bíblicas semanales.",
    totalAmount: 1800.0,
    currency: "USD",
    status: SolicitudStatus.EN_REVISION,
    paymentType: PaymentType.TERCEROS,
    paymentDetail: "Pagar a Editorial Infantil Cristiana",
    items: [
      {
        itemNumber: 1,
        description: "Libros de colorear cristianos",
        amount: 600.0,
        quantity: 3,
        unitPrice: 200.0,
      },
      {
        itemNumber: 2,
        description: "Juguetes educativos variados",
        amount: 800.0,
        quantity: 2,
        unitPrice: 400.0,
      },
      {
        itemNumber: 3,
        description: "Material para manualidades",
        amount: 400.0,
        quantity: 1,
        unitPrice: 400.0,
      },
    ],
    attachments: [],
    approvals: [
      {
        id: 3,
        solicitudId: 3,
        approverUserId: 4,
        approverName: "Ana Martínez",
        approvalOrder: 1,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 864000000).toISOString(),
        comments: "Aprobado por pastor de red",
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 864000000).toISOString(),
      },
      {
        id: 4,
        solicitudId: 3,
        approverUserId: 2,
        approverName: "María López",
        approvalOrder: 2,
        status: "pendiente",
        requiredApproval: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    submittedAt: new Date(Date.now() - 1382400000).toISOString(),
    createdAt: new Date(Date.now() - 1382400000).toISOString(),
    updatedAt: new Date(Date.now() - 1382400000).toISOString(),
  },
  {
    id: 4,
    code: "SOL004",
    ministryId: 4,
    ministryName: "Ministerio de Obras Sociales",
    requesterUserId: 5,
    requesterName: "Pedro Sánchez",
    responsibleUserId: 6,
    responsibleName: "Rosa González",
    title: "Kits de alimentos para familias en necesidad",
    description:
      "Distribución de paquetes de alimentos básicos a 30 familias de la comunidad durante el mes.",
    totalAmount: 3200.0,
    currency: "USD",
    status: SolicitudStatus.APROBADO,
    paymentType: PaymentType.TERCEROS,
    paymentDetail: "Pagar a proveedor local de alimentos",
    items: [
      {
        itemNumber: 1,
        description: "Paquetes básicos de alimentos",
        amount: 3200.0,
        quantity: 30,
        unitPrice: 106.67,
      },
    ],
    attachments: [],
    approvals: [
      {
        id: 5,
        solicitudId: 4,
        approverUserId: 6,
        approverName: "Rosa González",
        approvalOrder: 1,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 518400000).toISOString(),
        comments: "Aprobado por responsable de ministerio",
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 518400000).toISOString(),
      },
      {
        id: 6,
        solicitudId: 4,
        approverUserId: 2,
        approverName: "María López",
        approvalOrder: 2,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 518400000).toISOString(),
        comments: "Aprobado por tesorero con observaciones sobre presupuesto",
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 518400000).toISOString(),
      },
    ],
    submittedAt: new Date(Date.now() - 604800000).toISOString(),
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: 5,
    code: "SOL005",
    ministryId: 5,
    ministryName: "Ministerio de Misiones",
    requesterUserId: 6,
    requesterName: "Rosa González",
    responsibleUserId: 3,
    responsibleName: "Carlos Rodríguez",
    title: "Viaje misionero a región rural",
    description:
      "Viaje de evangelismo y construcción de una pequeña capilla en zona rural. Incluye transporte, alojamiento y materiales de construcción.",
    totalAmount: 6500.0,
    currency: "USD",
    status: SolicitudStatus.APROBADO,
    paymentType: PaymentType.TERCEROS,
    paymentDetail: "Pagar a coordinador de misiones",
    items: [
      {
        itemNumber: 1,
        description: "Transporte",
        amount: 2000.0,
        quantity: 1,
        unitPrice: 2000.0,
      },
      {
        itemNumber: 2,
        description: "Alojamiento y comidas",
        amount: 2500.0,
        quantity: 1,
        unitPrice: 2500.0,
      },
      {
        itemNumber: 3,
        description: "Materiales de construcción",
        amount: 2000.0,
        quantity: 1,
        unitPrice: 2000.0,
      },
    ],
    attachments: [],
    approvals: [
      {
        id: 7,
        solicitudId: 5,
        approverUserId: 4,
        approverName: "Ana Martínez",
        approvalOrder: 1,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 345600000).toISOString(),
        comments: "Aprobado por pastor de red",
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: 8,
        solicitudId: 5,
        approverUserId: 3,
        approverName: "Carlos Rodríguez",
        approvalOrder: 2,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 345600000).toISOString(),
        comments: "Aprobado por pastor general - proyecto importante",
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: 9,
        solicitudId: 5,
        approverUserId: 2,
        approverName: "María López",
        approvalOrder: 3,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 345600000).toISOString(),
        comments: "Aprobado por tesorero",
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
      },
    ],
    submittedAt: new Date(Date.now() - 432000000).toISOString(),
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 6,
    code: "SOL006",
    ministryId: 1,
    ministryName: "Ministerio de Alabanza",
    requesterUserId: 5,
    requesterName: "Pedro Sánchez",
    responsibleUserId: 4,
    responsibleName: "Ana Martínez",
    title: "Reparación de instrumentos musicales",
    description:
      "Mantenimiento y reparación de órgano, guitarras y batería de la iglesia.",
    totalAmount: 1200.0,
    currency: "USD",
    status: SolicitudStatus.COMPLETADO,
    paymentType: PaymentType.TERCEROS,
    paymentDetail: "Pagar a taller de reparaciones Harmonia",
    items: [
      {
        itemNumber: 1,
        description: "Reparación y mantenimiento de instrumentos",
        amount: 1200.0,
        quantity: 1,
        unitPrice: 1200.0,
      },
    ],
    attachments: [],
    approvals: [
      {
        id: 10,
        solicitudId: 6,
        approverUserId: 4,
        approverName: "Ana Martínez",
        approvalOrder: 1,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 259200000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 11,
        solicitudId: 6,
        approverUserId: 2,
        approverName: "María López",
        approvalOrder: 2,
        status: "aprobado",
        requiredApproval: true,
        approvalDate: new Date(Date.now() - 259200000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
    workflowSteps: [
      {
        step: WorkflowStep.APROBADO_PASTOR_RED,
        completedAt: new Date(Date.now() - 286200000).toISOString(),
        completedBy: 4,
        completedByName: "Ana Martínez",
        comment: "Aprobado por pastor de red",
      },
      {
        step: WorkflowStep.APROBADO_ADMINISTRACION,
        completedAt: new Date(Date.now() - 259200000).toISOString(),
        completedBy: 2,
        completedByName: "María López",
        comment: "Aprobado por administración",
      },
      {
        step: WorkflowStep.APROBADO_PR_TITULAR,
        completedAt: new Date(Date.now() - 230400000).toISOString(),
        completedBy: 3,
        completedByName: "Carlos Rodríguez",
        comment: "Aprobado por pastor general",
      },
      {
        step: WorkflowStep.ENTREGA_DINERO,
        completedAt: new Date(Date.now() - 201600000).toISOString(),
        completedBy: 2,
        completedByName: "María López",
        comment: "Dinero entregado",
      },
      {
        step: WorkflowStep.SUBIR_COMPROBANTE,
        completedAt: new Date(Date.now() - 172800000).toISOString(),
        completedBy: 5,
        completedByName: "Pedro Sánchez",
        proofOfPaymentStatus: ProofOfPaymentStatus.VALIDADO,
        comment: "Comprobante de pago validado",
      },
    ],
    submittedAt: new Date(Date.now() - 345600000).toISOString(),
    completedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const listSolicitudes: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    const ministryId = req.query.ministryId as string;
    const requesterUserId = req.query.requesterUserId as string;

    let filtered = [...mockSolicitudes];

    if (status) {
      filtered = filtered.filter((s) => s.status === status);
    }
    if (ministryId) {
      filtered = filtered.filter((s) => s.ministryId === parseInt(ministryId));
    }
    if (requesterUserId) {
      filtered = filtered.filter(
        (s) => s.requesterUserId === parseInt(requesterUserId),
      );
    }

    // Sort by most recent first
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedSolicitudes = filtered.slice(start, end);

    const response: PaginatedResponse<Solicitud> = {
      success: true,
      data: paginatedSolicitudes,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch solicitudes",
    });
  }
};

export const getSolicitud: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = mockSolicitudes.find((s) => s.id === parseInt(id));

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        error: "Solicitud not found",
      });
    }

    res.json({
      success: true,
      data: solicitud,
    } as ApiResponse<Solicitud>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch solicitud",
    });
  }
};

export const createSolicitud: RequestHandler = (req, res) => {
  try {
    const {
      ministryId,
      title,
      description,
      responsibleUserId,
      paymentType,
      paymentDetail,
      items,
      currency,
    }: CreateSolicitudRequest = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !ministryId ||
      !responsibleUserId ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const newCode = `SOL${String(mockSolicitudes.length + 1).padStart(3, "0")}`;

    const newSolicitud: Solicitud = {
      id: mockSolicitudes.length + 1,
      code: newCode,
      ministryId,
      requesterUserId: 5, // Mock: current user
      responsibleUserId,
      title,
      description,
      totalAmount,
      currency: currency || "PEN",
      status: SolicitudStatus.BORRADOR,
      paymentType,
      paymentDetail,
      items: items.map((item, idx) => ({ ...item, itemNumber: idx + 1 })),
      attachments: [],
      approvals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSolicitudes.push(newSolicitud);

    res.status(201).json({
      success: true,
      data: newSolicitud,
    } as ApiResponse<Solicitud>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create solicitud",
    });
  }
};

export const updateSolicitud: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      responsibleUserId,
      paymentType,
      paymentDetail,
      items,
    }: UpdateSolicitudRequest = req.body;

    const solicitudIndex = mockSolicitudes.findIndex(
      (s) => s.id === parseInt(id),
    );
    if (solicitudIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Solicitud not found",
      });
    }

    const solicitud = mockSolicitudes[solicitudIndex];

    // Can only edit drafts
    if (solicitud.status !== SolicitudStatus.BORRADOR) {
      return res.status(403).json({
        success: false,
        error: "Can only edit draft solicitudes",
      });
    }

    if (title) solicitud.title = title;
    if (description) solicitud.description = description;
    if (responsibleUserId) solicitud.responsibleUserId = responsibleUserId;
    if (paymentType) solicitud.paymentType = paymentType;
    if (paymentDetail) solicitud.paymentDetail = paymentDetail;
    if (items) {
      solicitud.items = items.map((item, idx) => ({
        ...item,
        itemNumber: idx + 1,
      }));
      solicitud.totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    }
    solicitud.updatedAt = new Date().toISOString();

    mockSolicitudes[solicitudIndex] = solicitud;

    res.json({
      success: true,
      data: solicitud,
    } as ApiResponse<Solicitud>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update solicitud",
    });
  }
};

export const submitSolicitud: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { comments }: SubmitSolicitudRequest = req.body;

    const solicitudIndex = mockSolicitudes.findIndex(
      (s) => s.id === parseInt(id),
    );
    if (solicitudIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Solicitud not found",
      });
    }

    const solicitud = mockSolicitudes[solicitudIndex];

    if (solicitud.status !== SolicitudStatus.BORRADOR) {
      return res.status(400).json({
        success: false,
        error: "Can only submit draft solicitudes",
      });
    }

    solicitud.status = SolicitudStatus.PENDIENTE;
    solicitud.submittedAt = new Date().toISOString();
    solicitud.updatedAt = new Date().toISOString();

    // Add approvals based on amount and ministry
    solicitud.approvals = [
      {
        id: Math.random() * 1000,
        solicitudId: solicitud.id,
        approverUserId: solicitud.responsibleUserId,
        approvalOrder: 1,
        status: "pendiente",
        requiredApproval: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: Math.random() * 1000,
        solicitudId: solicitud.id,
        approverUserId: 2, // Tesorero
        approvalOrder: 2,
        status: "pendiente",
        requiredApproval: solicitud.totalAmount > 5000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockSolicitudes[solicitudIndex] = solicitud;

    res.json({
      success: true,
      data: solicitud,
      message: "Solicitud submitted successfully",
    } as ApiResponse<Solicitud>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit solicitud",
    });
  }
};

export const getDashboardStats: RequestHandler = (req, res) => {
  try {
    const totalSolicitudes = mockSolicitudes.length;
    const pendingSolicitudes = mockSolicitudes.filter((s) =>
      [SolicitudStatus.PENDIENTE, SolicitudStatus.EN_REVISION].includes(
        s.status,
      ),
    ).length;
    const approvedSolicitudes = mockSolicitudes.filter((s) =>
      [SolicitudStatus.APROBADO, SolicitudStatus.COMPLETADO].includes(s.status),
    ).length;
    const totalAmount = mockSolicitudes.reduce(
      (sum, s) => sum + s.totalAmount,
      0,
    );
    const approvedAmount = mockSolicitudes
      .filter((s) =>
        [SolicitudStatus.APROBADO, SolicitudStatus.COMPLETADO].includes(
          s.status,
        ),
      )
      .reduce((sum, s) => sum + s.totalAmount, 0);

    res.json({
      success: true,
      data: {
        totalSolicitudes,
        pendingSolicitudes,
        approvedSolicitudes,
        totalAmount,
        approvedAmount,
        ministries: 5,
        users: 6,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard stats",
    });
  }
};
