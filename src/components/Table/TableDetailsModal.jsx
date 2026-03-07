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
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  InputAdornment,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Send as SendIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";

function TableDetailsModal() {
  const {
    tableDetailsModalOpen,
    toggleTableDetailsModal,
    selectedTable,
    notifyTablesUpdated,
    showNotification,
    setSelectedTable,
    toggleInspectModal,
  } = useUIStore();
  const {loadCharacter, setInspectedCharacter} = useCharacterStore();
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
    const email = inviteEmail.trim().toLowerCase();
    if (email && !invites.includes(email)) {
      setInvites([...invites, email]);
      setInviteEmail("");
    }
  };

  const handleRemoveInvite = (emailToRemove) => {
    setInvites(invites.filter((email) => email !== emailToRemove));
  };

  const handleResendInvite = async (email) => {
    if (!selectedTable) return;
    try {
      showNotification(`Reenviando convite para ${email}...`, "info");
      await APIService.sendTableInvite(
        selectedTable._id,
        email,
        selectedTable.gmName,
        selectedTable.name,
      );
      showNotification(`Convite reenviado para ${email}!`, "success");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao reenviar convite.", "error");
    }
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

      // Enviar e-mail de atualização para TODOS os participantes (Jogadores + Convidados)
      // se não for apenas uma adição de convite (já tratado acima)
      const allParticipants = [
        ...(selectedTable.players || []).map((p) => p.email),
        ...(selectedTable.invites || []),
      ];
      // Remove duplicatas e o próprio GM se estiver na lista
      const uniqueEmails = [...new Set(allParticipants)].filter(
        (e) => e !== user.email && !newInvites.includes(e),
      );

      if (uniqueEmails.length > 0) {
        const updateDetails = `Novas instruções: ${description}<br/>Próxima Sessão: ${new Date(nextSession).toLocaleString()}`;
        await Promise.all(
          uniqueEmails.map((email) =>
            APIService.sendTableUpdate(
              selectedTable._id,
              email,
              selectedTable.gmName,
              tableName,
              updateDetails,
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
      setSelectedTable(null);
      showNotification("Mesa excluída.", "info");
    } catch (error) {
      showNotification("Erro ao excluir: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlayerSheet = async (player) => {
    if (!player.characterId) {
      showNotification("Este jogador não possui ficha vinculada.", "warning");
      return;
    }

    setLoading(true);
    try {
      const charData = await APIService.getCharacterById(player.characterId);
      if (charData) {
        setInspectedCharacter(charData);
        toggleInspectModal();
        showNotification(`Visualizando ficha de ${player.name}`, "success");
      } else {
        showNotification("Ficha não encontrada.", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Erro ao carregar ficha.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTable) return null;

  return (
    <Dialog
      open={tableDetailsModalOpen}
      onClose={toggleTableDetailsModal}
      fullScreen
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {borderRadius: 0},
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
              GM: {selectedTable.gmName}
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
              label="Jogo"
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
              rows={1}
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

            {/* Jogadores Confirmados */}
            {selectedTable?.players?.length > 0 && (
              <Box sx={{mb: 2}}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{mb: 1, display: "block"}}
                >
                  Jogadores na Mesa:
                </Typography>
                <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
                  {selectedTable.players.map((player) => (
                    <Chip
                      key={player.uid}
                      icon={<PersonIcon fontSize="small" />}
                      label={player.name}
                      color="primary"
                      size="small"
                      onDoubleClick={() => handleOpenPlayerSheet(player)}
                      title="Clique duplo para ver a ficha"
                    />
                  ))}
                </Box>
              </Box>
            )}

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

            {/* Lista de Convites com Ações */}
            <List dense sx={{bgcolor: "#f9f9f9", borderRadius: 2, mb: 2}}>
              {invites.map((email) => (
                <ListItem key={email} divider>
                  <Box
                    sx={{
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      color: "text.secondary",
                    }}
                  >
                    <EmailIcon fontSize="small" />
                  </Box>
                  <ListItemText
                    primary={email}
                    secondary="Pendente"
                    primaryTypographyProps={{fontWeight: 500}}
                  />
                  {isGM && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="resend"
                        onClick={() => handleResendInvite(email)}
                        sx={{mr: 1, color: "#667eea"}}
                        title="Reenviar E-mail"
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveInvite(email)}
                        color="error"
                        title="Remover"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
              {invites.length === 0 && (
                <ListItem>
                  <ListItemText secondary="Nenhum convite ativo." />
                </ListItem>
              )}
            </List>
          </Box>

          {/* {isGM && (
            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              }
              label="Mesa Privada"
            />
          )} */}
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
            {/* <Button
              onClick={toggleTableDetailsModal}
              color="inherit"
              sx={{mr: 1}}
            >
              Cancelar
            </Button> */}
            <Button
              onClick={handleUpdate}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Atualizar Mesa
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
