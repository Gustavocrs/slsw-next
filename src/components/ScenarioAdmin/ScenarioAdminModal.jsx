/**
 * ScenarioAdminModal Component
 * Modal fullscreen para gerenciamento completo de cenários
 * Inclui: Vantagens, Complicações, Poderes, Regras, Lore, Itens, Gerador, Ficha, Config
 */

"use client";

import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { manualSections } from "@/data/manualSections";
import APIService from "@/lib/api";
import * as ScenarioService from "@/lib/scenarioService.js";
import {
  clearScenarioCache,
  getAvailableScenarios,
  getScenario,
  getScenarioIfExists,
} from "@/scenarios";
import AwakeningTableEditor from "./forms/AwakeningTableEditor";
import GenericItemForm from "./forms/GenericItemForm";
import KeyValueEditorComp, { ExtraFieldsEditor } from "./forms/KeyValueEditor";
import LoreTab from "./forms/LoreTab";

const KeyValueEditor = KeyValueEditorComp;

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: "16px 0" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function LoadingOverlay({ loading }) {
  if (!loading) return null;
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function EdgesTab({ scenarioData, onAdd, onEdit, onDelete, loading }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [type, setType] = useState("edge");

  const _handleAdd = (item) => {
    onAdd(item);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleSave = (item) => {
    if (editItem) {
      onEdit(item);
    } else {
      onAdd(item);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const openAdd = (itemType) => {
    setType(itemType);
    setEditItem(null);
    setFormOpen(true);
  };

  const edges = scenarioData?.edges || [];

  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay loading={loading} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Vantagens ({edges.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openAdd("edge")}
        >
          Adicionar Vantagem
        </Button>
      </Box>

      {edges.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma vantagem cadastrada
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {edges.map((edge, idx) => (
                <TableRow key={edge.name || idx}>
                  <TableCell>{edge.name}</TableCell>
                  <TableCell>
                    <Chip size="small" label={edge.rank} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography noWrap>{edge.description}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(edge)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(edge)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <GenericItemForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        type={type}
        editItem={editItem}
      />
    </Box>
  );
}

function HindrancesTab({ scenarioData, onUpdate, onAdd, onDelete, loading }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleSave = (item) => {
    if (editItem) {
      onUpdate(
        "hindrances",
        scenarioData?.hindrances?.map((h) =>
          h.name === editItem.name ? item : h,
        ) || [],
      );
    } else {
      onAdd(item);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const hindrances = scenarioData?.hindrances || [];

  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay loading={loading} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Complicações ({hindrances.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditItem(null);
            setFormOpen(true);
          }}
        >
          Adicionar Complicação
        </Button>
      </Box>

      {hindrances.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma complicação cadastrada
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hindrances.map((h, idx) => (
                <TableRow key={h.name || idx}>
                  <TableCell>{h.name}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={h.severity === "Maior" ? "Maior" : "Menor"}
                      color={h.severity === "Maior" ? "error" : "info"}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography noWrap>{h.description}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditItem(h);
                        setFormOpen(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(h)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <GenericItemForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        type="hindrance"
        editItem={editItem}
      />
    </Box>
  );
}

function PowersTab({ scenarioData, onUpdate, onDelete, loading }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleSave = (item) => {
    const powers = { ...(scenarioData?.powers || {}) };
    powers[item.name] = item;
    onUpdate("powers", powers);
    setFormOpen(false);
    setEditItem(null);
  };

  const powers = scenarioData?.powers || {};
  const powersList = Object.entries(powers).map(([name, data]) => ({
    name,
    ...data,
  }));

  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay loading={loading} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Poderes ({powersList.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditItem(null);
            setFormOpen(true);
          }}
        >
          Adicionar Poder
        </Button>
      </Box>

      {powersList.length === 0 ? (
        <Typography color="text.secondary">Nenhum poder cadastrado</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>PP</TableCell>
                <TableCell>Alcance</TableCell>
                <TableCell>Duração</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {powersList.map((p, idx) => (
                <TableRow key={p.name || idx}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.pp}</TableCell>
                  <TableCell>{p.range}</TableCell>
                  <TableCell>{p.duration}</TableCell>
                  <TableCell>
                    <Chip size="small" label={p.rank} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditItem(p);
                        setFormOpen(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(p)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <GenericItemForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        type="power"
        editItem={editItem}
      />
    </Box>
  );
}

function RulesTab({ scenarioData, onUpdate, loading }) {
  const [awakeningRules, setAwakeningRules] = useState(
    scenarioData?.awakeningRules || [],
  );

  useEffect(() => {
    if (scenarioData?.awakeningRules) {
      setAwakeningRules(scenarioData.awakeningRules);
    }
  }, [scenarioData]);

  const handleChange = (newData) => {
    setAwakeningRules(newData);
    onUpdate("awakeningRules", newData);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay loading={loading} />
      <AwakeningTableEditor
        data={awakeningRules}
        onChange={handleChange}
        scenarioId={scenarioData?.id}
      />
    </Box>
  );
}

function SheetTab({ scenarioData, onUpdate, loading }) {
  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay loading={loading} />

      <Stack spacing={3}>
        <ExtraFieldsEditor
          title="Campos Extras da Ficha"
          data={scenarioData?.extraFields || {}}
          onChange={(data) => onUpdate("extraFields", data)}
        />

        <KeyValueEditor
          title="Estilos de Arte (Prompts)"
          data={scenarioData?.promptStyles || {}}
          onChange={(data) => onUpdate("promptStyles", data)}
          valueType="string"
          keyPlaceholder="Nome do estilo"
          valuePlaceholder="Prompt completo..."
        />

        <KeyValueEditor
          title="Habilidades Extras do Cenário"
          data={scenarioData?.skills || {}}
          onChange={(data) => onUpdate("skills", data)}
          valueType="string"
          keyPlaceholder="Nome da habilidade"
          valuePlaceholder="Atributo (agilidade, forca, etc)"
        />
      </Stack>
    </Box>
  );
}

function ConfigTab({
  scenarioData,
  onUpdate,
  loading,
  onDeleteScenario,
  onRestoreDefault,
}) {
  const [metadata, setMetadata] = useState(scenarioData?.metadata || {});
  const [uploading, setUploading] = useState(false);
  const [isNewScenario, setIsNewScenario] = useState(
    !scenarioData?.metadata?.id,
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  useEffect(() => {
    if (scenarioData?.metadata) {
      setMetadata(scenarioData.metadata);
      setIsNewScenario(!scenarioData.metadata.id);
    }
  }, [scenarioData]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newMetadata = { ...metadata, [field]: value };

    if (field === "name" && isNewScenario) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 50);
      const randomNum = Math.floor(Math.random() * 900) + 100;
      newMetadata.id = slug ? `${slug}_${randomNum}` : `cenario_${Date.now()}`;
    }

    setMetadata(newMetadata);
    onUpdate("metadata", newMetadata);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await APIService.uploadFile(file);
      const newMetadata = { ...metadata, imageUrl: url };
      setMetadata(newMetadata);
      onUpdate("metadata", newMetadata);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay loading={loading} />

      <Stack spacing={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Imagem de Capa
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box
              sx={{
                width: 120,
                height: 80,
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "grey.200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: metadata.imageUrl
                  ? `url(${metadata.imageUrl})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!metadata.imageUrl && (
                <ImageIcon sx={{ color: "grey.400", fontSize: 32 }} />
              )}
            </Box>
            <Box>
              <Button variant="outlined" component="label" disabled={uploading}>
                {uploading ? "Enviando..." : "Escolher Imagem"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
              {metadata.imageUrl && (
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    const newMetadata = { ...metadata, imageUrl: "" };
                    setMetadata(newMetadata);
                    onUpdate("metadata", newMetadata);
                  }}
                >
                  Remover
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Metadata
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="ID"
              value={metadata.id || ""}
              onChange={handleChange("id")}
              size="small"
              fullWidth
              disabled={!isNewScenario}
              helperText={
                isNewScenario
                  ? "ID gerado automaticamente, pode editar"
                  : "ID fixo após criar"
              }
            />
            <TextField
              label="Nome"
              value={metadata.name || ""}
              onChange={handleChange("name")}
              size="small"
              fullWidth
            />
            <TextField
              label="Descrição"
              value={metadata.description || ""}
              onChange={handleChange("description")}
              size="small"
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </Paper>

        {/* Botão de Excluir Cenário */}
        {!isNewScenario && (
          <Paper
            sx={{
              p: 2,
              borderColor: "error.main",
              borderWidth: 2,
              borderStyle: "dashed",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="error"
              gutterBottom
            >
              Zona de Perigo
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Excluir este cenário permanentemente. Esta ação não pode ser
              desfeita.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setConfirmDeleteOpen(true)}
              sx={{ mt: 1 }}
            >
              Excluir Cenário
            </Button>
          </Paper>
        )}

        {/* Botão Restaurar Padrão */}
        {!isNewScenario && (
          <Paper
            sx={{
              p: 2,
              borderColor: "warning.main",
              borderWidth: 2,
              borderStyle: "dashed",
              mt: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="warning.main"
              gutterBottom
            >
              Restauração
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Restaurar este cenário para os valores padrão do código. Isso
              apagará todas as alterações salvas no Firestore.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RefreshIcon />}
              onClick={onRestoreDefault}
              sx={{ mt: 1 }}
            >
              Restaurar Padrão
            </Button>
          </Paper>
        )}

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={() => {
            setConfirmDeleteOpen(false);
            setConfirmDeleteInput("");
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Excluir Cenário
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você está prestes a excluir o cenário{" "}
              <strong>"{metadata.name || metadata.id}"</strong>.
              <br />
              <br />
              Esta ação <strong>NÃO pode ser desfeita</strong>. Todos os dados
              do cenário (edges, hindrances, powers, regras, lore) serão
              permanentemente apagados.
              <br />
              <br />
              Para confirmar, digite o ID do cenário abaixo:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="ID do Cenário"
              type="text"
              fullWidth
              variant="outlined"
              value={confirmDeleteInput}
              onChange={(e) => setConfirmDeleteInput(e.target.value)}
              error={
                confirmDeleteInput !== metadata.id &&
                confirmDeleteInput.length > 0
              }
              helperText={
                confirmDeleteInput !== metadata.id &&
                confirmDeleteInput.length > 0
                  ? "ID incorreto"
                  : `Digite: ${metadata.id}`
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmDeleteInput === metadata.id && onDeleteScenario) {
                  onDeleteScenario(metadata.id);
                  setConfirmDeleteOpen(false);
                  setConfirmDeleteInput("");
                }
              }}
              color="error"
              variant="contained"
              disabled={confirmDeleteInput !== metadata.id}
            >
              EXCLUIR PERMANENTEMENTE
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}

export default function ScenarioAdminModal({
  open,
  onClose,
  initialScenarioId,
  onScenarioCreated,
}) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    initialScenarioId || "",
  );
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scenarioData, setScenarioData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isNewScenario, setIsNewScenario] = useState(false);
  const [availableScenarios, setAvailableScenarios] = useState([]);

  // Função para restaurar cenário para o padrão do código
  const handleRestoreDefault = async () => {
    if (!scenarioData?.metadata?.id) {
      setSnackbar({
        open: true,
        message: "ID do cenário não encontrado",
        severity: "error",
      });
      return;
    }

    if (
      !window.confirm(
        `Restaurar "${scenarioData.metadata.name || scenarioData.metadata.id}" para os valores padrão do código? Isso apagará todas as alterações salvas no Firestore.`,
      )
    )
      return;

    try {
      setSaving(true);
      await ScenarioService.deleteScenario(scenarioData.metadata.id);

      clearScenarioCache();

      setSnackbar({
        open: true,
        message: `Cenário "${scenarioData.metadata.name || scenarioData.metadata.id}" restaurado para o padrão!`,
        severity: "success",
      });

      setTimeout(() => {
        loadScenario();
      }, 500);
    } catch (error) {
      console.error("Erro ao restaurar cenário:", error);
      setSnackbar({
        open: true,
        message: `Erro ao restaurar: ${error.message}`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (initialScenarioId !== undefined) {
      setSelectedScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  // Carregar lista de cenários disponíveis
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const scenarios = getAvailableScenarios();
        setAvailableScenarios(scenarios);
      } catch (error) {
        console.error("Erro ao carregar cenários disponíveis:", error);
      }
    };
    loadScenarios();
  }, []);

  const loadScenario = useCallback(async () => {
    setLoading(true);
    try {
      // Primeiro tentar buscar do Firestore
      const data = await ScenarioService.getScenarioById(selectedScenarioId);

      if (data) {
        setScenarioData(data);
        setIsNewScenario(false);
      } else {
        // Tentar buscar do registry (código)
        const registryScenario = getScenarioIfExists(selectedScenarioId);
        if (registryScenario && registryScenario.metadata) {
          // Encontrou no registry! Usar os dados do código
          setScenarioData({
            id: registryScenario.metadata.id || selectedScenarioId,
            metadata: registryScenario.metadata,
            edges: registryScenario.edges || [],
            hindrances: registryScenario.hindrances || [],
            powers: registryScenario.powers || {},
            awakeningRules: registryScenario.awakeningRules || [],
            extraFields: registryScenario.extraFields || {},
            promptStyles: registryScenario.promptStyles || {},
            skills: registryScenario.skills || {},
            loreSections: registryScenario.loreSections || [],
            adventureGenerator: registryScenario.adventureGenerator || {},
          });
          setIsNewScenario(false); // Não é novo, está no registry
        } else {
          // Não encontrou em lugar nenhum - criar vazio
          setScenarioData({
            id: selectedScenarioId,
            metadata: {
              id: selectedScenarioId,
              name: "",
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
            adventureGenerator: {},
          });
          setIsNewScenario(true);
          setTabValue(6);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar cenário:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar cenário",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedScenarioId]);

  useEffect(() => {
    if (initialScenarioId) {
      setSelectedScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  useEffect(() => {
    if (open && selectedScenarioId) {
      loadScenario();
    } else if (open && !selectedScenarioId) {
      // Sem cenário definido - iniciar vazio
      setScenarioData({
        id: initialScenarioId || "",
        metadata: {
          id: initialScenarioId || "",
          name: "",
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
        adventureGenerator: {},
      });
      setTabValue(6);
    }
  }, [open, selectedScenarioId, loadScenario, initialScenarioId]);

  const handleUpdate = (field, value) => {
    const updated = { ...scenarioData, [field]: value };
    setScenarioData(updated);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!scenarioData?.metadata?.id) {
      setSnackbar({
        open: true,
        message: "ID do cenário é obrigatório",
        severity: "error",
      });
      return;
    }

    try {
      setSaving(true);
      await ScenarioService.saveScenario(scenarioData);

      setHasChanges(false);
      clearScenarioCache();

      setSnackbar({
        open: true,
        message: `Cenário "${scenarioData.metadata.name || scenarioData.id}" salvo com sucesso!`,
        severity: "success",
      });

      if (onScenarioCreated) {
        onScenarioCreated(scenarioData);
      }
    } catch (error) {
      console.error("Erro ao salvar cenário:", error);
      setSnackbar({
        open: true,
        message: `Erro ao salvar: ${error.message}`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    if (!window.confirm(`Confirmar exclusão do cenário "${scenarioId}"?`))
      return;

    try {
      setSaving(true);
      await ScenarioService.deleteScenario(scenarioId);

      clearScenarioCache();

      setSnackbar({
        open: true,
        message: `Cenário "${scenarioId}" excluído com sucesso!`,
        severity: "success",
      });

      if (scenarioId === selectedScenarioId) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao excluir cenário:", error);
      setSnackbar({
        open: true,
        message: `Erro ao excluir cenário: ${error.message}`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = (type, item) => {
    const current = scenarioData[type] || [];
    const updated = [...current, { ...item, source: selectedScenarioId }];
    handleUpdate(type, updated);
  };

  const handleEdit = (type, item) => {
    const current = scenarioData[type] || [];
    const updated = current.map((h) => (h.name === item.name ? item : h));
    handleUpdate(type, updated);
  };

  const handleDelete = (type, item) => {
    if (!window.confirm(`Confirmar exclusão de "${item.name}"?`)) return;
    const current = scenarioData[type] || [];
    const updated = current.filter((h) => h.name !== item.name);
    handleUpdate(type, updated);
  };

  const handleClose = () => {
    setScenarioData(null);
    setSelectedScenarioId("solo-leveling");
    onClose();
  };

  const handleScenarioChange = (event) => {
    const newScenarioId = event.target.value;
    setSelectedScenarioId(newScenarioId);
    setHasChanges(false);
    setTabValue(0);
  };

  const getCurrentScenarioName = () => {
    const scenario = availableScenarios.find(
      (s) => s.id === selectedScenarioId,
    );
    return scenario?.name || selectedScenarioId;
  };

  const tabs = [
    { label: "Vantagens", icon: <ShieldIcon /> },
    { label: "Complicações", icon: <CategoryIcon /> },
    { label: "Powers", icon: <MagicIcon /> },
    { label: "Regras", icon: <RuleIcon /> },
    { label: "Lore", icon: <BookIcon /> },
    { label: "Ficha", icon: <PersonIcon /> },
    { label: "Config", icon: <ConfigIcon /> },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullScreen maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          pr: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">⚙️ Configurar Cenário</Typography>

          {/* Seletor de Cenários */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="scenario-select-label">Cenário</InputLabel>
            <Select
              labelId="scenario-select-label"
              value={selectedScenarioId}
              label="Cenário"
              onChange={handleScenarioChange}
            >
              {availableScenarios.map((scenario) => (
                <MenuItem key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ ml: 2 }}>
            <strong>{getCurrentScenarioName()}</strong>
          </Typography>

          {isNewScenario ? (
            <Chip label="Criar Novo Cenário" color="success" size="small" />
          ) : hasChanges ? (
            <Chip label="Alterações pendentes" color="warning" size="small" />
          ) : null}
          {saving && <CircularProgress size={20} />}
          {!isNewScenario && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={(!hasChanges && !isNewScenario) || saving}
            >
              {isNewScenario ? "Criar" : "Salvar"}
            </Button>
          )}
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {isNewScenario ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Nenhum cenário criado ainda
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Preencha os dados do cenário e clique em "Criar" para salvar.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Criando..." : "Criar Cenário"}
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(_e, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    label={tab.label}
                  />
                ))}
              </Tabs>
            </Box>

            <Box
              sx={{
                mt: 2,
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
                position: "relative",
              }}
            >
              <TabPanel value={tabValue} index={0}>
                <EdgesTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  onAdd={(item) => handleAdd("edges", item)}
                  onEdit={(item) => handleEdit("edges", item)}
                  onDelete={(item) => handleDelete("edges", item)}
                  loading={loading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <HindrancesTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  onAdd={(item) => handleAdd("hindrances", item)}
                  onDelete={(item) => handleDelete("hindrances", item)}
                  loading={loading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <PowersTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  onAdd={(_item) => {}}
                  onDelete={(item) => {
                    const powers = { ...(scenarioData?.powers || {}) };
                    delete powers[item.name];
                    handleUpdate("powers", powers);
                  }}
                  loading={loading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <RulesTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  loading={loading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <LoreTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  loading={loading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <SheetTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  loading={loading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={6}>
                <ConfigTab
                  scenarioData={scenarioData}
                  onUpdate={handleUpdate}
                  loading={loading}
                  onDeleteScenario={handleDeleteScenario}
                  onRestoreDefault={handleRestoreDefault}
                />
              </TabPanel>
            </Box>
          </>
        )}
      </DialogContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

import {
  MenuBook as BookIcon,
  Category as CategoryIcon,
  Settings as ConfigIcon,
  Castle as DungeonIcon,
  AutoAwesome as MagicIcon,
  Person as PersonIcon,
  Gavel as RuleIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
