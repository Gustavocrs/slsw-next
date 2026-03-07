/**
 * TableDetailsModal Component
 * Visualizar detalhes, editar configurações e excluir mesa
 */

"use client";

import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";

function TableDetailsModal() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    tableDetailsModalOpen,
    toggleTableDetailsModal,
    selectedTable,
    notifyTablesUpdated,
    showNotification,
  } = useUIStore();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form States
  const [tableName, setTableName] = useState("");
  const [description, setDescription] = useState("");
  const [nextSession, setNextSession] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState([]);

  const isGM = user && selectedTable && user.uid === selectedTable.gmId;

  useEffect(() => {
    if (selectedTable) {
      setTableName(selectedTable.name || "");
      setDescription(selectedTable.description || "");
      setNextSession(selectedTable.nextSession || "");
      setExternalLink(selectedTable.externalLink || "");
      setIsPrivate(selectedTable.isPrivate ?? true);
      setInvites(selectedTable.invites || []);
      setIsEditing(false); // Reset edit mode on open
    }
  }, [selectedTable, tableDetailsModalOpen]);

  const handleAddInvite = () => {
    if (inviteEmail && !invites.includes(inviteEmail)) {
      setInvites([...invites, inviteEmail]);
      setInviteEmail("");
    }
  };

  const handleRemoveInvite = (emailToRemove) => {
    setInvites(invites.filter((email) => email !== emailToRemove));
  };

  const handleUpdate = async () => {
    if (!selectedTable?._id) return;
    setLoading(true);
    try {
      await APIService.updateTable(selectedTable._id, {
        name: tableName,
        description,
        nextSession,
        externalLink,
        isPrivate,
        invites,
      });

      // Identificar e enviar e-mail apenas para NOVOS convidados
      const oldInvites = selectedTable.invites || [];
      const newInvites = invites.filter((email) => !oldInvites.includes(email));

      if (newInvites.length > 0) {
        await Promise.all(
          newInvites.map((email) =>
            APIService.sendTableInvite(
              selectedTable._id,
              email,
              selectedTable.gmName,
              tableName,
            ),
          ),
        );
      }

      notifyTablesUpdated();
      toggleTableDetailsModal();
      showNotification("Mesa atualizada com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao atualizar: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja EXCLUIR esta mesa? Esta ação não pode ser desfeita.",
      )
    )
      return;

    setLoading(true);
    try {
      await APIService.deleteTable(selectedTable._id);
      notifyTablesUpdated();
      toggleTableDetailsModal();
      showNotification("Mesa excluída.", "info");
    } catch (error) {
      showNotification("Erro ao excluir: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTable) return null;

  return (
    <Dialog
      open={tableDetailsModalOpen}
      onClose={toggleTableDetailsModal}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {borderRadius: fullScreen ? 0 : 3},
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: isGM ? "#e3f2fd" : "#f5f5f5",
        }}
      >
        <Box>
          <Typography variant="h6" component="span" fontWeight="bold">
            {isGM ? "⚙️ Configurar Mesa" : "🛡️ Detalhes da Mesa"}
          </Typography>
          {!isGM && (
            <Typography variant="caption" display="block">
              Mestre: {selectedTable.gmName}
            </Typography>
          )}
        </Box>
        <IconButton onClick={toggleTableDetailsModal} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{mt: 1}}>
          {/* Modo Leitura vs Edição */}
          <Box>
            <TextField
              label="Nome da Mesa"
              fullWidth
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              disabled={!isGM}
              variant={isGM ? "outlined" : "filled"}
              sx={{mb: 2}}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isGM}
              variant={isGM ? "outlined" : "filled"}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Sessão & Links
            </Typography>
            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
              <TextField
                label="Próxima Sessão"
                type="datetime-local"
                fullWidth
                InputLabelProps={{shrink: true}}
                value={nextSession}
                onChange={(e) => setNextSession(e.target.value)}
                disabled={!isGM}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Link (Discord/VTT)"
                fullWidth
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                disabled={!isGM}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Jogadores & Convites
            </Typography>
            {isGM && (
              <Box sx={{display: "flex", gap: 1, mb: 2}}>
                <TextField
                  label="Convidar E-mail"
                  size="small"
                  fullWidth
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddInvite}>
                  <AddIcon />
                </Button>
              </Box>
            )}
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
              {invites.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={isGM ? () => handleRemoveInvite(email) : undefined}
                  icon={<EmailIcon fontSize="small" />}
                />
              ))}
              {invites.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  Nenhum convite ativo.
                </Typography>
              )}
            </Box>
          </Box>

          {isGM && (
            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              }
              label="Mesa Privada"
            />
          )}
        </Stack>
      </DialogContent>

      {isGM && (
        <DialogActions sx={{p: 2, justifyContent: "space-between"}}>
          <Button
            onClick={handleDelete}
            color="error"
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            Excluir Mesa
          </Button>
          <Box>
            <Button
              onClick={toggleTableDetailsModal}
              color="inherit"
              sx={{mr: 1}}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Salvar
            </Button>
          </Box>
        </DialogActions>
      )}
      {!isGM && (
        <DialogActions sx={{p: 2}}>
          <Button onClick={toggleTableDetailsModal}>Fechar</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default TableDetailsModal;
