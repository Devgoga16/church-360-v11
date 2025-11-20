import { SolicitudStatus } from "@shared/api";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: SolicitudStatus;
  className?: string;
}

const statusConfig: Record<
  SolicitudStatus,
  { label: string; className: string }
> = {
  borrador: {
    label: "Borrador",
    className: "badge-draft",
  },
  pendiente: {
    label: "Pendiente",
    className: "badge-pending",
  },
  en_revision: {
    label: "En Revisión",
    className:
      "inline-flex items-center px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  aprobado_parcial: {
    label: "Aprobado Parcial",
    className:
      "inline-flex items-center px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  aprobado: {
    label: "Aprobado",
    className: "badge-approved",
  },
  rechazado: {
    label: "Rechazado",
    className: "badge-rejected",
  },
  completado: {
    label: "Completado",
    className: "badge-completed",
  },
  cancelado: {
    label: "Cancelado",
    className:
      "inline-flex items-center px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(config.className, className)}>{config.label}</span>
  );
}
