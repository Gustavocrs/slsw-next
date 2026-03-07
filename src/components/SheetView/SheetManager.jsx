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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {useCharacterAPI} from "@/hooks/useCharacterAPI";
import {useCharacterStore, useUIStore} from "@/stores/characterStore";

export default function SheetManager() {
  const {listAll, delete: deleteChar} = useCharacterAPI();
  const {loadCharacter, resetCharacter} = useCharacterStore();
  const {showNotification} = useUIStore();

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
    // Dica: Aqui você pode fechar o modal de perfil se necessário
  };

  const handleEditSheet = (sheet) => {
    loadCharacter(sheet);
    showNotification(`Ficha "${sheet.nome}" carregada.`, "success");
    // Dica: Aqui você pode fechar o modal de perfil se necessário
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewSheet}
          size="small"
        >
          Nova Ficha
        </Button>
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
                <ListItem key={sheet._id} divider>
                  <ListItemText
                    primary={sheet.nome || "Sem Nome"}
                    secondary={`${sheet.arquetipo || "Novato"} - Rank ${sheet.rank || "Novato"}`}
                  />
                  <ListItemSecondaryAction>
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
