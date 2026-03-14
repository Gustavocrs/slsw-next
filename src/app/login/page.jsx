/**
 * @file /app/login/page.jsx
 * @description Componente de login com tema de "Dark Fantasy HUD" para Next.js.
 */
"use client";

import {useState} from "react";
import {FaUserShield, FaLock} from "react-icons/fa";

/**
 * Componente de página de login com uma estética de masmorra/fantasia sombria.
 * Utiliza TailwindCSS para estilização e react-icons para iconografia.
 * @returns {JSX.Element} O componente de login renderizado.
 */
const LoginPage = () => {
  const [hunterId, setHunterId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativa de login com:", {hunterId, accessToken});
    // Aqui viria a lógica de autenticação com a API/Firebase
  };

  return (
    <main
      className="flex h-screen w-full items-center justify-center bg-neutral-950"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(0, 229, 255, 0.05) 0%, transparent 30%), radial-gradient(circle at 75% 75%, rgba(128, 0, 128, 0.05) 0%, transparent 30%)",
      }}
    >
      <div className="w-full max-w-md rounded-lg border border-cyan-400/50 bg-black/60 p-8 shadow-[0_0_15px_rgba(0,229,255,0.3)] backdrop-blur-md">
        {/* Header do Painel */}
        <div className="text-center">
          <h1 className="font-bold text-5xl text-white [text-shadow:0_0_8px_rgba(0,229,255,0.8)]">
            SLSW
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Terminal de Acesso à Masmorra
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {/* Input: ID do Caçador */}
          <div className="relative">
            <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              id="hunterId"
              value={hunterId}
              onChange={(e) => setHunterId(e.target.value)}
              placeholder="ID do Caçador"
              className="w-full border-b border-cyan-500/50 bg-black/40 p-3 pl-10 text-white placeholder-gray-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Input: Token de Acesso */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="password"
              id="accessToken"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Token de Acesso"
              className="w-full border-b border-cyan-500/50 bg-black/40 p-3 pl-10 text-white placeholder-gray-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Botão Principal */}
          <button
            type="submit"
            className="w-full rounded-md border border-cyan-400 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-900/50 hover:text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.5)]"
          >
            Desbloquear Sistema
          </button>
        </form>

        {/* Link Secundário */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-xs text-gray-500 transition-colors duration-300 hover:text-cyan-400"
          >
            Recuperar Token
          </a>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
