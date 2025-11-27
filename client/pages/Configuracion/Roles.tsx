import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import {
  FaUser,
  FaUserShield,
  FaUsers,
  FaCross,
  FaLock,
  FaCheck,
  FaStar,
  FaHeart,
  FaCog,
  FaUserTie,
  FaUserGraduate,
  FaUserMd,
  FaUserNinja,
  FaUserSecret,
  FaShieldAlt,
  FaCrown,
  FaKey,
  FaBan,
  FaEye,
  FaEyeSlash,
  FaClipboard,
  FaClipboardList,
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
  FaUserPlus,
  FaUserMinus,
  FaUserEdit,
  FaUserCog,
  FaUserCircle,
} from "react-icons/fa";
import { rolesApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Role {
  _id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface FormData {
  nombre: string;
  icono: string;
  descripcion: string;
  activo: boolean;
}

const initialFormData: FormData = {
  nombre: "",
  icono: "user",
  descripcion: "",
  activo: true,
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: FaUser,
  userShield: FaUserShield,
  users: FaUsers,
  cross: FaCross,
  lock: FaLock,
  check: FaCheck,
  star: FaStar,
  heart: FaHeart,
  cog: FaCog,
  userTie: FaUserTie,
  userGraduate: FaUserGraduate,
  userMd: FaUserMd,
  userNinja: FaUserNinja,
  userSecret: FaUserSecret,
  shieldAlt: FaShieldAlt,
  crown: FaCrown,
  key: FaKey,
  ban: FaBan,
  eye: FaEye,
  eyeSlash: FaEyeSlash,
  clipboard: FaClipboard,
  clipboardList: FaClipboardList,
  userClock: FaUserClock,
  userCheck: FaUserCheck,
  userTimes: FaUserTimes,
  userPlus: FaUserPlus,
  userMinus: FaUserMinus,
  userEdit: FaUserEdit,
  userCog: FaUserCog,
  userCircle: FaUserCircle,
};

const ICON_OPTIONS = [
  { key: "user", label: "Usuario" },
  { key: "userShield", label: "Usuario Escudo" },
  { key: "users", label: "Usuarios" },
  { key: "userTie", label: "Usuario Ejecutivo" },
  { key: "userGraduate", label: "Usuario Estudiante" },
  { key: "userMd", label: "Usuario Médico" },
  { key: "userNinja", label: "Usuario Ninja" },
  { key: "userSecret", label: "Usuario Secreto" },
  { key: "userCircle", label: "Usuario Círculo" },
  { key: "userCog", label: "Usuario Config" },
  { key: "userEdit", label: "Usuario Editar" },
  { key: "userPlus", label: "Usuario Agregar" },
  { key: "userMinus", label: "Usuario Remover" },
  { key: "userCheck", label: "Usuario Verificado" },
  { key: "userTimes", label: "Usuario Cancelado" },
  { key: "userClock", label: "Usuario Hora" },
  { key: "shieldAlt", label: "Escudo" },
  { key: "crown", label: "Corona" },
  { key: "lock", label: "Bloqueo" },
  { key: "key", label: "Llave" },
  { key: "ban", label: "Prohibir" },
  { key: "eye", label: "Ver" },
  { key: "eyeSlash", label: "Ocultar" },
  { key: "check", label: "Verificar" },
  { key: "clipboard", label: "Portapapeles" },
  { key: "clipboardList", label: "Lista" },
  { key: "star", label: "Estrella" },
  { key: "heart", label: "Corazón" },
  { key: "cog", label: "Configuración" },
  { key: "cross", label: "Cruz" },
];

const renderIcon = (iconKey: string) => {
  const IconComponent = iconMap[iconKey] || iconMap.user;
  return <IconComponent className="text-[#042d62] text-lg" />;
};

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await rolesApi.getAll();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingId(role._id);
      setFormData({
        nombre: role.nombre,
        icono: role.icono,
        descripcion: role.descripcion,
        activo: role.activo,
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleIconChange = (icon: string) => {
    setFormData((prev) => ({
      ...prev,
      icono: icon,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del rol es requerido",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Update existing role
        await rolesApi.update(editingId, formData);
        toast({
          title: "Éxito",
          description: "Rol actualizado correctamente",
        });
      } else {
        // Create new role
        await rolesApi.create(formData);
        toast({
          title: "Éxito",
          description: "Rol creado correctamente",
        });
      }
      handleCloseDialog();
      await fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el rol",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este rol?")) {
      return;
    }

    try {
      await rolesApi.delete(id);
      toast({
        title: "Éxito",
        description: "Rol eliminado correctamente",
      });
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el rol",
        variant: "destructive",
      });
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Cargando roles...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gestión de Roles
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Administra los roles disponibles en el sistema
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="gap-2 bg-[#042d62] hover:bg-[#031d3d]"
          >
            <Plus className="h-4 w-4" />
            Nuevo Rol
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <div
                key={role._id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
              >
                {/* Icon and Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#042d62]/10 flex items-center justify-center">
                      {renderIcon(role.icono)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {role.nombre}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          role.activo
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {role.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {role.descripcion}
                </p>

                {/* Metadata */}
                <div className="text-xs text-slate-500 dark:text-slate-500 mb-4 space-y-1">
                  <p>
                    Creado:{" "}
                    {new Date(role.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleOpenDialog(role)}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(role._id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm
                  ? "No hay roles que coincidan con la búsqueda"
                  : "No hay roles disponibles"}
              </p>
            </div>
          )}
        </div>

        {/* Dialog for Create/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Rol *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Administrador"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del rol..."
                  rows={3}
                />
              </div>

              {/* Icono */}
              <div className="space-y-2">
                <Label>Icono *</Label>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-lg">
                  {ICON_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleIconChange(option.key)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                        formData.icono === option.key
                          ? "border-[#042d62] bg-[#042d62]/10"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      title={option.label}
                    >
                      <div className="text-lg mb-1">{renderIcon(option.key)}</div>
                      <span className="text-xs text-center text-slate-600 dark:text-slate-400 line-clamp-2">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activo */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  Rol Activo
                </Label>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#042d62] hover:bg-[#031d3d]"
                >
                  {submitting ? "Guardando..." : "Guardar Rol"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
