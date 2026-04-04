/**
 * Scenario Admin Page
 * Lista todos os cenários disponíveis para edição
 */

"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ScenarioAdminList from "@/components/ScenarioAdmin/ScenarioAdminList";
import { useAuth } from "@/hooks";

export default function ScenariosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Se não está autenticado e já montou, redireciona
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !mounted) {
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
    return null; // O useEffect já redirecionou
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 3 }}>
      <ScenarioAdminList onClose={() => router.push("/")} />
    </Box>
  );
}
