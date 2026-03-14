/**
 * @file /app/login/page.jsx
 * @description Componente de login com tema de "Dark Fantasy HUD" para Next.js.
 */
"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {FaFingerprint, FaGoogle} from "react-icons/fa";
import {useAuth} from "@/hooks";

/**
 * Componente de página de login com uma estética de masmorra/fantasia sombria.
 * Utiliza TailwindCSS para estilização e react-icons para iconografia.
 * @returns {JSX.Element} O componente de login renderizado.
 */
const LoginPage = () => {
  const {user, loginWithGoogle} = useAuth();
  const router = useRouter();

  // Redireciona para a home automaticamente se o usuário já estiver logado
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (error) {
      console.error("Erro na autenticação arcana:", error);
    }
  };

  return (
    <main
      className="flex h-screen w-full items-center justify-center bg-neutral-950"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 40%)",
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center rounded-lg border border-cyan-400/50 bg-black/60 p-8 shadow-[0_0_15px_rgba(0,229,255,0.3)] backdrop-blur-md">
        {/* Header do Painel */}
        <div className="text-center">
          <h1 className="font-bold text-5xl text-white [text-shadow:0_0_8px_rgba(0,229,255,0.8)]">
            SLSW
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Terminal de Acesso à Masmorra
          </p>
        </div>

        {/* Escaner de Digital (Login Google) */}
        <div className="mt-12 mb-6 flex flex-col items-center justify-center space-y-6">
          <button
            onClick={handleLogin}
            className="group relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border border-cyan-500/30 bg-black/40 shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all duration-500 hover:border-cyan-400 hover:bg-cyan-900/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] active:scale-95"
          >
            <FaFingerprint className="text-7xl text-cyan-500/50 transition-all duration-500 group-hover:scale-110 group-hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
          </button>

          <div className="flex items-center space-x-2 text-gray-400">
            <FaGoogle className="text-cyan-400" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Autenticar via Google
            </span>
          </div>
        </div>

        {/* Status Indicativo */}
        <div className="mt-4 text-center">
          <p className="animate-pulse text-xs text-gray-500">
            Aguardando biometria do Caçador...
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
