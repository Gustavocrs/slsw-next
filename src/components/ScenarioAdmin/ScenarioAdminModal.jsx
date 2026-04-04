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
  Description as DescriptionIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  UploadFile as UploadFileIcon,
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

  // Estados para o modal de importação
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importTab, setImportTab] = useState("edges");
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importError, setImportError] = useState(null);

  useEffect(() => {
    if (scenarioData?.metadata) {
      setMetadata(scenarioData.metadata);
      setIsNewScenario(!scenarioData.metadata.id);
    }
  }, [scenarioData]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newMetadata = { ...metadata, [field]: value };
    setMetadata(newMetadata);
    onUpdate("metadata", newMetadata);
  };

  const handleNameBlur = () => {
    // Se for novo cenário e ainda não tem ID, gerar baseado no nome
    if (isNewScenario && metadata.name && !metadata.id) {
      const slug = metadata.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 50);
      const randomNum = Math.floor(Math.random() * 900) + 100;
      const newId = slug ? `${slug}_${randomNum}` : `cenario_${Date.now()}`;
      const newMetadata = { ...metadata, id: newId };
      setMetadata(newMetadata);
      onUpdate("metadata", newMetadata);
    }
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

  // ----- Funções de Importação -----

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsText(file);
    });

  const validateImportData = (type, data) => {
    switch (type) {
      case "edges":
        if (!Array.isArray(data))
          return { valid: false, error: "Deve ser um array" };
        if (!data.every((e) => e.name && e.rank && e.description))
          return {
            valid: false,
            error: "Cada edge deve ter name, rank, description",
          };
        return { valid: true };
      case "hindrances":
        if (!Array.isArray(data))
          return { valid: false, error: "Deve ser um array" };
        if (!data.every((h) => h.name && h.severity && h.description))
          return {
            valid: false,
            error: "Cada hindrance deve ter name, severity, description",
          };
        return { valid: true };
      case "powers":
        if (typeof data !== "object" || data === null)
          return { valid: false, error: "Deve ser um objeto" };
        if (
          !Object.values(data).every(
            (p) => p.pp && p.range && p.duration && p.rank,
          )
        )
          return {
            valid: false,
            error: "Cada power deve ter pp, range, duration, rank",
          };
        return { valid: true };
      case "awakeningRules":
        if (!Array.isArray(data))
          return { valid: false, error: "Deve ser um array" };
        if (!data.every((r) => r.title && r.description))
          return {
            valid: false,
            error: "Cada regra deve ter title, description",
          };
        return { valid: true };
      case "loreSections":
        if (!Array.isArray(data))
          return { valid: false, error: "Deve ser um array" };
        if (!data.every((s) => s.id && s.title && (s.content || s.contentHtml)))
          return {
            valid: false,
            error: "Cada seção deve ter id, title, content/contentHtml",
          };
        return { valid: true };
      case "sheetFields": {
        if (typeof data !== "object" || data === null)
          return { valid: false, error: "Deve ser um objeto" };
        const { extraFields, promptStyles, skills } = data;
        if (!extraFields || typeof extraFields !== "object")
          return { valid: false, error: "extraFields deve ser objeto" };
        if (!promptStyles || typeof promptStyles !== "object")
          return { valid: false, error: "promptStyles deve ser objeto" };
        if (!skills || typeof skills !== "object")
          return { valid: false, error: "skills deve ser objeto" };
        return { valid: true };
      }
      default:
        return { valid: false, error: "Tipo desconhecido" };
    }
  };

  const mapTabToField = (tab) => {
    const map = {
      edges: "edges",
      hindrances: "hindrances",
      powers: "powers",
      awakeningRules: "awakeningRules",
      loreSections: "loreSections",
      sheetFields: "sheetFields",
    };
    return map[tab];
  };

  const getTabLabel = (tab) => {
    const labels = {
      edges: "Vantagens",
      hindrances: "Complicações",
      powers: "Poderes",
      awakeningRules: "Regras",
      loreSections: "Lore",
      sheetFields: "Ficha",
    };
    return labels[tab];
  };

  const getTabDescription = (tab) => {
    const descriptions = {
      edges:
        "Arquivo .js com export default de array: [{ name, rank, description }].",
      hindrances:
        "Arquivo .js com export default de array: [{ name, severity ('Maior'|'Menor'), description }].",
      powers:
        "Arquivo .js com export default de objeto: { nome: { pp, range, duration, rank, description } }.",
      awakeningRules:
        "Arquivo .js com export default de array: [{ title, description }].",
      loreSections:
        "Arquivo .js com export default de array: [{ id, title, content, contentHtml }].",
      sheetFields:
        "Arquivo .js com export default de objeto: { extraFields, promptStyles, skills }.",
    };
    return descriptions[tab];
  };

  const openImportDialog = () => setImportDialogOpen(true);
  const closeImportDialog = () => {
    setImportDialogOpen(false);
    setImportFile(null);
    setImportPreview(null);
    setImportError(null);
    setImportTab("edges");
  };

  const handleProcessImport = async () => {
    if (!importFile) return;
    setImportLoading(true);
    setImportError(null);
    try {
      const code = await readFileAsText(importFile);
      const match = code.match(/export\s+default\s+(.+)/s);
      if (!match)
        throw new Error("Formato inválido: não encontrou 'export default'");
      const dataStr = match[1].replace(/;*\s*$/, "");
      const data = new Function(`return ${dataStr}`)();
      const validation = validateImportData(importTab, data);
      if (!validation.valid) throw new Error(validation.error);
      setImportPreview(data);
    } catch (error) {
      setImportError(error.message);
      setImportPreview(null);
    } finally {
      setImportLoading(false);
    }
  };

  const applyImport = () => {
    if (!importPreview || !scenarioData) return;
    const field = mapTabToField(importTab);

    // Para sheetFields, aplicamos o objeto completo; para outros, substituímos diretamente
    onUpdate(field, importPreview);

    closeImportDialog();
    setSnackbar({
      open: true,
      message: `✅ ${getTabLabel(importTab)} importado com sucesso! Salve para confirmar.`,
      severity: "success",
    });
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
              onBlur={handleNameBlur}
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

        {/* Ferramentas do Admin */}
        {!isNewScenario && (
          <Paper
            sx={{
              p: 2,
              borderColor: "info.main",
              borderWidth: 2,
              borderStyle: "dashed",
              mt: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="info.main"
              gutterBottom
            >
              Ferramentas do Admin
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Operações de manutenção do cenário. Use com cuidado.
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDeleteOpen(true)}
                sx={{ flex: "1 1 150px" }}
              >
                Excluir Cenário
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RefreshIcon />}
                onClick={onRestoreDefault}
                sx={{ flex: "1 1 150px" }}
              >
                Restaurar Padrão
              </Button>
              <Button
                variant="outlined"
                color="info"
                startIcon={<UploadFileIcon />}
                onClick={openImportDialog}
                sx={{ flex: "1 1 150px" }}
              >
                Importar
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Dialog de Importação */}
        <Dialog
          open={importDialogOpen}
          onClose={closeImportDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>📥 Importar Dados</DialogTitle>
          <DialogContent>
            <Tabs
              value={importTab}
              onChange={(e, v) => setImportTab(v)}
              variant="fullWidth"
            >
              <Tab label="Vantagens" value="edges" />
              <Tab label="Complicações" value="hindrances" />
              <Tab label="Poderes" value="powers" />
              <Tab label="Regras" value="awakeningRules" />
              <Tab label="Lore" value="loreSections" />
              <Tab label="Ficha" value="sheetFields" />
            </Tabs>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {getTabDescription(importTab)}
              </Typography>

              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                disabled={importLoading}
                sx={{ mr: 2 }}
              >
                Selecionar arquivo .js
                <input
                  type="file"
                  accept=".js"
                  hidden
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                />
              </Button>

              {importFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📄 {importFile.name}
                </Typography>
              )}

              {importLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}

              {importError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {importError}
                </Alert>
              )}

              {importPreview && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success" icon={<DescriptionIcon />}>
                    Dados válidos! Estrutura correta.
                  </Alert>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Quantidade:{" "}
                    {Array.isArray(importPreview)
                      ? importPreview.length
                      : Object.keys(importPreview).length}{" "}
                    itens
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ mt: 2, p: 2, maxHeight: 200, overflow: "auto" }}
                  >
                    <pre style={{ fontSize: "0.8rem", margin: 0 }}>
                      {JSON.stringify(importPreview, null, 2).substring(
                        0,
                        1000,
                      )}
                    </pre>
                  </Paper>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeImportDialog}>Cancelar</Button>
            <Button
              onClick={handleProcessImport}
              variant="contained"
              disabled={!importFile || importLoading}
            >
              Processar
            </Button>
            <Button
              onClick={applyImport}
              variant="contained"
              color="primary"
              disabled={!importPreview}
            >
              Aplicar
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

  // Função para seed (popular Firestore com dados do código)
  const handleSeed = async () => {
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
        `Popular "${scenarioData.metadata.name || scenarioData.metadata.id}" no Firestore com os dados do código?`,
      )
    )
      return;

    try {
      setSaving(true);
      await APIService.seedScenario(scenarioData.metadata.id);
      clearScenarioCache();
      setSnackbar({
        open: true,
        message: `Cenário "${scenarioData.metadata.name || scenarioData.metadata.id}" populado no Firestore!`,
        severity: "success",
      });
      setTimeout(() => {
        loadScenario();
      }, 500);
    } catch (error) {
      console.error("Erro ao fazer seed:", error);
      setSnackbar({
        open: true,
        message: `Erro ao popular: ${error.message}`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

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
        `Restaurar "${scenarioData.metadata.name || scenarioData.metadata.id}" para os valores padrão do código?`,
      )
    )
      return;

    try {
      setSaving(true);

      // Tenta deletar do Firestore, mas ignora se não existir (404)
      try {
        await ScenarioService.deleteScenario(scenarioData.metadata.id);
      } catch (error) {
        // Se o erro for 404 (não encontrado), está tudo bem - o cenário já está no estado padrão
        if (
          !error.message?.toLowerCase().includes("404") &&
          !error.message?.toLowerCase().includes("não encontrado")
        ) {
          throw error; // Repassa outros erros
        }
      }

      // Agora fazer seed (migração) para repopular Firestore com dados atuais do código
      try {
        console.log(
          `[Restaurar] Fazendo seed do cenário ${scenarioData.metadata.id}...`,
        );
        await APIService.seedScenario(scenarioData.metadata.id);
        console.log(
          `[Restaurar] Seed concluído com sucesso para ${scenarioData.metadata.id}`,
        );
      } catch (seedError) {
        console.error(`[Restaurar] Erro ao fazer seed do cenário:`, seedError);
        // Não falha a restauração se a seed falhar, apenas alerta
        setSnackbar({
          open: true,
          message: `Cenário deletado, mas seed falhou: ${seedError.message}`,
          severity: "warning",
        });
      }

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
