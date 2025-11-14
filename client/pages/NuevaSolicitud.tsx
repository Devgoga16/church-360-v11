import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ministry, User, PaymentType, CreateSolicitudRequest, SolicitudItem } from "@shared/api";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NuevaSolicitud() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [ministryId, setMinistryId] = useState<number | "">("");
  const [responsibleUserId, setResponsibleUserId] = useState<number | "">("");
  const [requesterName, setRequesterName] = useState("Pedro Sánchez"); // Mock current user
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("PEN");
  const [paymentType, setPaymentType] = useState<PaymentType | "">(PaymentType.TERCEROS);
  const [paymentDetail, setPaymentDetail] = useState("");
  const [items, setItems] = useState<Omit<SolicitudItem, 'id'>[]>([
    { itemNumber: 1, description: "", amount: 0, quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ministriesRes, usersRes] = await Promise.all([
          fetch("/api/ministries?pageSize=100"),
          fetch("/api/users?pageSize=100"),
        ]);

        const ministriesData = await ministriesRes.json();
        const usersData = await usersRes.json();

        if (ministriesData.success) {
          setMinistries(ministriesData.data);
        }
        if (usersData.success) {
          setUsers(usersData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddItem = () => {
    const newItemNumber = items.length + 1;
    setItems([
      ...items,
      { itemNumber: newItemNumber, description: "", amount: 0, quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      toast({
        title: "Error",
        description: "Debe haber al menos un item",
        variant: "destructive",
      });
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.map((item, idx) => ({ ...item, itemNumber: idx + 1 })));
  };

  const handleItemChange = (
    index: number,
    field: keyof SolicitudItem,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-calculate amount if quantity or unitPrice changes
    if ((field === "quantity" || field === "unitPrice") && newItems[index].unitPrice && newItems[index].quantity) {
      newItems[index].amount = (newItems[index].quantity || 1) * (newItems[index].unitPrice || 0);
    }

    setItems(newItems);
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!ministryId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un ministerio",
        variant: "destructive",
      });
      return;
    }

    if (!responsibleUserId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un encargado de área",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "La descripción es obligatoria",
        variant: "destructive",
      });
      return;
    }

    if (!paymentType) {
      toast({
        title: "Error",
        description: "Debe seleccionar un tipo de abono",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === PaymentType.TERCEROS && !paymentDetail.trim()) {
      toast({
        title: "Error",
        description: "Debe especificar los detalles del abono a terceros",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => !item.description.trim() || item.amount <= 0)) {
      toast({
        title: "Error",
        description: "Todos los items deben tener descripción y monto mayor a 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload: CreateSolicitudRequest = {
        ministryId: ministryId as number,
        responsibleUserId: responsibleUserId as number,
        title,
        description,
        paymentType: paymentType as PaymentType,
        paymentDetail: paymentType === PaymentType.TERCEROS ? paymentDetail : undefined,
        currency,
        items: items.map(({ itemNumber, description, amount, quantity, unitPrice }) => ({
          itemNumber,
          description,
          amount,
          quantity,
          unitPrice,
        })),
      };

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Error al crear la solicitud");
      }

      toast({
        title: "Éxito",
        description: "Solicitud creada exitosamente",
      });

      navigate(`/solicitudes/${data.data.id}`);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la solicitud",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
    }).format(value);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-[#050A30] dark:text-white">
            Nueva Solicitud Financiera
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete el formulario para crear una nueva solicitud
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ministerio y Encargado */}
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
              Información General
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ministerio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ministerio o Área *
                </label>
                <Select
                  value={ministryId ? String(ministryId) : ""}
                  onValueChange={(val) => setMinistryId(parseInt(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar ministerio" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry.id} value={String(ministry.id)}>
                        {ministry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Encargado de Área */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Encargado de Área *
                </label>
                <Select
                  value={responsibleUserId ? String(responsibleUserId) : ""}
                  onValueChange={(val) => setResponsibleUserId(parseInt(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar encargado" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Solicitante */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Solicitante
              </label>
              <Input
                type="text"
                value={requesterName}
                disabled
                className="bg-slate-100 dark:bg-slate-900"
              />
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Título *
              </label>
              <Input
                type="text"
                placeholder="Ej: Equipos de sonido para alabanza"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Descripción General */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descripción General *
              </label>
              <Textarea
                placeholder="Describe los detalles de la solicitud..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>

            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Moneda
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">Soles (S/)</SelectItem>
                  <SelectItem value="USD">Dólares (US$)</SelectItem>
                  <SelectItem value="EUR">Euros (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#050A30] dark:text-white">
                Detalles de Items
              </h2>
              <Button
                type="button"
                onClick={handleAddItem}
                className="gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Agregar Item
              </Button>
            </div>

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
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-24">
                      Cantidad
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-28">
                      Precio Unitario
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-28">
                      Monto
                    </th>
                    <th className="text-center py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 w-10">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="py-3 px-2">
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.itemNumber}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="text"
                          placeholder="Descripción del item"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(index, "description", e.target.value)
                          }
                          className="w-full text-sm"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          placeholder="Cantidad"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-sm"
                          min="0"
                          step="0.1"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          placeholder="Precio"
                          value={item.unitPrice || ""}
                          onChange={(e) =>
                            handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-sm"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          placeholder="Monto"
                          value={item.amount}
                          onChange={(e) =>
                            handleItemChange(index, "amount", parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-sm bg-slate-100 dark:bg-slate-900"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="inline-flex items-center justify-center p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Total:
                </span>
                <span className="text-2xl font-bold text-[#050A30] dark:text-white">
                  {formatCurrency(getTotalAmount())}
                </span>
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
                  Tipo de Abono *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType(PaymentType.UNO_MISMO);
                      setPaymentDetail("");
                    }}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                      paymentType === PaymentType.UNO_MISMO
                        ? "border-[#042D62] bg-[#042D62]/10 text-[#042D62] dark:bg-[#042D62]/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      A Cuenta Propia
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType(PaymentType.TERCEROS)}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                      paymentType === PaymentType.TERCEROS
                        ? "border-[#042D62] bg-[#042D62]/10 text-[#042D62] dark:bg-[#042D62]/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      A Terceros
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Detail for Terceros */}
              {paymentType === PaymentType.TERCEROS && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Detalles del Abono a Terceros *
                  </label>
                  <Textarea
                    placeholder="Especifica a quién se debe pagar (ej: Proveedor XYZ, banco: ..., cuenta: ...)"
                    value={paymentDetail}
                    onChange={(e) => setPaymentDetail(e.target.value)}
                    className="w-full min-h-[100px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/solicitudes")}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 bg-[#042D62] hover:bg-[#042D62]/90"
            >
              {submitting ? "Creando..." : "Crear Solicitud"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
