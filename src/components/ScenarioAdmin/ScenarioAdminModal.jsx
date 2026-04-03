/**
 * ScenarioAdminModal Component
 * Modal fullscreen para gerenciamento completo de cenários
 * Inclui: Vantagens, Complicações, Poderes, Regras, Lore, Itens, Gerador, Ficha, Config
 */

"use client";

import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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
      <AwakeningTableEditor data={awakeningRules} onChange={handleChange} />
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

function ConfigTab({ scenarioData, onUpdate, loading }) {
  const [metadata, setMetadata] = useState(scenarioData?.metadata || {});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (scenarioData?.metadata) {
      setMetadata(scenarioData.metadata);
    }
  }, [scenarioData]);

  const handleChange = (field) => (e) => {
    const newMetadata = { ...metadata, [field]: e.target.value };
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
              disabled
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

  useEffect(() => {
    if (initialScenarioId !== undefined) {
      setSelectedScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  const loadScenario = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ScenarioService.getScenarioById(selectedScenarioId);
      if (data) {
        setScenarioData(data);
      } else {
        // Iniciar vazio quando não há dados salvos
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
    }
  }, [open, selectedScenarioId, loadScenario, initialScenarioId]);

  const handleUpdate = (field, value) => {
    const updated = { ...scenarioData, [field]: value };
    setScenarioData(updated);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!scenarioData) return;
    setSaving(true);
    try {
      const scenarioId = scenarioData?.id || scenarioData?.metadata?.id;
      if (!scenarioId || scenarioId === "__new__" || scenarioId.trim() === "") {
        setSnackbar({
          open: true,
          message: "ID do cenário inválido. Crie um cenário primeiro.",
          severity: "error",
        });
        setSaving(false);
        return;
      }
      const dataToSave = { ...scenarioData, id: scenarioId };
      console.log("Salvando cenário:", scenarioId, dataToSave);
      await ScenarioService.saveScenario(dataToSave);
      setHasChanges(false);
      setSnackbar({
        open: true,
        message: "Salvo com sucesso!",
        severity: "success",
      });
      if (onScenarioCreated) {
        onScenarioCreated(scenarioId);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSnackbar({ open: true, message: "Erro ao salvar", severity: "error" });
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

  const tabs = [
    { label: "Vantagens", icon: <ShieldIcon /> },
    { label: "Complicações", icon: <CategoryIcon /> },
    { label: "Powers", icon: <MagicIcon /> },
    { label: "Regras", icon: <RuleIcon /> },
    { label: "Lore", icon: <BookIcon /> },
    { label: "Gerador", icon: <DungeonIcon /> },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">⚙️ Configurar Cenário</Typography>
          {hasChanges && (
            <Chip label="Alterações pendentes" color="warning" size="small" />
          )}
          {saving && <CircularProgress size={20} />}
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            Salvar
          </Button>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
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
            <Typography>
              O Gerador de Aventuras é definido em código. Funcionalidade de
              edição em desenvolvimento.
            </Typography>
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <SheetTab
              scenarioData={scenarioData}
              onUpdate={handleUpdate}
              loading={loading}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={7}>
            <ConfigTab
              scenarioData={scenarioData}
              onUpdate={handleUpdate}
              loading={loading}
            />
          </TabPanel>
        </Box>
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
