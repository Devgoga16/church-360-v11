import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Solicitudes from "./pages/Solicitudes";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import SolicitudDetalle from "./pages/SolicitudDetalle";
import Soporte from "./pages/Soporte";
import Roles from "./pages/Configuracion/Roles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solicitudes"
              element={
                <ProtectedRoute>
                  <Solicitudes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solicitudes/nueva"
              element={
                <ProtectedRoute>
                  <NuevaSolicitud />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solicitudes/:id"
              element={
                <ProtectedRoute>
                  <SolicitudDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion/roles"
              element={
                <ProtectedRoute>
                  <Roles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/soporte"
              element={
                <ProtectedRoute>
                  <Soporte />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Handle HMR in development by storing root reference globally
let root: Root;
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

if (!(window as any).__root) {
  root = createRoot(rootElement);
  (window as any).__root = root;
} else {
  root = (window as any).__root;
}

root.render(<App />);
