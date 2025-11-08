import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Solicitud, DashboardStats, SolicitudStatus } from "@shared/api";
import { TrendingUp, FileText, Users, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSolicitudes, setRecentSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await fetch("/api/solicitudes/dashboard/stats");
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch recent solicitudes
        const solicitudesResponse = await fetch("/api/solicitudes?pageSize=5");
        const solicitudesData = await solicitudesResponse.json();
        if (solicitudesData.success) {
          setRecentSolicitudes(solicitudesData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#050A30] dark:text-white">
            Bienvenido a Iglesia 360
          </h1>
          <p className="text-[#173747] dark:text-slate-400">
            Sistema integral de gestión de solicitudes financieras
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-800 rounded-lg h-24"
              />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total de Solicitudes"
              value={stats.totalSolicitudes}
              icon={<FileText className="h-6 w-6" />}
            />
            <StatCard
              title="Pendientes de Aprobación"
              value={stats.pendingSolicitudes}
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <StatCard
              title="Aprobadas"
              value={stats.approvedSolicitudes}
              icon={<FileText className="h-6 w-6" />}
            />
            <StatCard
              title="Monto Total Solicitado"
              value={formatCurrency(stats.totalAmount)}
              icon={<DollarSign className="h-6 w-6" />}
            />
          </div>
        ) : null}

        {/* Recent Solicitudes Section */}
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#050A30] dark:text-white">
                Solicitudes Recientes
              </h2>
              <Link
                to="/solicitudes"
                className="flex items-center gap-2 text-[#042D62] hover:text-[#042D62]/80 font-medium text-sm transition-colors"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentSolicitudes.length > 0 ? (
                  recentSolicitudes.map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/solicitudes/${solicitud.id}`}
                          className="font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          {solicitud.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#173747] dark:text-slate-300 line-clamp-1">
                          {solicitud.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-[#050A30] dark:text-white">
                          {formatCurrency(solicitud.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={solicitud.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-[#173747] dark:text-slate-400">
                        {new Date(solicitud.createdAt).toLocaleDateString("es-ES")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No hay solicitudes aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/solicitudes/nueva"
            className="group bg-[#042D62] text-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#042D62]/90"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Nueva Solicitud</h3>
              <div className="bg-white/15 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="text-white/80 text-sm">
              Crear una nueva solicitud financiera
            </p>
          </Link>

          <Link
            to="/solicitudes?status=pendiente"
            className="group bg-white dark:bg-slate-900 border border-[#042D62]/20 text-[#042D62] dark:text-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#042D62]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Pendientes de Aprobación</h3>
              <div className="bg-[#042D62]/10 p-2 rounded-lg group-hover:bg-[#042D62]/15 transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[#042D62]/70 dark:text-white/70 text-sm">
              Revisar solicitudes que necesitan aprobación
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
