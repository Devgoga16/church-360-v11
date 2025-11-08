import { useState } from "react";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#5E17EB] to-[#5E17EB] shadow-lg shadow-[#5E17EB]/30 font-logo">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-logo text-[#050A30] dark:text-white leading-tight">Iglesia 360</h1>
              <span className="text-xs font-subheading text-[#173747] dark:text-slate-400">IACYM - Comas</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="h-5 w-5 text-[#173747] dark:text-slate-400" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5E17EB] to-[#5E17EB] flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <span className="text-sm font-medium text-[#050A30] dark:text-white hidden sm:block">Juan G.</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-medium text-[#050A30] dark:text-white">Juan García</p>
                  <p className="text-xs text-[#173747] dark:text-slate-500">admin@iglesia360.com</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[#050A30] dark:text-white">
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors">
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
