import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Inbox } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="h-8 w-8 text-slate-400" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
              404
            </h1>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
              Página no encontrada
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Esta página está bajo construcción o no existe. Puedes volver al
              inicio o explorar otras secciones.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
}
