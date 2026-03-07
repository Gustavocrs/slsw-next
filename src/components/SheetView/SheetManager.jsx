"use client";

import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ListItemIcon,
  Radio,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  UploadFile as ImportIcon,
  ContentCopy as DuplicateIcon,
} from "@mui/icons-material";
import {useCharacterAPI} from "@/hooks/useCharacterAPI";
import {useCharacterStore, useUIStore} from "@/stores/characterStore";

export default function SheetManager({onClose}) {
  const {listAll, delete: deleteChar, create, duplicate} = useCharacterAPI();
  const {loadCharacter, resetCharacter, character} = useCharacterStore();
  const {showNotification, setViewMode, setSheetTab} = useUIStore();

  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSheets = async () => {
    setLoading(true);
    const data = await listAll();
    setSheets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSheets();
  }, [listAll]);

  const handleNewSheet = () => {
    resetCharacter();
    showNotification("Nova ficha iniciada! Preencha e salve.", "info");

    // Redireciona para a aba de Identificação e fecha o modal
    setViewMode("sheet");
    setSheetTab(1); // 1 = Aba de Identificação
    if (onClose) onClose();
  };

  const handleEditSheet = (sheet) => {
    loadCharacter(sheet);
    showNotification(`Ficha "${sheet.nome}" carregada.`, "success");

    // Redireciona para a aba de Visualização e fecha o modal
    setViewMode("sheet");
    setSheetTab(0); // 0 = Aba de Visualizar
    if (onClose) onClose();
  };

  const handleDeleteSheet = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteChar(deleteConfirm);
      showNotification("Ficha excluída com sucesso.", "success");
      fetchSheets();
    } catch (error) {
      showNotification("Erro ao excluir ficha.", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleExportSheet = (sheet) => {
    const dataStr = JSON.stringify(sheet, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sheet.nome || "ficha"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSheet = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        // Remove IDs e metadados de sistema para criar como nova cópia limpa
        const {_id, userId, createdAt, updatedAt, ...sheetData} = json;

        await create({
          ...sheetData,
          nome: `${sheetData.nome || "Sem Nome"} (Importada)`,
        });

        showNotification("Ficha importada com sucesso!", "success");
        fetchSheets();
      } catch (error) {
        console.error(error);
        showNotification("Erro ao importar ficha. Arquivo inválido.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Limpa o input
  };

  const handleDuplicateSheet = async (sheet) => {
    try {
      await duplicate(sheet._id);
      showNotification(`Ficha "${sheet.nome}" duplicada!`, "success");
      fetchSheets();
    } catch (error) {
      showNotification("Erro ao duplicar ficha.", "error");
    }
  };

  return (
    <Box sx={{mt: 2}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Minhas Fichas</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            component="label"
            size="small"
            sx={{mr: 1}}
          >
            Importar
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleImportSheet}
            />
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewSheet}
            size="small"
          >
            Nova Ficha
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{display: "flex", justifyContent: "center", p: 2}}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Paper variant="outlined">
          <List>
            {sheets.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="Nenhuma ficha salva."
                  secondary="Crie uma nova ficha para começar."
                />
              </ListItem>
            ) : (
              sheets.map((sheet) => (
                <ListItem
                  key={sheet._id}
                  divider
                  selected={character?._id === sheet._id}
                >
                  <ListItemIcon
                    onClick={() => handleEditSheet(sheet)}
                    sx={{cursor: "pointer"}}
                  >
                    <Radio
                      edge="start"
                      checked={character?._id === sheet._id}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    sx={{cursor: "pointer"}}
                    onClick={() => handleEditSheet(sheet)}
                    primary={sheet.nome || "Sem Nome"}
                    secondary={`${sheet.arquetipo || "Novato"} - Rank ${sheet.rank || "Novato"}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="export"
                      onClick={() => handleExportSheet(sheet)}
                      sx={{mr: 1}}
                      title="Exportar JSON"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="duplicate"
                      onClick={() => handleDuplicateSheet(sheet)}
                      sx={{mr: 1}}
                      title="Duplicar Ficha"
                    >
                      <DuplicateIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditSheet(sheet)}
                      sx={{mr: 1}}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => setDeleteConfirm(sheet._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Excluir Ficha?</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta ficha? Esta ação não pode ser
            desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button onClick={handleDeleteSheet} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
