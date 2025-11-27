import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { optionsApi, rolesApi, modulesApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Module {
  _id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  orden: number;
  activo: boolean;
}

interface Role {
  _id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  activo: boolean;
}

interface Option {
  _id: string;
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
  module: Module;
  roles: Role[];
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormDataOption {
  nombre: string;
  ruta: string;
  orden: number;
  moduleId: string;
  roleIds: string[];
  activo: boolean;
}

interface FormDataModule {
  nombre: string;
  descripcion: string;
  orden: number;
  activo: boolean;
}

const initialFormDataOption: FormDataOption = {
  nombre: "",
  ruta: "",
  orden: 1,
  moduleId: "",
  roleIds: [],
  activo: true,
};

const initialFormDataModule: FormDataModule = {
  nombre: "",
  descripcion: "",
  orden: 1,
  activo: true,
};


type DialogMode = "module" | "option" | null;

export default function Modulos() {
  const [modules, setModules] = useState<Module[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDataModule, setFormDataModule] = useState<FormDataModule>(initialFormDataModule);
  const [formDataOption, setFormDataOption] = useState<FormDataOption>(initialFormDataOption);
  const [submitting, setSubmitting] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modulesRes, optionsRes, rolesRes] = await Promise.all([
        modulesApi.getAll(),
        optionsApi.getAll(),
        rolesApi.getAll(),
      ]);
      setModules(modulesRes.data.data || []);
      setOptions(optionsRes.data.data || []);
      setRoles(rolesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group options by module
  const groupedByModule = modules.reduce(
    (acc, module) => {
      acc[module._id] = {
        module,
        options: options.filter((opt) => opt.module._id === module._id),
      };
      return acc;
    },
    {} as Record<
      string,
      {
        module: Module;
        options: Option[];
      }
    >,
  );

  // Sort modules by orden
  const sortedModules = Object.values(groupedByModule).sort(
    (a, b) => a.module.orden - b.module.orden,
  );

  // Filter based on search
  const filteredModules = sortedModules.filter(
    (group) =>
      group.module.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.options.some((opt) =>
        opt.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleOpenDialogModule = () => {
    setDialogMode("module");
    setEditingId(null);
    setFormDataModule(initialFormDataModule);
    setIsDialogOpen(true);
  };

  const handleOpenDialogOption = (moduleId: string, option?: Option) => {
    setDialogMode("option");
    setSelectedModuleId(moduleId);
    if (option) {
      setEditingId(option._id);
      setFormDataOption({
        nombre: option.nombre,
        ruta: option.ruta,
        orden: option.orden,
        moduleId: moduleId,
        roleIds: option.roles.map((r) => r._id),
        activo: option.activo,
      });
    } else {
      setEditingId(null);
      setFormDataOption({
        ...initialFormDataOption,
        moduleId: moduleId,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogMode(null);
    setEditingId(null);
    setSelectedModuleId(null);
    setFormDataModule(initialFormDataModule);
    setFormDataOption(initialFormDataOption);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const parsedValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
          ? parseInt(value)
          : value;

    if (dialogMode === "module") {
      setFormDataModule((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    } else {
      setFormDataOption((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormDataOption((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dialogMode === "module") {
      if (!formDataModule.nombre.trim()) {
        toast({
          title: "Error",
          description: "El nombre del módulo es requerido",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);
      try {
        if (editingId) {
          await modulesApi.update(editingId, formDataModule);
          toast({
            title: "Éxito",
            description: "Módulo actualizado correctamente",
          });
        } else {
          await modulesApi.create(formDataModule);
          toast({
            title: "Éxito",
            description: "Módulo creado correctamente",
          });
        }
        handleCloseDialog();
        await fetchData();
      } catch (error) {
        console.error("Error saving module:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar el módulo",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!formDataOption.nombre.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la opción es requerido",
          variant: "destructive",
        });
        return;
      }

      if (!formDataOption.ruta.trim()) {
        toast({
          title: "Error",
          description: "La ruta es requerida",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);
      try {
        if (editingId) {
          await optionsApi.update(editingId, formDataOption);
          toast({
            title: "Éxito",
            description: "Opción actualizada correctamente",
          });
        } else {
          await optionsApi.create(formDataOption);
          toast({
            title: "Éxito",
            description: "Opción creada correctamente",
          });
        }
        handleCloseDialog();
        await fetchData();
      } catch (error) {
        console.error("Error saving option:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar la opción",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este m��dulo?")) {
      return;
    }

    try {
      await modulesApi.delete(id);
      toast({
        title: "Éxito",
        description: "Módulo eliminado correctamente",
      });
      await fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el módulo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta opción?")) {
      return;
    }

    try {
      await optionsApi.delete(id);
      toast({
        title: "Éxito",
        description: "Opción eliminada correctamente",
      });
      await fetchData();
    } catch (error) {
      console.error("Error deleting option:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la opción",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Cargando módulos...</div>
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
              Módulos y Opciones
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Administra los módulos y opciones de acceso del sistema
            </p>
          </div>
          <Button
            onClick={handleOpenDialogModule}
            className="gap-2 bg-[#042d62] hover:bg-[#031d3d]"
          >
            <Plus className="h-4 w-4" />
            Agregar Módulo
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar módulos u opciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {filteredModules.length > 0 ? (
            filteredModules.map((group) => (
              <div
                key={group.module._id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModuleExpanded(group.module._id)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {expandedModules.has(group.module._id) ? (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-500" />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {group.module.nombre}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {group.module.descripcion}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded flex-shrink-0">
                    {group.options.length} opción
                    {group.options.length !== 1 ? "es" : ""}
                  </span>

                  {/* Module Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(group.module._id);
                        setFormDataModule({
                          nombre: group.module.nombre,
                          descripcion: group.module.descripcion,
                          orden: group.module.orden,
                          activo: group.module.activo,
                        });
                        setDialogMode("module");
                        setIsDialogOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(group.module._id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </button>

                {/* Options List */}
                {expandedModules.has(group.module._id) && (
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    {/* Add Option Button */}
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <Button
                        onClick={() => handleOpenDialogOption(group.module._id)}
                        size="sm"
                        variant="outline"
                        className="gap-2 w-full"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Nueva Opción
                      </Button>
                    </div>

                    {/* Options Items */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {group.options
                      .sort((a, b) => a.orden - b.orden)
                      .map((option) => (
                        <div
                          key={option._id}
                          className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {option.nombre}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {option.ruta}
                              </p>
                            </div>
                          </div>

                          {/* Roles */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {option.roles.length > 0 ? (
                              <div className="flex gap-1">
                                {option.roles.slice(0, 2).map((role) => (
                                  <span
                                    key={role._id}
                                    className="text-xs bg-[#042d62]/10 text-[#042d62] dark:bg-[#042d62]/20 dark:text-blue-300 px-2 py-1 rounded truncate max-w-[100px]"
                                    title={role.nombre}
                                  >
                                    {role.nombre}
                                  </span>
                                ))}
                                {option.roles.length > 2 && (
                                  <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                                    +{option.roles.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                Sin roles
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => handleOpenDialogOption(group.module._id, option)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteOption(option._id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm
                  ? "No hay módulos que coincidan con la búsqueda"
                  : "No hay módulos disponibles"}
              </p>
            </div>
          )}
        </div>

        {/* Dialog for Create/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "module"
                  ? editingId
                    ? "Editar Módulo"
                    : "Crear Nuevo Módulo"
                  : editingId
                    ? "Editar Opción"
                    : "Crear Nueva Opción"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {dialogMode === "module" ? (
                <>
                  {/* Module Form */}
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Módulo *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formDataModule.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Usuarios"
                      required
                    />
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      name="descripcion"
                      value={formDataModule.descripcion}
                      onChange={handleInputChange}
                      placeholder="Ej: Gestión de usuarios del sistema"
                    />
                  </div>

                  {/* Orden */}
                  <div className="space-y-2">
                    <Label htmlFor="orden">Orden</Label>
                    <Input
                      id="orden"
                      name="orden"
                      type="number"
                      value={formDataModule.orden}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>

                  {/* Activo */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={formDataModule.activo}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                    />
                    <Label htmlFor="activo" className="cursor-pointer">
                      Módulo Activo
                    </Label>
                  </div>
                </>
              ) : (
                <>
                  {/* Option Form */}
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Opción *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formDataOption.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Ver Dashboard"
                      required
                    />
                  </div>

                  {/* Ruta */}
                  <div className="space-y-2">
                    <Label htmlFor="ruta">Ruta *</Label>
                    <Input
                      id="ruta"
                      name="ruta"
                      value={formDataOption.ruta}
                      onChange={handleInputChange}
                      placeholder="Ej: /dashboard"
                      required
                    />
                  </div>

                  {/* Orden */}
                  <div className="space-y-2">
                    <Label htmlFor="orden">Orden</Label>
                    <Input
                      id="orden"
                      name="orden"
                      type="number"
                      value={formDataOption.orden}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>

                  {/* Roles */}
                  <div className="space-y-2">
                    <Label>Roles con Acceso</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {roles.map((role) => (
                        <label
                          key={role._id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formDataOption.roleIds.includes(role._id)}
                            onChange={() => handleRoleToggle(role._id)}
                            className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {role.nombre}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {role.descripcion}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Activo */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={formDataOption.activo}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                    />
                    <Label htmlFor="activo" className="cursor-pointer">
                      Opción Activa
                    </Label>
                  </div>
                </>
              )}

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
                  {submitting
                    ? "Guardando..."
                    : dialogMode === "module"
                      ? "Guardar Módulo"
                      : "Guardar Opción"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
