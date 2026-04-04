"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks";

export default function InitializeScenariosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Se não está autenticado, será redirecionado pelo useEffect

  const handleInitialize = async () => {
    setInitializing(true);
    setMessage({ type: "", text: "" });
    try {
      // Criar Project Symbiosis via API que salva no Firestore
      const response = await fetch("/api/import-project-symbiosis", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao importar cenário");
      }

      setMessage({
        type: "success",
        text: "✅ Project Symbiosis importado com sucesso para o Firestore!",
      });
      setTimeout(() => router.push("/admin/scenarios"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setInitializing(false);
    }
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Você precisa estar logado para acessar esta página.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Inicialização de Cenários
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cenários Disponíveis
        </Typography>
        <Typography component="div" sx={{ mb: 2 }}>
          <ul>
            <li>
              <strong>Solo Leveling Medieval</strong> - já existe no Firestore
            </li>
            <li>
              <strong>Project Symbiosis</strong> - precisa ser criado no
              Firestore para aparecer no admin
            </li>
          </ul>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          O sistema carrega cenários de duas fontes: Firestore (dados salvos) e
          Registry (código). Para que o Project Symbiosis apareça na lista do
          admin, ele precisa estar salvo no Firestore.
        </Typography>
      </Paper>

      <Button
        variant="contained"
        size="large"
        onClick={handleInitialize}
        disabled={initializing}
        sx={{ minWidth: 200 }}
      >
        {initializing ? (
          <CircularProgress size={24} />
        ) : (
          "Criar Project Symbiosis"
        )}
      </Button>

      {message.text && (
        <Alert
          severity={message.type === "success" ? "success" : "error"}
          sx={{ mt: 3 }}
        >
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Acesso Rápido
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/admin/scenarios")}
          sx={{ mr: 2 }}
        >
          Ver Todos os Cenários
        </Button>
        <Button variant="outlined" onClick={() => router.push("/")}>
          Voltar ao Início
        </Button>
      </Paper>
    </Box>
  );
}
