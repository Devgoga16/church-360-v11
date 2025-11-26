import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FAQ } from "@/components/FAQ";
import { Chatbot } from "@/components/Chatbot";
import { cn } from "@/lib/utils";
import { MessageCircle, HelpCircle } from "lucide-react";

export default function Soporte() {
  const [activeTab, setActiveTab] = useState<"faq" | "chatbot">("faq");

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Centro de Soporte
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Encuentra respuestas a tus preguntas o comunícate con nosotros
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("faq")}
              className={cn(
                "py-4 px-1 font-medium text-sm transition-colors border-b-2",
                activeTab === "faq"
                  ? "border-[#042d62] text-[#042d62] dark:text-[#deb06d]"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300",
              )}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Preguntas Frecuentes
              </div>
            </button>

            <button
              onClick={() => setActiveTab("chatbot")}
              className={cn(
                "py-4 px-1 font-medium text-sm transition-colors border-b-2",
                activeTab === "chatbot"
                  ? "border-[#042d62] text-[#042d62] dark:text-[#deb06d]"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300",
              )}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Asistente
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 p-6">
          <div className="max-w-3xl mx-auto">
            {activeTab === "faq" && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Preguntas Frecuentes
                </h2>
                <FAQ />
              </div>
            )}

            {activeTab === "chatbot" && (
              <div className="h-full">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Asistente Virtual
                </h2>
                <div style={{ height: "calc(100vh - 280px)" }}>
                  <Chatbot />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
