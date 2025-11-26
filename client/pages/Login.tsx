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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/");
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
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042D62] to-[#0a4a9f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#042D62] mb-2">
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
              className="w-full bg-[#042D62] hover:bg-[#031f42] text-white font-semibold py-2"
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
              onClick={() => quickLogin("admin@iglesia360.com")}
              disabled={isLoading}
              className="w-full p-3 border-2 border-slate-200 rounded-lg hover:border-[#042D62] hover:bg-blue-50 transition-all text-left"
            >
              <div className="font-semibold text-slate-900">Admin (1 rol)</div>
              <div className="text-sm text-slate-600">admin@iglesia360.com</div>
            </button>

            <button
              onClick={() => quickLogin("director@iglesia360.com")}
              disabled={isLoading}
              className="w-full p-3 border-2 border-slate-200 rounded-lg hover:border-[#042D62] hover:bg-blue-50 transition-all text-left"
            >
              <div className="font-semibold text-slate-900">
                Director (3 roles)
              </div>
              <div className="text-sm text-slate-600">
                director@iglesia360.com
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Contraseña de prueba: <span className="font-mono">password</span>
          </p>
        </div>
      </div>
    </div>
  );
}
