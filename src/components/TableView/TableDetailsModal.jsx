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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
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
import {ConfirmDialog} from "@/components/ConfirmDialog";

function TableDetailsModal() {
  const {
    tableDetailsModalOpen,
    toggleTableDetailsModal,
    selectedTable,
    notifyTablesUpdated,
    showNotification,
    setSelectedTable,
    toggleInspectModal,
    inspectModalOpen,
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
  const [myCharacters, setMyCharacters] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [loadingFriend, setLoadingFriend] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isGM = user && selectedTable && user.uid === selectedTable.gmId;
  const isPlayer = user && selectedTable?.playerIds?.includes(user.uid);
  // Permite que o GM também veja a seleção de personagem (para testes ou ficha própria)
  const showCharacterSelection = isPlayer || isGM;

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

  // Buscar personagens do usuário se ele for jogador na mesa
  useEffect(() => {
    const fetchMyCharacters = async () => {
      if (showCharacterSelection && user && tableDetailsModalOpen) {
        try {
          const chars = await APIService.getAllCharacters(user.uid);
          setMyCharacters(chars);
        } catch (error) {
          console.error("Erro ao buscar personagens:", error);
        }
      }
    };
    fetchMyCharacters();
  }, [showCharacterSelection, user, tableDetailsModalOpen]);

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
        gmPhotoURL: user.photoURL,
      });

      // Identificar e enviar e-mail apenas para NOVOS convidados
      const oldInvites = selectedTable.invites || [];
      const newInvites = invites.filter((email) => !oldInvites.includes(email));

      if (newInvites.length > 0) {
        // Enviar sequencialmente para evitar Rate Limit (429)
        for (const email of newInvites) {
          await APIService.sendTableInvite(
            selectedTable._id,
            email,
            selectedTable.gmName,
            tableName,
          );
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }

      // Enviar e-mail de atualização para TODOS os participantes (Jogadores + Convidados + GM)
      // se não for apenas uma adição de convite (já tratado acima)
      const allParticipants = [
        ...(selectedTable.players || []).map((p) => p.email),
        ...(selectedTable.invites || []),
        user.email,
      ];
      // Remove duplicatas
      const uniqueEmails = [...new Set(allParticipants)].filter(
        (e) => !newInvites.includes(e),
      );

      if (uniqueEmails.length > 0) {
        const updateDetails = `Novas instruções: ${description}<br/>Próxima Sessão: ${new Date(nextSession).toLocaleString()}`;

        // Enviar sequencialmente para evitar Rate Limit (429)
        for (const email of uniqueEmails) {
          await APIService.sendTableUpdate(
            selectedTable._id,
            email,
            selectedTable.gmName,
            tableName,
            updateDetails,
          );
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }

      // Atualizar a mesa selecionada no store para refletir as mudanças imediatamente
      setSelectedTable({
        ...selectedTable,
        name: tableName,
        description,
        nextSession,
        externalLink,
        isPrivate,
        invites,
        gmPhotoURL: user.photoURL,
      });

      notifyTablesUpdated();
      toggleTableDetailsModal();
      showNotification("Mesa atualizada com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao atualizar: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false);
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

  const handleCharacterChange = async (characterId) => {
    if (!selectedTable || !user) return;
    setLoading(true);
    try {
      let isUserInPlayers = false;
      const updatedPlayers = (selectedTable.players || []).map((p) => {
        if (p.uid === user.uid) {
          isUserInPlayers = true;
          return {...p, characterId};
        }
        return p;
      });

      const updateData = {players: updatedPlayers};

      // Se for GM e não estiver na lista de jogadores, salva em um campo específico
      if (isGM && !isUserInPlayers) {
        updateData.gmCharacterId = characterId;
      }

      await APIService.updateTable(selectedTable._id, updateData);

      setSelectedTable({...selectedTable, ...updateData});
      notifyTablesUpdated();
      showNotification("Personagem vinculado com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao vincular personagem.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFriendSheet = async (player) => {
    setLoadingFriend(true);
    setFriendModalOpen(true);
    try {
      let charData = null;
      if (player.characterId) {
        charData = await APIService.getCharacterById(player.characterId);
      } else if (player.uid) {
        charData = await APIService.getCharacter(player.uid);
      }

      if (charData) {
        setFriendData(charData);
      } else {
        showNotification("Jogador sem ficha vinculada.", "warning");
        setFriendModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      showNotification("Erro ao carregar dados do jogador.", "error");
      setFriendModalOpen(false);
    } finally {
      setLoadingFriend(false);
    }
  };

  const handleOpenPlayerSheet = async (player) => {
    if (!isGM && player.uid !== user?.uid) {
      showNotification(
        "Apenas o Mestre pode ver a ficha de outros jogadores.",
        "warning",
      );
      return;
    }
    setLoading(true);
    try {
      let charData = null;

      if (player.characterId) {
        console.log(
          `[TableDetails] Buscando ficha vinculada (ID: ${player.characterId})`,
        );
        charData = await APIService.getCharacterById(player.characterId);
      } else if (player.uid) {
        console.log(
          `[TableDetails] Jogador sem vínculo. Buscando ficha principal (UID: ${player.uid})`,
        );
        charData = await APIService.getCharacter(player.uid);
      }

      if (charData) {
        setInspectedCharacter(charData);
        if (!inspectModalOpen) toggleInspectModal();
        toggleTableDetailsModal();
        showNotification(`Visualizando ficha de ${player.name}`, "success");
      } else {
        showNotification("Jogador sem ficha vinculada.", "warning");
      }
    } catch (error) {
      console.error(error);
      showNotification("Erro ao carregar ficha.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTable) return null;

  // Encontrar o personagem selecionado atualmente pelo jogador
  let currentCharacterId = "";
  if (isPlayer) {
    const currentPlayer = selectedTable?.players?.find(
      (p) => p.uid === user?.uid,
    );
    currentCharacterId = currentPlayer?.characterId || "";
  } else if (isGM) {
    currentCharacterId = selectedTable?.gmCharacterId || "";
  }

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

      <DialogContent dividers sx={{p: 0}}>
        <Box sx={{borderBottom: 1, borderColor: "divider", px: 2}}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Detalhes" />
            <Tab label="Jogadores" />
          </Tabs>
        </Box>

        <Box sx={{p: {xs: 2, sm: 3}}}>
          {currentTab === 0 && (
            <Stack spacing={3}>
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
                </Stack>
              </Box>
            </Stack>
          )}

          {currentTab === 1 && (
            <Stack spacing={3}>
              {/* Configuração do Jogador (Vincular Ficha) */}
              {showCharacterSelection && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#e3f2fd",
                    borderRadius: 2,
                    border: "1px solid #90caf9",
                  }}
                >
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    👤 Meu Personagem
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    paragraph
                  >
                    Escolha qual ficha você usará nesta mesa. Isso permite que o
                    GM veja seu status.
                  </Typography>
                  <FormControl fullWidth size="small" sx={{bgcolor: "white"}}>
                    <InputLabel>Selecione seu Personagem</InputLabel>
                    <Select
                      value={currentCharacterId}
                      label="Selecione seu Personagem"
                      onChange={(e) => handleCharacterChange(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Nenhum (Apenas espectador)</em>
                      </MenuItem>
                      {myCharacters.map((char) => (
                        <MenuItem key={char._id} value={char._id}>
                          {char.nome} ({char.rank} - {char.arquetipo})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

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
                          onDoubleClick={() =>
                            isGM || player.uid === user?.uid
                              ? handleOpenPlayerSheet(player)
                              : handleOpenFriendSheet(player)
                          }
                          title={
                            isGM || player.uid === user?.uid
                              ? "Clique duplo para ver a ficha"
                              : player.name
                          }
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
          )}
        </Box>
      </DialogContent>

      {isGM && (
        <DialogActions sx={{p: 2, justifyContent: "space-between"}}>
          <Button
            onClick={handleDeleteClick}
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

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Mesa"
      >
        <p>
          Tem certeza que deseja EXCLUIR esta mesa? Esta ação não pode ser
          desfeita.
        </p>
      </ConfirmDialog>

      {/* Modal de Perfil Resumido (Ver Amigo) */}
      <Dialog
        open={friendModalOpen}
        onClose={() => setFriendModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Licença de Caçador
          </Typography>
          <IconButton onClick={() => setFriendModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{bgcolor: "#f8fafc", p: {xs: 2, md: 4}}}>
          {loadingFriend ? (
            <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
              <CircularProgress />
            </Box>
          ) : friendData ? (
            <Grid container spacing={4}>
              {/* FOTO - Coluna Esquerda */}
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 1.5,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#fff",
                    borderRadius: 2,
                  }}
                >
                  {friendData.imagem_url ? (
                    <Box
                      component="img"
                      src={friendData.imagem_url}
                      alt={friendData.nome}
                      sx={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "3/4",
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <Avatar
                      src=""
                      sx={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "3/4",
                        borderRadius: 1,
                      }}
                      variant="rounded"
                    >
                      <PersonIcon sx={{fontSize: 80}} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      width: "100%",
                      mt: 2,
                      textAlign: "center",
                      p: 1,
                      bgcolor: "#1e293b",
                      color: "#fff",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{letterSpacing: 2, textTransform: "uppercase"}}
                    >
                      RANK {friendData.rank || "Novato"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* DADOS - Coluna Direita */}
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: 3,
                  }}
                >
                  <Box sx={{borderBottom: "2px solid #cbd5e1", pb: 2}}>
                    <Typography
                      variant="h4"
                      fontWeight="900"
                      color="#0f172a"
                      sx={{textTransform: "uppercase", lineHeight: 1.1}}
                    >
                      {friendData.nome || "Caçador Sem Nome"}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight="bold"
                      sx={{mt: 0.5}}
                    >
                      {friendData.arquetipo || "Arquétipo Desconhecido"}{" "}
                      {friendData.conceito ? `• ${friendData.conceito}` : ""}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        GUILDA
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.guilda || "Independente"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        IDADE
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.idade || "Desconhecida"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        ALTURA
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.altura || "Não informada"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        PESO
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.peso || "Não informado"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{mt: "auto", pt: 2, borderTop: "1px dashed #cbd5e1"}}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.secondary"
                      gutterBottom
                    >
                      EQUIPAMENTO REGISTRADO
                    </Typography>
                    <Box
                      sx={{display: "flex", flexDirection: "column", gap: 1}}
                    >
                      {friendData.armas?.length > 0
                        ? friendData.armas.slice(0, 3).map((w, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                bgcolor: "#f1f5f9",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                ⚔️ {w.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Dano: {w.damage || "—"}
                              </Typography>
                            </Box>
                          ))
                        : null}
                      {friendData.armaduras?.length > 0
                        ? friendData.armaduras.slice(0, 2).map((a, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                bgcolor: "#f1f5f9",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                🛡️ {a.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Def: +{a.defense || a.def || 0}
                              </Typography>
                            </Box>
                          ))
                        : null}
                      {!friendData.armas?.length &&
                        !friendData.armaduras?.length && (
                          <Typography variant="body2" color="text.secondary">
                            Nenhum equipamento registrado.
                          </Typography>
                        )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography>Dados não encontrados.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default TableDetailsModal;
