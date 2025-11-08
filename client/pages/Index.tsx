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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#050A30] dark:text-white">
                Solicitudes Recientes
              </h2>
              <Link
                to="/solicitudes"
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#BFE4F9] dark:bg-slate-800 border-b border-[#BFE4F9] dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#050A30] dark:text-slate-300">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#050A30] dark:text-slate-300">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#050A30] dark:text-slate-300">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#050A30] dark:text-slate-300">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#050A30] dark:text-slate-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/solicitudes/nueva"
            className="group bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nueva Solicitud</h3>
              <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Crear una nueva solicitud financiera para tu ministerio
            </p>
          </Link>

          <Link
            to="/solicitudes?status=pendiente"
            className="group bg-gradient-to-br from-warning to-warning/80 text-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Pendientes de Aprobación</h3>
              <div className="bg-slate-900/20 p-3 rounded-lg group-hover:bg-slate-900/30 transition-colors">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <p className="text-slate-900/90 text-sm">
              Revisar solicitudes que necesitan tu aprobación
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
