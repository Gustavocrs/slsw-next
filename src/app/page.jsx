"use client";

import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/hooks";
import { useScenario } from "@/hooks/useActiveScenario";

export const dynamic = "force-dynamic"; // Desabilita SSR para evitar hydration mismatch

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Usar cenário solo-leveling para o manual
  const { scenario, loading: scenarioLoading } = useScenario("solo-leveling");
  const manualSections = scenario?.loreSections || [];

  useEffect(() => {
    // Se já terminou de carregar e não há usuário, redireciona para login
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const filteredSections = useMemo(() => {
    if (!searchTerm) return manualSections;

    const lowerTerm = searchTerm.toLowerCase();
    return manualSections.filter((section) => {
      const titleMatch =
        section.title?.toLowerCase().includes(lowerTerm) || false;
      // Usar contentHtml se disponível, senão content
      const content = section.contentHtml || section.content || "";
      const contentText = content.replace(/<[^>]+>/g, "").toLowerCase();
      const contentMatch = contentText.includes(lowerTerm);

      return titleMatch || contentMatch;
    });
  }, [searchTerm, manualSections]);

  // Garantir hidratação correta: mostrar loading até que cliente e servidor
  // tenham os mesmos valores. Isso evita hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enquanto não montado no cliente, mostrar loading consistente
  if (!mounted || authLoading || scenarioLoading || !user) {
    return (
      <Box
        suppressHydrationWarning
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#050505",
        }}
      >
        <CircularProgress sx={{ color: "#00e5ff" }} />
      </Box>
    );
  }

  return (
    <PageLayout
      sections={filteredSections}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
    />
  );
}
