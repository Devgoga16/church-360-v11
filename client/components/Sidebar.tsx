import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getIconFromFontAwesome } from "@/lib/icon-mapping";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({
  isOpen = true,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const location = useLocation();
  const { permisos } = useAuth();
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  if (!permisos || permisos.length === 0) {
    return null;
  }

  const isActive = (href: string) => location.pathname === href;

  const toggleRole = (roleId: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Initialize expanded state for all roles on first render
  if (permisos.length > 0 && Object.keys(expandedRoles).length === 0) {
    const initialExpanded = permisos.reduce(
      (acc, perm) => {
        acc[perm.rol._id] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setExpandedRoles(initialExpanded);
  }

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
          {permisos.map((permission) => {
            const roleId = permission.rol._id;
            const roleName = permission.rol.nombre;
            const RoleIcon = getIconFromFontAwesome(permission.rol.icono);
            const showModules = expandedRoles[roleId];
            const sortedModules = [...permission.modulos].sort(
              (a, b) => a.module.orden - b.module.orden,
            );

            return (
              <div key={roleId} className="mb-6">
                <button
                  onClick={() => !isCollapsed && toggleRole(roleId)}
                  disabled={isCollapsed}
                  className={cn(
                    "w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200",
                    expandedRoles[roleId]
                      ? "bg-[#042d62] text-white shadow-md shadow-[#042d62]/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm",
                    isCollapsed && "flex justify-center",
                  )}
                  title={isCollapsed ? roleName : undefined}
                >
                  <RoleIcon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{roleName}</span>
                      <ChevronDown
                        className={cn(
                          "h-2 w-2 transition-transform duration-200 flex-shrink-0",
                          expandedRoles[roleId] ? "rotate-0" : "-rotate-90",
                        )}
                      />
                    </>
                  )}
                </button>

                {!isCollapsed && showModules && (
                  <div className="mt-3 ml-1 space-y-2 border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                    {sortedModules.map((moduleData) => {
                      const moduleId = moduleData.module._id;
                      const moduleName = moduleData.module.nombre;
                      const sortedOpciones = [...moduleData.opciones].sort(
                        (a, b) => a.orden - b.orden,
                      );

                      return (
                        <div key={moduleId} className="">
                          <button
                            onClick={() => toggleModule(moduleId)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs font-medium transition-all duration-200",
                              expandedModules[moduleId]
                                ? "bg-[#deb06d]/10 dark:bg-[#042d62]/20 text-[#042d62] dark:text-[#deb06d] border-l-2 border-[#deb06d]"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#042d62] dark:hover:text-[#deb06d]",
                            )}
                          >
                            <span className="flex-1 text-left">
                              {moduleName}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-2.5 w-2.5 transition-transform duration-200 flex-shrink-0",
                                expandedModules[moduleId]
                                  ? "rotate-0"
                                  : "-rotate-90",
                              )}
                            />
                          </button>

                          {expandedModules[moduleId] && (
                            <div className="mt-2 ml-2 space-y-1.5 border-l border-slate-300 dark:border-slate-600 pl-3">
                              {sortedOpciones.map((option) => {
                                const active = isActive(option.ruta);
                                return (
                                  <Link
                                    key={option._id}
                                    to={option.ruta}
                                    onClick={onClose}
                                    className={cn(
                                      "flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs transition-all duration-200 group",
                                      active
                                        ? "bg-[#042d62] text-white shadow-md shadow-[#042d62]/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-[#042d62] dark:hover:text-[#deb06d] hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm",
                                    )}
                                  >
                                    <span className="flex-1 text-left">
                                      {option.nombre}
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
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={cn(
            "border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30",
            isCollapsed
              ? "px-2 py-4 sm:py-6 flex flex-col items-center"
              : "px-3 sm:px-4 py-4 sm:py-6",
          )}
        >
          <Link
            to="/soporte"
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-[#042d62] dark:hover:text-blue-400 transition-colors",
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
