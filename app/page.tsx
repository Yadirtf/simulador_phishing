import React from "react";
import Link from "next/link";
import { Terminal, Shield, Eye, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="font-bold tracking-tight text-sm uppercase">Simulación de Phishing</span>
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            Proyecto Educativo • Ingeniería Social
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-12 text-center z-10">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-6 flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          ENTORNO CONTROLADO ACADÉMICO
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-none">
          Simulación de Phishing <br />
          <span className="bg-gradient-to-r from-red-500 to-indigo-500 bg-clip-text text-transparent">
            Netflix &amp; ShadowOps
          </span>
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
          Proyecto académico diseñado para exponer la mecánica de los ataques de phishing, ingeniería social y capturas de datos a través de una demostración práctica.
        </p>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {/* Card 1: Dashboard Atacante */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-900/80 transition duration-300 group text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <Terminal className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition">
              Panel del Atacante
            </h2>
            <p className="text-xs text-zinc-500 leading-normal">
              Consola del atacante para lanzar campañas de phishing por correo y ver capturas en tiempo real.
            </p>
          </Link>

          {/* Card 2: Netflix Portal (Victima) */}
          <Link
            href="/netflix-login"
            className="flex flex-col items-center p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-red-500/50 hover:bg-zinc-900/80 transition duration-300 group text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <Eye className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-lg font-bold mb-2 group-hover:text-red-400 transition">
              Portal de Netflix Falso
            </h2>
            <p className="text-xs text-zinc-500 leading-normal">
              Réplica del inicio de sesión de Netflix para simular el phishing visual y la entrada de credenciales.
            </p>
          </Link>

          {/* Card 3: Database Seeder */}
          <a
            href="/api/seed"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-zinc-900/80 transition duration-300 group text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition">
              Sembrar Base de Datos
            </h2>
            <p className="text-xs text-zinc-500 leading-normal">
              Inicializa MongoDB Atlas con campañas y víctimas simuladas para probar la consola al instante.
            </p>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500 bg-zinc-950/20">
        Desarrollado para la presentación práctica de Phishing e Ingeniería Social. © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
