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
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#050A30] dark:text-white">
            Bienvenido a Iglesia 360
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sistema integral de gestión de solicitudes financieras
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-800 rounded-xl h-24"
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

        {/* Quick Actions Buttons */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#050A30] dark:text-white uppercase tracking-widest mb-4 pl-0.5">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/solicitudes/nueva"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#042D62] text-white rounded-lg hover:bg-[#042D62]/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <FileText className="h-4 w-4" />
              Nueva Solicitud
            </Link>
            <Link
              to="/solicitudes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-sm font-medium"
            >
              Ver todas
            </Link>
            <Link
              to="/solicitudes?status=pendiente"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-sm font-medium"
            >
              Pendientes
            </Link>
            <Link
              to="/solicitudes?status=aprobado"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-sm font-medium"
            >
              Aprobadas
            </Link>
          </div>
        </div>

        {/* Recent Solicitudes Section */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6">
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
          <div className="border-t border-slate-200 dark:border-slate-800"></div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentSolicitudes.length > 0 ? (
                  recentSolicitudes.map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <Link
                          to={`/solicitudes/${solicitud.id}`}
                          className="font-semibold text-[#042D62] hover:text-[#042D62]/80 transition-colors text-sm"
                        >
                          {solicitud.code}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
                          {solicitud.title}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {formatCurrency(solicitud.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={solicitud.status} />
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">
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
      </div>
    </Layout>
  );
}
