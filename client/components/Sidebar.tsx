import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Users,
  BarChart3,
  DollarSign,
  PieChart,
  ClipboardCheck,
  Church,
  BookOpen,
  Heart,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface ModuleItem {
  label: string;
  items: MenuItem[];
}

interface RoleItem {
  label: string;
  id: string;
  icon: React.ComponentType<any>;
  modules: ModuleItem[];
}

const roleStructure: RoleItem[] = [
  {
    label: "Administrador",
    id: "admin",
    icon: Settings,
    modules: [
      {
        label: "Configuración General",
        items: [
          {
            label: "Parámetros del Sistema",
            icon: Settings,
            href: "/admin/config/parameters",
          },
          {
            label: "Datos de la Iglesia",
            icon: Church,
            href: "/admin/config/church-data",
          },
          {
            label: "Respaldos",
            icon: ClipboardCheck,
            href: "/admin/config/backups",
          },
        ],
      },
      {
        label: "Gestión de Usuarios",
        items: [
          {
            label: "Lista de Usuarios",
            icon: Users,
            href: "/admin/users/list",
          },
          {
            label: "Roles y Permisos",
            icon: Settings,
            href: "/admin/users/roles",
          },
          {
            label: "Auditoría de Acceso",
            icon: BarChart3,
            href: "/admin/users/audit",
          },
        ],
      },
      {
        label: "Reportes",
        items: [
          {
            label: "Actividad del Sistema",
            icon: BarChart3,
            href: "/admin/reports/activity",
          },
          {
            label: "Estadísticas de Usuarios",
            icon: Users,
            href: "/admin/reports/users",
          },
          {
            label: "Exportar Datos",
            icon: ClipboardCheck,
            href: "/admin/reports/export",
          },
        ],
      },
    ],
  },
  {
    label: "Tesorero",
    id: "tesorero",
    icon: DollarSign,
    modules: [
      {
        label: "Finanzas",
        items: [
          {
            label: "Ingresos",
            icon: DollarSign,
            href: "/treasurer/finance/income",
          },
          {
            label: "Egresos",
            icon: DollarSign,
            href: "/treasurer/finance/expenses",
          },
          {
            label: "Estado Bancario",
            icon: BarChart3,
            href: "/treasurer/finance/bank-status",
          },
        ],
      },
      {
        label: "Presupuestos",
        items: [
          {
            label: "Crear Presupuesto",
            icon: PieChart,
            href: "/treasurer/budgets/create",
          },
          {
            label: "Ver Presupuestos",
            icon: PieChart,
            href: "/treasurer/budgets/view",
          },
          {
            label: "Comparativas",
            icon: BarChart3,
            href: "/treasurer/budgets/compare",
          },
        ],
      },
      {
        label: "Auditoría",
        items: [
          {
            label: "Registro de Transacciones",
            icon: ClipboardCheck,
            href: "/treasurer/audit/transactions",
          },
          {
            label: "Reconciliación",
            icon: BarChart3,
            href: "/treasurer/audit/reconciliation",
          },
          {
            label: "Reportes de Auditoría",
            icon: BarChart3,
            href: "/treasurer/audit/reports",
          },
        ],
      },
    ],
  },
  {
    label: "Pastor Principal",
    id: "pastor_general",
    icon: Church,
    modules: [
      {
        label: "Ministerios",
        items: [
          {
            label: "Lista de Ministerios",
            icon: Heart,
            href: "/pastor/ministries/list",
          },
          {
            label: "Crear Ministerio",
            icon: Heart,
            href: "/pastor/ministries/create",
          },
          {
            label: "Actividades",
            icon: BookOpen,
            href: "/pastor/ministries/activities",
          },
        ],
      },
      {
        label: "Predicaciones",
        items: [
          {
            label: "Programar Predicación",
            icon: BookOpen,
            href: "/pastor/sermons/schedule",
          },
          {
            label: "Historial de Mensajes",
            icon: BookOpen,
            href: "/pastor/sermons/history",
          },
          {
            label: "Temas y Pasajes",
            icon: BookOpen,
            href: "/pastor/sermons/themes",
          },
        ],
      },
      {
        label: "Miembros",
        items: [
          {
            label: "Directorio de Miembros",
            icon: Users,
            href: "/pastor/members/directory",
          },
          {
            label: "Seguimiento Pastoral",
            icon: Heart,
            href: "/pastor/members/follow-up",
          },
          {
            label: "Grupos Pequeños",
            icon: Users,
            href: "/pastor/members/groups",
          },
        ],
      },
    ],
  },
];

export function Sidebar({
  isOpen = true,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    Administrador: true,
  });
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  const filteredRoles = roleStructure.filter(
    (role) => user?.roles.includes(role.id)
  );

  const isActive = (href: string) => location.pathname === href;

  const toggleRole = (roleName: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleName]: !prev[roleName],
    }));
  };

  const toggleModule = (moduleName: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300 ease-in-out z-40 md:relative md:top-0 flex flex-col shadow-sm",
          isCollapsed ? "w-20" : "w-56 sm:w-64 md:w-72",
          !isOpen && "-translate-x-full md:translate-x-0",
        )}
      >
        <nav
          className={cn(
            "flex-1 overflow-y-auto",
            isCollapsed ? "px-2 py-6" : "px-3 sm:px-4 py-6 sm:py-8",
          )}
        >
          {filteredRoles.map((role) => {
            const isSingleRole = filteredRoles.length === 1;
            const showModules =
              isSingleRole || expandedRoles[role.label];

            return (
              <div key={role.label} className={isSingleRole ? "" : "mb-6"}>
                {!isSingleRole && (
                  <button
                    onClick={() => !isCollapsed && toggleRole(role.label)}
                    disabled={isCollapsed}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
                      expandedRoles[role.label]
                        ? "bg-[#042D62] text-white shadow-md shadow-[#042D62]/20"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm",
                      isCollapsed && "flex justify-center",
                    )}
                    title={isCollapsed ? role.label : undefined}
                  >
                    <role.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{role.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-2 w-2 transition-transform duration-200 flex-shrink-0",
                            expandedRoles[role.label]
                              ? "rotate-0"
                              : "-rotate-90",
                          )}
                        />
                      </>
                    )}
                  </button>
                )}

                {!isCollapsed && showModules && (
                  <div
                    className={cn(
                      isSingleRole
                        ? "space-y-2"
                        : "mt-3 ml-1 space-y-2 border-l-2 border-slate-300 dark:border-slate-600 pl-3",
                    )}
                  >
                    {role.modules.map((module) => (
                      <div key={module.label} className="">
                        <button
                          onClick={() => toggleModule(module.label)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
                            expandedModules[module.label]
                              ? "bg-slate-100 dark:bg-slate-800 text-[#042D62] dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300",
                          )}
                        >
                          <span className="flex-1 text-left">
                            {module.label}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-2.5 w-2.5 transition-transform duration-200 flex-shrink-0",
                              expandedModules[module.label]
                                ? "rotate-0"
                                : "-rotate-90",
                            )}
                          />
                        </button>

                        {expandedModules[module.label] && (
                          <div
                            className={cn(
                              isSingleRole
                                ? "mt-2 ml-2 space-y-1.5 border-l border-slate-300 dark:border-slate-600 pl-3"
                                : "mt-2 ml-2 space-y-1.5 border-l border-slate-300 dark:border-slate-600 pl-3",
                            )}
                          >
                            {module.items.map((item) => {
                              const active = isActive(item.href);
                              return (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={onClose}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all duration-200 group",
                                    active
                                      ? "bg-[#042D62] text-white shadow-md shadow-[#042D62]/20"
                                      : "text-slate-600 dark:text-slate-400 hover:text-[#042D62] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm",
                                  )}
                                >
                                  <span className="flex-1 text-left">
                                    {item.label}
                                  </span>
                                  {active && (
                                    <ChevronRight className="h-2.5 w-2.5 ml-auto flex-shrink-0" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={cn(
            "border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30",
            isCollapsed ? "px-2 py-6 flex flex-col items-center" : "px-4 py-6",
          )}
        >
          <Link
            to="/soporte"
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-[#042D62] dark:hover:text-blue-400 transition-colors",
              isCollapsed && "flex-col gap-1 w-full justify-center",
            )}
            title={isCollapsed ? "Soporte" : undefined}
          >
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Soporte</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
