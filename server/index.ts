import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login } from "./routes/auth";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./routes/users";
import { listMinistries, getMinistry } from "./routes/ministries";
import {
  listSolicitudes,
  getSolicitud,
  createSolicitud,
  updateSolicitud,
  submitSolicitud,
  getDashboardStats,
} from "./routes/solicitudes";
import {
  approveSolicitud,
  rejectSolicitud,
  getApprovals,
} from "./routes/approvals";
import {
  listModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
} from "./routes/modules";
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from "./routes/roles";
import {
  listOptions,
  getOption,
  createOption,
  updateOption,
  deleteOption,
} from "./routes/options";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // DEMO ROUTES
  // ============================================================================

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ============================================================================
  // AUTH ROUTES
  // ============================================================================

  app.post("/api/auth/login", login);

  // ============================================================================
  // USERS ROUTES
  // ============================================================================

  app.get("/api/users", listUsers);
  app.get("/api/users/:id", getUser);
  app.post("/api/users", createUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);

  // ============================================================================
  // MINISTRIES ROUTES
  // ============================================================================

  app.get("/api/ministries", listMinistries);
  app.get("/api/ministries/:id", getMinistry);

  // ============================================================================
  // SOLICITUDES (FINANCIAL REQUESTS) ROUTES
  // ============================================================================

  // Dashboard route must come BEFORE parameterized routes
  app.get("/api/solicitudes/dashboard/stats", getDashboardStats);

  // Then all parameterized and general routes
  app.get("/api/solicitudes", listSolicitudes);
  app.get("/api/solicitudes/:id", getSolicitud);
  app.post("/api/solicitudes", createSolicitud);
  app.put("/api/solicitudes/:id", updateSolicitud);
  app.post("/api/solicitudes/:id/submit", submitSolicitud);

  // ============================================================================
  // APPROVALS ROUTES
  // ============================================================================

  app.post("/api/solicitudes/:solicitudId/approve", approveSolicitud);
  app.post("/api/solicitudes/:solicitudId/reject", rejectSolicitud);
  app.get("/api/solicitudes/:solicitudId/approvals", getApprovals);

  return app;
}
