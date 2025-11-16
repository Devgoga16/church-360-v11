import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Solicitud,
  PaymentType,
  ApprovalStatus,
  WorkflowStep,
  ProofOfPaymentStatus,
} from "@shared/api";
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SolicitudDetalle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitud = async () => {
      if (!id) {
        setError("ID de solicitud no válido");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/solicitudes/${id}`);
        const data = await response.json();

        if (data.success) {
          setSolicitud(data.data);
        } else {
          setError(data.error || "No se pudo cargar la solicitud");
        }
      } catch (error) {
        console.error("Error fetching solicitud:", error);
        setError("Error al cargar la solicitud");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  const formatCurrency = (value: number, currency: string = "PEN") => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWorkflowStepLabel = (step: WorkflowStep): string => {
    const labels: Record<WorkflowStep, string> = {
      [WorkflowStep.APROBADO_PASTOR_RED]: "Aprobado por Pastor de red",
      [WorkflowStep.APROBADO_ADMINISTRACION]:
        "Aprobado por administración",
      [WorkflowStep.APROBADO_PR_TITULAR]: "Aprobado por PR titular",
      [WorkflowStep.ENTREGA_DINERO]: "Entrega de dinero",
      [WorkflowStep.SUBIR_COMPROBANTE]: "Subir comprobante",
    };
    return labels[step];
  };

  const getProofOfPaymentStatusLabel = (status: ProofOfPaymentStatus): string => {
    const labels: Record<ProofOfPaymentStatus, string> = {
      [ProofOfPaymentStatus.SUBIDO]: "Subido",
      [ProofOfPaymentStatus.PENDIENTE_VALIDAR]: "Comprobante por validar",
      [ProofOfPaymentStatus.VALIDADO]: "Validado",
      [ProofOfPaymentStatus.ERROR]: "Error",
    };
    return labels[status];
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 md:p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-800 h-12 rounded-lg"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !solicitud) {
    return (
      <Layout>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/solicitudes")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Solicitudes
          </Button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-700 dark:text-red-400 font-medium">
              {error || "No se encontró la solicitud"}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/solicitudes")}
            className="w-fit gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <StatusBadge status={solicitud.status} />
        </div>

        {/* Title Section */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-[#050A30] dark:text-white break-words">
                {solicitud.description}
              </h1>
              <p className="text-[#173747] dark:text-slate-400 mt-2">
                {solicitud.code} • {solicitud.ministryName}
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        {solicitud.workflowSteps && solicitud.workflowSteps.length > 0 && (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#050A30] dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Línea de tiempo
            </h2>

            <div className="w-full">
              <div className="relative flex gap-0 w-full justify-between items-flex-start pt-8 pb-4">
                {/* Background connector line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-green-200 dark:bg-green-900/30 z-0" />

                {/* Initial step - Creation date */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 border-4 border-white dark:border-slate-950 text-white relative z-10 flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-center w-full px-2">
                    <h3 className="font-semibold text-[#050A30] dark:text-white text-sm leading-tight">
                      Solicitud creada
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 block">
                      {new Date(solicitud.createdAt).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {solicitud.workflowSteps.map((step, index) => (
                  <div key={step.step || index} className="flex flex-col items-center flex-1 relative">
                    {/* Timeline Circle */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 border-4 border-white dark:border-slate-950 text-white relative z-10 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </div>

                    {/* Step Content */}
                    <div className="mt-4 text-center w-full px-2">
                      <h3 className="font-semibold text-[#050A30] dark:text-white text-sm leading-tight">
                        {getWorkflowStepLabel(step.step)}
                      </h3>

                      {step.completedBy && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                          {step.completedByName}
                        </p>
                      )}

                      {step.proofOfPaymentStatus && (
                        <div className="mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {getProofOfPaymentStatusLabel(step.proofOfPaymentStatus)}
                        </div>
                      )}

                      {step.comment && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                          {step.comment}
                        </p>
                      )}

                      {step.completedAt && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 block">
                          {new Date(step.completedAt).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Información del Solicitante */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
            Información del Solicitante
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ministerio o Área
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/30 text-[#050A30] dark:text-white font-medium">
                {solicitud.ministryName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Encargado de Área
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/30 text-[#050A30] dark:text-white font-medium">
                {solicitud.responsibleName || "No asignado"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Solicitante
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/30 text-[#050A30] dark:text-white font-medium">
                {solicitud.requesterName}
              </div>
            </div>
          </div>
        </div>

        {/* Detalles de la Solicitud */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
            Detalles de la Solicitud
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Moneda
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/30 text-[#050A30] dark:text-white font-medium">
                {solicitud.currency}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Monto Total
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/30 text-2xl font-bold text-[#042D62] dark:text-white">
                {formatCurrency(solicitud.totalAmount, solicitud.currency)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Estado
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/30 inline-block">
                <StatusBadge status={solicitud.status} />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h3 className="text-lg font-semibold text-[#050A30] dark:text-white mb-4">
              Detalles de Items
            </h3>

          {solicitud.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-12">
                      #
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">
                      Descripción
                    </th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-32">
                      Cantidad
                    </th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-32">
                      Precio Unitario
                    </th>
                    <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-32">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {solicitud.items.map((item, index) => (
                    <tr
                      key={item.id || item.itemNumber || index}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="py-3 px-2">
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.itemNumber}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.description}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.quantity || 1}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-slate-700 dark:text-slate-300">
                          {formatCurrency(
                            item.unitPrice || 0,
                            solicitud.currency,
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-semibold text-[#050A30] dark:text-white">
                          {formatCurrency(item.amount, solicitud.currency)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-600 dark:text-slate-400">
              No hay items registrados
            </div>
          )}

          {/* Total */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total:
              </span>
              <span className="text-2xl font-bold text-[#050A30] dark:text-white">
                {formatCurrency(solicitud.totalAmount, solicitud.currency)}
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* Detalle del Abono */}
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
            Detalle del Abono
          </h2>

          <div className="space-y-3">
            {/* Payment Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Tipo de Abono
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                    solicitud.paymentType === PaymentType.UNO_MISMO
                      ? "border-[#042D62] bg-[#042D62]/10 text-[#042D62] dark:bg-[#042D62]/20"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    A Cuenta Propia
                  </div>
                </button>
                <button
                  disabled
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                    solicitud.paymentType === PaymentType.TERCEROS
                      ? "border-[#042D62] bg-[#042D62]/10 text-[#042D62] dark:bg-[#042D62]/20"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    A Terceros
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Detail Display */}
            {solicitud.paymentDetail && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="space-y-3 text-sm">
                  {solicitud.paymentDetail.split("\n").map((line, idx) => {
                    if (!line.trim()) return null;
                    const [label, ...value] = line.split(": ");
                    return (
                      <div key={idx}>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {label.trim()}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {value.join(": ").trim()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Approvals */}
        {solicitud.approvals && solicitud.approvals.length > 0 && (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
              Aprobaciones
            </h2>

            <div className="space-y-3">
              {solicitud.approvals.map((approval, index) => (
                <div
                  key={approval.id || `approval-${approval.approverUserId}-${approval.approvalOrder}`}
                  className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#050A30] dark:text-white">
                        {approval.approverName}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Orden de aprobación:{" "}
                      <span className="font-medium">
                        {approval.approvalOrder}
                      </span>
                    </p>
                    {approval.comments && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Comentarios: {approval.comments}
                      </p>
                    )}
                    {approval.rejectionReason && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                        Motivo del rechazo: {approval.rejectionReason}
                      </p>
                    )}
                    {approval.approvalDate && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {formatDate(approval.approvalDate)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center ml-4">
                    {approval.status === ApprovalStatus.APROBADO && (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    {approval.status === ApprovalStatus.RECHAZADO && (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                    {approval.status === ApprovalStatus.PENDIENTE && (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-400 dark:border-slate-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {solicitud.attachments && solicitud.attachments.length > 0 && (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
              Documentos Adjuntos
            </h2>

            <div className="space-y-2">
              {solicitud.attachments.map((attachment, index) => (
                <div
                  key={attachment.id || `attachment-${index}`}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(attachment.fileSize / 1024).toFixed(2)} KB •{" "}
                        {attachment.uploadedByName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {solicitud.requesterComments && (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
              Comentarios del Solicitante
            </h2>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {solicitud.requesterComments}
            </p>
          </div>
        )}

        {/* Rejection Reason */}
        {solicitud.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-200">
              Motivo del Rechazo
            </h2>
            <p className="text-red-800 dark:text-red-300 whitespace-pre-wrap">
              {solicitud.rejectionReason}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/solicitudes")}
          >
            Volver a Solicitudes
          </Button>
        </div>
      </div>
    </Layout>
  );
}
