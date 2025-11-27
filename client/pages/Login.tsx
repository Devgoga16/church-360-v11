import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, permisos } = useAuth();
  const navigate = useNavigate();

  const getFirstOptionRoute = (): string | null => {
    if (!permisos || permisos.length === 0) return null;

    // Sort modules by orden
    const sortedModulos = [...permisos[0].modulos].sort((a, b) => {
      const ordenA = a.module.orden || 0;
      const ordenB = b.module.orden || 0;
      return ordenA - ordenB;
    });

    // Get first module
    const firstModule = sortedModulos[0];
    if (!firstModule) return null;

    // Get first option of the first module, sorted by orden
    const sortedOpciones = [...firstModule.opciones].sort((a, b) => {
      const ordenA = a.orden || 0;
      const ordenB = b.orden || 0;
      return ordenA - ordenB;
    });

    const firstOption = sortedOpciones[0];
    return firstOption ? firstOption.ruta : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);

      // Small delay to ensure permisos are updated in context
      setTimeout(() => {
        const firstRoute = getFirstOptionRoute();
        navigate(firstRoute || "/");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (testUsername: string, testPassword: string) => {
    setUsername(testUsername);
    setPassword(testPassword);
    setError("");
    setIsLoading(true);

    try {
      await login(testUsername, testPassword);

      // Small delay to ensure permisos are updated in context
      setTimeout(() => {
        const firstRoute = getFirstOptionRoute();
        navigate(firstRoute || "/");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042d62] to-[#031d3d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#042d62] mb-2">
              Iglesia 360
            </h1>
            <p className="text-slate-600">Gestión integral para tu iglesia</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="username" className="text-slate-700 font-medium">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#042d62] hover:bg-[#031d3d] text-white font-semibold py-2 transition-colors"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">O prueba con</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => quickLogin("admin", "admin123")}
              disabled={isLoading}
              className="w-full p-3 border-2 border-slate-200 rounded-lg hover:border-[#042d62] hover:bg-[#042d62]/5 transition-all text-left"
            >
              <div className="font-semibold text-slate-900">
                Admin (2 roles)
              </div>
              <div className="text-sm text-slate-600">admin@iglesia360.com</div>
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Credenciales: <span className="font-mono">admin</span> /{" "}
            <span className="font-mono">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
