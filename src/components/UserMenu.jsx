"use client";

import {useState, useEffect} from "react";
import {useAuth} from "../contexts/AuthContext";

export default function UserMenu() {
  const {user, googleLogin, logout} = useAuth();
  const [imgError, setImgError] = useState(false);

  // Tenta alterar levemente a URL (tamanho) para evitar cache de erro 429 do Google
  // De s96-c (96px) para s100-c (100px)
  const photoURL = user?.photoURL;
  const safePhotoURL = photoURL?.includes("googleusercontent.com")
    ? photoURL.replace("=s96-c", "=s100-c")
    : photoURL;

  // Reseta o estado de erro quando o usuário muda (login/logout)
  // FIX: Monitora apenas a URL da foto para evitar loops infinitos se o objeto user for recriado
  useEffect(() => setImgError(false), [safePhotoURL]);

  if (!user) {
    return (
      <button
        onClick={googleLogin}
        className="btn-login"
        style={{cursor: "pointer", padding: "8px 16px"}}
      >
        Login com Google
      </button>
    );
  }

  // Lógica de Avatar com Fallback (Correção do problema "quebrou o avatar")
  const displayName = user.displayName || "Caçador";
  const firstName = displayName.split(" ")[0];

  // Se user.photoURL for null, usa o gerador de avatar com as iniciais
  // Se der erro no carregamento (imgError), também usa o fallback
  const avatarSrc =
    safePhotoURL && !imgError
      ? safePhotoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName,
        )}&background=random`;

  return (
    <div
      className="user-menu"
      style={{display: "flex", alignItems: "center", gap: "12px"}}
    >
      <div
        className="user-identity"
        style={{display: "flex", alignItems: "center", gap: "8px"}}
      >
        <img
          src={avatarSrc}
          alt="Avatar"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ccc",
          }}
        />
        <span className="user-name" style={{fontWeight: 500}}>
          Olá, {firstName}
        </span>
      </div>
      <button
        onClick={logout}
        className="btn-logout"
        style={{cursor: "pointer", fontSize: "0.9em"}}
      >
        Sair
      </button>
    </div>
  );
}
