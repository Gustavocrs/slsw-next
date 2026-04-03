/**
 * ScenarioAdminList Component
 * Tela inicial para listar cenários e criar novos
 */

"use client";

import {
  Add as AddIcon,
  AutoAwesome,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as LoadIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as ScenarioService from "@/lib/scenarioService.js";
import ScenarioAdminModal from "./ScenarioAdminModal";

export default function ScenarioAdminList({ onClose, onLoadScenario }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newScenarioId, setNewScenarioId] = useState("");
  const [newScenarioName, setNewScenarioName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      setLoading(true);
      try {
        const data = await ScenarioService.getAllScenarios();
        setScenarios(data);
      } catch (error) {
        console.error("Erro ao carregar cenários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  const handleSelectScenario = (id) => {
    setSelectedScenarioId(id);
    setModalOpen(true);
  };

  const handleLoadScenario = async (id) => {
    if (onLoadScenario) {
      await onLoadScenario(id);
      if (onClose) onClose();
    }
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
    setSelectedScenarioId(null);
    setLoading(true);
    try {
      const data = await ScenarioService.getAllScenarios();
      setScenarios(data);
    } catch (error) {
      console.error("Erro ao carregar cenários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScenario = async () => {
    if (!newScenarioId.trim() || !newScenarioName.trim()) return;

    setSaving(true);
    try {
      await ScenarioService.saveScenario({
        id: newScenarioId.trim(),
        metadata: {
          id: newScenarioId.trim(),
          name: newScenarioName.trim(),
          description: "",
        },
        edges: [],
        hindrances: [],
        powers: {},
        awakeningRules: [],
        extraFields: {},
        promptStyles: {},
        skills: {},
        loreSections: [],
      });
      setCreateDialogOpen(false);
      setNewScenarioId("");
      setNewScenarioName("");
      setSelectedScenarioId(newScenarioId.trim());
      setModalOpen(true);
      const data = await ScenarioService.getAllScenarios();
      setScenarios(data);
    } catch (error) {
      console.error("Erro ao criar cenário:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteScenario = async (id) => {
    if (!window.confirm(`Confirmar exclusão do cenário "${id}"?`)) return;

    try {
      await ScenarioService.deleteScenario(id);
      const data = await ScenarioService.getAllScenarios();
      setScenarios(data);
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Admin de Cenários
        </Typography>
        <Button variant="outlined" onClick={onClose}>
          Fechar
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : scenarios.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary" gutterBottom>
            Nenhum cenário cadastrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sem cenários cadastrados, o sistema rodará apenas com as regras
            padrão do SWADE.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Criar primeiro cenário
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {scenarios.map((scenario) => (
            <Grid item xs={12} sm={6} md={4} key={scenario.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 3 },
                }}
                onClick={() => handleSelectScenario(scenario.id)}
              >
                <Box
                  sx={{
                    height: 120,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: scenario.metadata?.imageUrl
                      ? `url(${scenario.metadata.imageUrl})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    "&::after": scenario.metadata?.imageUrl
                      ? {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0,0,0,0.3)",
                        }
                      : {},
                  }}
                >
                  {!scenario.metadata?.imageUrl && (
                    <AutoAwesome
                      sx={{ fontSize: 48, color: "white", opacity: 0.7 }}
                    />
                  )}
                </Box>
                <CardContent
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {scenario.metadata?.name || scenario.id}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      {onLoadScenario && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<LoadIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadScenario(scenario.id);
                          }}
                        >
                          Carregar
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectScenario(scenario.id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScenario(scenario.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ID: {scenario.id}
                  </Typography>
                  {scenario.metadata?.description && (
                    <Typography variant="body2" sx={{ mt: 1, flex: 1 }}>
                      {scenario.metadata.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Criar Novo Cenário</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="ID do Cenário"
              value={newScenarioId}
              onChange={(e) =>
                setNewScenarioId(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                )
              }
              placeholder="meu-cenario"
              helperText="Identificador único (letras minúsculas, números e hífen)"
              fullWidth
            />
            <TextField
              label="Nome do Cenário"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              placeholder="Meu Cenário"
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={() => setCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateScenario}
                disabled={
                  !newScenarioId.trim() || !newScenarioName.trim() || saving
                }
              >
                {saving ? <CircularProgress size={20} /> : "Criar"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ScenarioAdminModal
        open={modalOpen}
        onClose={handleCloseModal}
        initialScenarioId={selectedScenarioId}
      />
    </Box>
  );
}
