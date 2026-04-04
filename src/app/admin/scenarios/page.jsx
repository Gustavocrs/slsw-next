/**
 * Scenario Admin Page
 * Lista todos os cenários disponíveis para gerenciamento
 */

"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";
import APIService from "@/lib/api";
import * as ScenarioRegistry from "@/scenarios";

export default function ScenariosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const list = ScenarioRegistry.getAvailableScenarios();
        setScenarios(list);
      } catch (error) {
        console.error("Erro ao carregar cenários:", error);
        setSnackbar({
          open: true,
          message: "Erro ao carregar cenários",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    loadScenarios();
  }, []);

  const handleSeed = async (scenarioId) => {
    try {
      await APIService.seedScenario(scenarioId);
      setSnackbar({
        open: true,
        message: `✅ Cenário ${scenarioId} populado no Firestore!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ Erro no seed: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleRestore = async (scenarioId) => {
    try {
      await APIService.deleteScenario?.(scenarioId).catch(() => {});
      await APIService.seedScenario(scenarioId);
      setSnackbar({
        open: true,
        message: `🔄 Cenário ${scenarioId} restaurado para o padrão!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ Erro ao restaurar: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleExport = async (scenarioId) => {
    try {
      const response = await fetch(`/api/export-scenario?id=${scenarioId}`);
      const data = await response.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${scenarioId}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSnackbar({
          open: true,
          message: "📤 Exportação concluída!",
          severity: "success",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ Erro ao exportar: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleImportManual = async (scenarioId) => {
    try {
      const response = await fetch("/api/import-manual-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });
      const data = await response.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: "📚 Manual importado com sucesso!",
          severity: "success",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ Erro ao importar manual: ${error.message}`,
        severity: "error",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box p={3} maxWidth="1200px" mx="auto">
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          sx={{ mr: 2 }}
        >
          ← Voltar
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Gerenciamento de Cenários (Admin)
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        Esta página permite popular, restaurar, exportar e importar dados dos
        cenários no Firestore. Use "Seed" para carregar dados do código para o
        Firestore. Use "Restaurar" para resetar para o padrão.
      </Typography>

      <List>
        {scenarios.map((scenario) => (
          <ListItem
            key={scenario.id}
            divider
            sx={{ bgcolor: "background.paper", mb: 1, borderRadius: 1, py: 2 }}
          >
            <ListItemText
              primary={
                <Typography variant="h6">
                  {scenario.name}
                  <Chip
                    label={scenario.id}
                    size="small"
                    sx={{ ml: 1, fontSize: "0.7rem" }}
                  />
                </Typography>
              }
              secondary={scenario.description}
            />
            <ListItemText
              secondary={
                <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSeed(scenario.id)}
                  >
                    🌱 Seed
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleRestore(scenario.id)}
                  >
                    🔄 Restaurar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleExport(scenario.id)}
                  >
                    📤 Exportar JSON
                  </Button>
                  {scenario.id === "solo-leveling" && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleImportManual(scenario.id)}
                    >
                      📚 Importar Manual
                    </Button>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
