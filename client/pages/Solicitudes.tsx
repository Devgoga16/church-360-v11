import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Solicitud, SolicitudStatus } from "@shared/api";
import { Plus, Search, Filter, ChevronRight, Grid, Table } from "lucide-react";

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
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SolicitudStatus | "">(
    "",
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
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
          s.ministryName?.toLowerCase().includes(term),
      );
    }

    setFilteredSolicitudes(filtered);
  }, [solicitudes, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#050A30] dark:text-white">
              Solicitudes Financieras
            </h1>
            <p className="text-xs md:text-sm text-[#173747] dark:text-slate-400 mt-1">
              Gestiona y da seguimiento a todas las solicitudes
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Vista de tarjetas"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Vista de tabla"
              >
                <Table className="h-5 w-5" />
              </button>
            </div>
            <Link
              to="/solicitudes/nueva"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Nueva Solicitud
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código, título o ministerio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white placeholder-slate-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as SolicitudStatus | "")
              }
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white"
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
          viewMode === "grid" ? (
            <div className="space-y-2">
              {filteredSolicitudes.map((solicitud) => (
                <Link
                  key={solicitud.id}
                  to={`/solicitudes/${solicitud.id}`}
                  className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 md:p-4 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1.5">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm md:text-base text-[#050A30] dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                            {solicitud.title}
                          </h3>
                          <p className="text-xs text-[#173747] dark:text-slate-400">
                            {solicitud.code} • {solicitud.ministryName}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#173747] dark:text-slate-400 line-clamp-1">
                        {solicitud.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
                      <div className="text-right">
                        <p className="font-bold text-sm md:text-base text-[#050A30] dark:text-white">
                          {formatCurrency(solicitud.totalAmount)}
                        </p>
                        <p className="text-xs text-[#173747] dark:text-slate-400">
                          {formatDate(solicitud.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={solicitud.status} />
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">
                      Código
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">
                      Título
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">
                      Ministerio
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">
                      Monto
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">
                      Fecha
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-900 dark:text-white">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredSolicitudes.map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => {
                        window.location.href = `/solicitudes/${solicitud.id}`;
                      }}
                    >
                      <td className="px-3 py-2 font-medium text-[#042D62] dark:text-primary">
                        {solicitud.code}
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-white">
                        <div className="line-clamp-1">{solicitud.title}</div>
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                        {solicitud.ministryName}
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white text-right">
                        {formatCurrency(solicitud.totalAmount)}
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                        {formatDate(solicitud.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <StatusBadge status={solicitud.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white mb-3">
              Resumen
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Total de Solicitudes
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {filteredSolicitudes.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Monto Total
                </p>
                <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(
                    filteredSolicitudes.reduce(
                      (sum, s) => sum + s.totalAmount,
                      0,
                    ),
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Aprobadas
                </p>
                <p className="text-lg md:text-xl font-bold text-success">
                  {
                    filteredSolicitudes.filter((s) =>
                      [
                        SolicitudStatus.APROBADO,
                        SolicitudStatus.COMPLETADO,
                      ].includes(s.status),
                    ).length
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pendientes
                </p>
                <p className="text-lg md:text-xl font-bold text-warning">
                  {
                    filteredSolicitudes.filter((s) =>
                      [
                        SolicitudStatus.PENDIENTE,
                        SolicitudStatus.EN_REVISION,
                      ].includes(s.status),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
