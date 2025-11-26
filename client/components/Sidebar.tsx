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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  icon: React.ComponentType<any>;
  modules: ModuleItem[];
}

const roleStructure: RoleItem[] = [
  {
    label: "Administrador",
    icon: Settings,
    modules: [
      {
        label: "Configuración General",
        items: [
          { label: "Parámetros del Sistema", icon: Settings, href: "/admin/config/parameters" },
          { label: "Datos de la Iglesia", icon: Church, href: "/admin/config/church-data" },
          { label: "Respaldos", icon: ClipboardCheck, href: "/admin/config/backups" },
        ],
      },
      {
        label: "Gestión de Usuarios",
        items: [
          { label: "Lista de Usuarios", icon: Users, href: "/admin/users/list" },
          { label: "Roles y Permisos", icon: Settings, href: "/admin/users/roles" },
          { label: "Auditoría de Acceso", icon: BarChart3, href: "/admin/users/audit" },
        ],
      },
      {
        label: "Reportes",
        items: [
          { label: "Actividad del Sistema", icon: BarChart3, href: "/admin/reports/activity" },
          { label: "Estadísticas de Usuarios", icon: Users, href: "/admin/reports/users" },
          { label: "Exportar Datos", icon: ClipboardCheck, href: "/admin/reports/export" },
        ],
      },
    ],
  },
  {
    label: "Tesorero",
    icon: DollarSign,
    modules: [
      {
        label: "Finanzas",
        items: [
          { label: "Ingresos", icon: DollarSign, href: "/treasurer/finance/income" },
          { label: "Egresos", icon: DollarSign, href: "/treasurer/finance/expenses" },
          { label: "Estado Bancario", icon: BarChart3, href: "/treasurer/finance/bank-status" },
        ],
      },
      {
        label: "Presupuestos",
        items: [
          { label: "Crear Presupuesto", icon: PieChart, href: "/treasurer/budgets/create" },
          { label: "Ver Presupuestos", icon: PieChart, href: "/treasurer/budgets/view" },
          { label: "Comparativas", icon: BarChart3, href: "/treasurer/budgets/compare" },
        ],
      },
      {
        label: "Auditoría",
        items: [
          { label: "Registro de Transacciones", icon: ClipboardCheck, href: "/treasurer/audit/transactions" },
          { label: "Reconciliación", icon: BarChart3, href: "/treasurer/audit/reconciliation" },
          { label: "Reportes de Auditoría", icon: BarChart3, href: "/treasurer/audit/reports" },
        ],
      },
    ],
  },
  {
    label: "Pastor Principal",
    icon: Church,
    modules: [
      {
        label: "Ministerios",
        items: [
          { label: "Lista de Ministerios", icon: Heart, href: "/pastor/ministries/list" },
          { label: "Crear Ministerio", icon: Heart, href: "/pastor/ministries/create" },
          { label: "Actividades", icon: BookOpen, href: "/pastor/ministries/activities" },
        ],
      },
      {
        label: "Predicaciones",
        items: [
          { label: "Programar Predicación", icon: BookOpen, href: "/pastor/sermons/schedule" },
          { label: "Historial de Mensajes", icon: BookOpen, href: "/pastor/sermons/history" },
          { label: "Temas y Pasajes", icon: BookOpen, href: "/pastor/sermons/themes" },
        ],
      },
      {
        label: "Miembros",
        items: [
          { label: "Directorio de Miembros", icon: Users, href: "/pastor/members/directory" },
          { label: "Seguimiento Pastoral", icon: Heart, href: "/pastor/members/follow-up" },
          { label: "Grupos Pequeños", icon: Users, href: "/pastor/members/groups" },
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
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    Administrador: true,
  });
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

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
          isCollapsed ? "w-20" : "w-72",
          !isOpen && "-translate-x-full md:translate-x-0",
        )}
      >
        <nav className={cn("flex-1 overflow-y-auto", isCollapsed ? "px-2" : "px-3 py-6")}>
          {roleStructure.map((role) => (
            <div key={role.label} className="mb-2">
              <button
                onClick={() => !isCollapsed && toggleRole(role.label)}
                disabled={isCollapsed}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  expandedRoles[role.label]
                    ? "bg-[#042D62] text-white shadow-md shadow-[#042D62]/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
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
                        "h-3 w-3 transition-transform duration-200 flex-shrink-0",
                        expandedRoles[role.label] ? "rotate-0" : "-rotate-90",
                      )}
                    />
                  </>
                )}
              </button>

              {!isCollapsed && expandedRoles[role.label] && (
                <div className="mt-1 ml-2 border-l-2 border-slate-200 dark:border-slate-700 pl-0">
                  {role.modules.map((module) => (
                    <div key={module.label} className="mb-1">
                      <button
                        onClick={() => toggleModule(module.label)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                          expandedModules[module.label]
                            ? "bg-slate-100 dark:bg-slate-800 text-[#042D62] dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        )}
                      >
                        <span className="flex-1 text-left">{module.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-2.5 w-2.5 transition-transform duration-200 flex-shrink-0",
                            expandedModules[module.label] ? "rotate-0" : "-rotate-90",
                          )}
                        />
                      </button>

                      {expandedModules[module.label] && (
                        <div className="mt-1 ml-2 border-l-2 border-slate-200 dark:border-slate-700 pl-0 space-y-1">
                          {module.items.map((item) => {
                            const active = isActive(item.href);
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all duration-200 group",
                                  active
                                    ? "bg-[#042D62] text-white shadow-md shadow-[#042D62]/20"
                                    : "text-slate-600 dark:text-slate-400 hover:text-[#042D62] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                                )}
                              >
                                <span className="flex-1 text-left">{item.label}</span>
                                {active && <ChevronRight className="h-2.5 w-2.5 ml-auto flex-shrink-0" />}
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
          ))}
        </nav>

        <div
          className={cn(
            "border-t border-slate-200 dark:border-slate-800",
            isCollapsed ? "px-2 py-6 flex flex-col items-center" : "px-3 py-6",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400",
              isCollapsed && "flex-col gap-1",
            )}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#042D62]"></span>
            <span title={isCollapsed ? "Administrador" : undefined}>
              {isCollapsed ? "Admin" : "Administrador"}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
