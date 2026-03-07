/**
 * CreateTableModal Component
 * Modal/Tela para criação e configuração de Mesa de RPG
 */

"use client";

import React, {useState} from "react";
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
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";

function CreateTableModal() {
  const {
    tableCreateModalOpen,
    toggleTableCreateModal,
    toggleTableListModal,
    showNotification,
    setSelectedTable,
  } = useUIStore();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  // Form States
  const [tableName, setTableName] = useState("");
  const [description, setDescription] = useState("");
  const [nextSession, setNextSession] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  // Invite System
  const [inviteEmail, setInviteEmail] = useState("gustavocrsilva.ti@gmail.com");
  const [invites, setInvites] = useState([]);

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

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const tableData = {
        name: tableName,
        description,
        nextSession,
        externalLink,
        isPrivate,
        invites,
        gmId: user.uid,
        gmName: user.displayName || "GM Desconhecido",
        gmPhotoURL: user.photoURL,
      };

      const newTable = await APIService.createTable(tableData);

      // Enviar convites por email
      if (invites.length > 0) {
        await Promise.all(
          invites.map((email) =>
            APIService.sendTableInvite(
              newTable._id,
              email,
              user.displayName,
              tableName,
            ),
          ),
        );
      }

      // Limpar form e fechar
      setTableName("");
      setInvites([]);
      setSelectedTable(newTable);
      toggleTableCreateModal();
      toggleTableListModal(); // Abre a lista para ver a mesa criada
      showNotification("Mesa criada com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao criar mesa: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={tableCreateModalOpen}
      onClose={toggleTableCreateModal}
      fullScreen
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          padding: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          🏰 Criar Nova Mesa
        </Typography>
        <IconButton onClick={toggleTableCreateModal} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{mt: 1}}>
          {/* Informações Básicas */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Configurações Principais
            </Typography>
            <TextField
              autoFocus
              label="Jogo"
              placeholder="Ex: A Torre dos Demônios"
              fullWidth
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              variant="outlined"
              sx={{mb: 2}}
            />
            <TextField
              label="Descrição / Sinopse"
              placeholder="Breve resumo da campanha..."
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          {/* Logística */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Logística & Sessão
            </Typography>
            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
              <TextField
                label="Próxima Sessão"
                type="datetime-local"
                fullWidth
                InputLabelProps={{shrink: true}}
                value={nextSession}
                onChange={(e) => setNextSession(e.target.value)}
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
                placeholder="https://..."
                fullWidth
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
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

          {/* Convites */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Convidar Jogadores
            </Typography>
            <Box sx={{display: "flex", gap: 1, mb: 2}}>
              <TextField
                label="E-mail do Jogador"
                placeholder="jogador@email.com"
                fullWidth
                size="small"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddInvite}
                disabled={!inviteEmail}
              >
                <AddIcon />
              </Button>
            </Box>

            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
              {invites.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={() => handleRemoveInvite(email)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {invites.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  Nenhum convite adicionado ainda.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Privacidade */}
          {/* <FormControlLabel
            control={
              <Switch
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
            }
            label={
              isPrivate
                ? "🔒 Mesa Privada (Apenas convidados)"
                : "🌍 Mesa Pública (Listada no Hub)"
            }
          /> */}
        </Stack>
      </DialogContent>

      <DialogActions sx={{p: 2}}>
        {/* <Button onClick={toggleTableCreateModal} color="inherit">
          Cancelar
        </Button> */}
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!tableName || loading}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            px: 4,
          }}
        >
          {loading ? "Criando..." : "Criar Mesa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTableModal;
