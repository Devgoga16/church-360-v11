import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Solicitudes",
    icon: FileText,
    href: "/solicitudes",
  },
  {
    label: "Usuarios",
    icon: Users,
    href: "/usuarios",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/configuracion",
  },
];

export function Sidebar({ isOpen = true, onClose, isCollapsed = false }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300 ease-in-out z-40 md:relative md:top-0 flex flex-col shadow-sm",
          isCollapsed ? "w-20" : "w-64",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className={cn(
          "flex-1 py-8 space-y-1",
          isCollapsed ? "px-2" : "px-3"
        )}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-[#042D62] text-white shadow-md shadow-[#042D62]/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-[#042D62] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                  active ? "text-white" : "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn(
          "border-t border-slate-200 dark:border-slate-800 space-y-2",
          isCollapsed ? "px-2 py-6" : "px-3 py-6"
        )}>
          <button
            title={isCollapsed ? "Cerrar Sesión" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 font-medium group",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
