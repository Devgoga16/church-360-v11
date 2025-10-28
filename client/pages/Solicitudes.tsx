import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Solicitud, SolicitudStatus } from "@shared/api";
import { Plus, Search, Filter, ChevronRight } from "lucide-react";

const statusOptions: Array<{ value: SolicitudStatus; label: string }> = [
  { value: SolicitudStatus.BORRADOR, label: "Borrador" },
  { value: SolicitudStatus.PENDIENTE, label: "Pendiente" },
  { value: SolicitudStatus.EN_REVISION, label: "En Revisión" },
  { value: SolicitudStatus.APROBADO_PARCIAL, label: "Aprobado Parcial" },
  { value: SolicitudStatus.APROBADO, label: "Aprobado" },
  { value: SolicitudStatus.RECHAZADO, label: "Rechazado" },
  { value: SolicitudStatus.COMPLETADO, label: "Completado" },
  { value: SolicitudStatus.CANCELADO, label: "Cancelado" },
];

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SolicitudStatus | "">(
    ""
  );
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setSelectedStatus(statusParam as SolicitudStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        let url = "/api/solicitudes?pageSize=100";
        if (selectedStatus) {
          url += `&status=${selectedStatus}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setSolicitudes(data.data);
        }
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [selectedStatus]);

  useEffect(() => {
    let filtered = solicitudes;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(term) ||
          s.title.toLowerCase().includes(term) ||
          s.ministryName?.toLowerCase().includes(term)
      );
    }

    setFilteredSolicitudes(filtered);
  }, [solicitudes, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#050A30] dark:text-white">
              Solicitudes Financieras
            </h1>
            <p className="text-[#173747] dark:text-slate-400 mt-1">
              Gestiona y da seguimiento a todas las solicitudes
            </p>
          </div>
          <Link
            to="/solicitudes/nueva"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Nueva Solicitud
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código, título o ministerio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as SolicitudStatus | "")
              }
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
            >
              <option value="">Todos los estados</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Solicitudes List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-800 rounded-lg h-20 animate-pulse"
              />
            ))}
          </div>
        ) : filteredSolicitudes.length > 0 ? (
          <div className="space-y-3">
            {filteredSolicitudes.map((solicitud) => (
              <Link
                key={solicitud.id}
                to={`/solicitudes/${solicitud.id}`}
                className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 md:p-6 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div>
                        <h3 className="font-bold text-[#050A30] dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                          {solicitud.title}
                        </h3>
                        <p className="text-sm text-[#173747] dark:text-slate-400">
                          {solicitud.code} • {solicitud.ministryName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#173747] dark:text-slate-400 line-clamp-1">
                      {solicitud.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="font-bold text-[#050A30] dark:text-white">
                        {formatCurrency(solicitud.totalAmount)}
                      </p>
                      <p className="text-xs text-[#173747] dark:text-slate-400">
                        {formatDate(solicitud.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={solicitud.status} />
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {searchTerm || selectedStatus
                ? "No se encontraron solicitudes"
                : "Aún no hay solicitudes"}
            </p>
            {!searchTerm && !selectedStatus && (
              <Link
                to="/solicitudes/nueva"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Plus className="h-5 w-5" />
                Crear la primera solicitud
              </Link>
            )}
          </div>
        )}

        {/* Stats Summary */}
        {filteredSolicitudes.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Resumen
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total de Solicitudes
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredSolicitudes.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monto Total
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(
                    filteredSolicitudes.reduce((sum, s) => sum + s.totalAmount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Aprobadas
                </p>
                <p className="text-2xl font-bold text-success">
                  {filteredSolicitudes.filter((s) =>
                    [SolicitudStatus.APROBADO, SolicitudStatus.COMPLETADO].includes(
                      s.status
                    )
                  ).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-warning">
                  {filteredSolicitudes.filter((s) =>
                    [SolicitudStatus.PENDIENTE, SolicitudStatus.EN_REVISION].includes(
                      s.status
                    )
                  ).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
