/**
 * Iglesia 360 - Shared API Types
 * Used by both client and server for type-safe communication
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  ADMIN = "admin",
  TESORERO = "tesorero",
  PASTOR_GENERAL = "pastor_general",
  PASTOR_RED = "pastor_red",
  USUARIO = "usuario",
}

export enum SolicitudStatus {
  BORRADOR = "borrador",
  PENDIENTE = "pendiente",
  EN_REVISION = "en_revision",
  APROBADO_PARCIAL = "aprobado_parcial",
  APROBADO = "aprobado",
  RECHAZADO = "rechazado",
  COMPLETADO = "completado",
  CANCELADO = "cancelado",
}

export enum ApprovalStatus {
  PENDIENTE = "pendiente",
  APROBADO = "aprobado",
  RECHAZADO = "rechazado",
}

export enum PaymentType {
  UNO_MISMO = "uno_mismo",
  TERCEROS = "terceros",
}

export enum DocumentType {
  COMPROBANTE = "comprobante",
  PRESUPUESTO = "presupuesto",
  OTRO = "otro",
}

// ============================================================================
// MODULE, ROLE, AND OPTION TYPES
// ============================================================================

export interface Module {
  _id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleRequest {
  nombre: string;
  descripcion: string;
  orden: number;
  activo?: boolean;
}

export interface UpdateModuleRequest {
  nombre?: string;
  descripcion?: string;
  orden?: number;
  activo?: boolean;
}

export interface Role {
  _id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  nombre: string;
  icono: string;
  descripcion: string;
  activo?: boolean;
}

export interface UpdateRoleRequest {
  nombre?: string;
  icono?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Option {
  _id: string;
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
  module: string | Module;
  roles: string[] | Role[];
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOptionRequest {
  nombre: string;
  ruta: string;
  icono?: string;
  orden?: number;
  module: string;
  roles: string[];
  activo?: boolean;
}

export interface UpdateOptionRequest {
  nombre?: string;
  ruta?: string;
  icono?: string;
  orden?: number;
  module?: string;
  roles?: string[];
  activo?: boolean;
}

export enum WorkflowStep {
  APROBADO_PASTOR_RED = "aprobado_pastor_red",
  APROBADO_ADMINISTRACION = "aprobado_administracion",
  APROBADO_PR_TITULAR = "aprobado_pr_titular",
  ENTREGA_DINERO = "entrega_dinero",
  SUBIR_COMPROBANTE = "subir_comprobante",
}

export enum ProofOfPaymentStatus {
  SUBIDO = "subido",
  PENDIENTE_VALIDAR = "pendiente_validar",
  VALIDADO = "validado",
  ERROR = "error",
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  status: "active" | "inactive" | "suspended";
  roles: UserRole[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  roles?: UserRole[];
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  status?: "active" | "inactive" | "suspended";
  roles?: UserRole[];
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  phone?: string;
  status: "active" | "inactive" | "suspended";
  roles: UserRole[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// MINISTRY TYPES
// ============================================================================

export interface Ministry {
  id: number;
  code: string;
  name: string;
  description?: string;
  responsibleUserId: number;
  budgetLimit: number;
  currency: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateMinistryRequest {
  code: string;
  name: string;
  description?: string;
  responsibleUserId: number;
  budgetLimit?: number;
  currency?: string;
}

// ============================================================================
// SOLICITUD (FINANCIAL REQUEST) TYPES
// ============================================================================

export interface SolicitudItem {
  id?: number;
  itemNumber: number;
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
}

export interface SolicitudAttachment {
  id: number;
  fileName: string;
  fileType?: string;
  fileSize: number;
  filePath: string;
  uploadedBy: number;
  uploadedByName?: string;
  documentType: DocumentType;
  uploadedAt: string;
}

export interface WorkflowStepRecord {
  step: WorkflowStep;
  completedAt?: string;
  completedBy?: number;
  completedByName?: string;
  proofOfPaymentStatus?: ProofOfPaymentStatus;
  comment?: string;
}

export interface Solicitud {
  id: number;
  code: string;
  ministryId: number;
  ministryName?: string;
  requesterUserId: number;
  requesterName?: string;
  responsibleUserId: number;
  responsibleName?: string;
  title: string;
  description: string;
  totalAmount: number;
  currency: string;
  status: SolicitudStatus;
  paymentType: PaymentType;
  paymentDetail?: string;
  requesterComments?: string;
  rejectionReason?: string;
  items: SolicitudItem[];
  attachments: SolicitudAttachment[];
  approvals: ApprovalInfo[];
  workflowSteps?: WorkflowStepRecord[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  completedAt?: string;
}

export interface CreateSolicitudRequest {
  ministryId: number;
  title: string;
  description: string;
  responsibleUserId: number;
  paymentType: PaymentType;
  paymentDetail?: string;
  items: Omit<SolicitudItem, "id">[];
  currency?: string;
}

export interface UpdateSolicitudRequest {
  title?: string;
  description?: string;
  responsibleUserId?: number;
  paymentType?: PaymentType;
  paymentDetail?: string;
  items?: Omit<SolicitudItem, "id">[];
  requesterComments?: string;
}

export interface SubmitSolicitudRequest {
  comments?: string;
}

// ============================================================================
// APPROVAL TYPES
// ============================================================================

export interface ApprovalInfo {
  id: number;
  solicitudId: number;
  approverUserId: number;
  approverName?: string;
  approvalOrder: number;
  status: ApprovalStatus;
  requiredApproval: boolean;
  approvalDate?: string;
  comments?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveRequest {
  comments?: string;
}

export interface RejectRequest {
  rejectionReason: string;
  comments?: string;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  id: number;
  solicitudId: number;
  userId: number;
  userName?: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  comment?: string;
  ipAddress?: string;
  createdAt: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: number;
  userId: number;
  solicitudId?: number;
  type: string;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalSolicitudes: number;
  pendingSolicitudes: number;
  approvedSolicitudes: number;
  totalAmount: number;
  approvedAmount: number;
  ministries: number;
  users: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentSolicitudes: Solicitud[];
  userRole: UserRole;
  notifications: Notification[];
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DemoResponse {
  message: string;
}
