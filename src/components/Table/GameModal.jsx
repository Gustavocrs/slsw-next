/**
 * GameModal Component
 * Painel de Jogo (Dashboard da Sessão)
 */

"use client";

import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Divider,
  Chip,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Description as SheetIcon,
  Message as MessageIcon,
  AttachFile as FileIcon,
  Security as GmIcon,
  PersonRemove as PersonRemoveIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase";
import GameFileManager from "@/components/GameFileManager";

function GameModal() {
  const {
    gameModalOpen,
    toggleGameModal,
    selectedTable,
    showNotification,
    toggleTableDetailsModal,
    setSelectedTable,
    toggleInspectModal,
  } = useUIStore();
  const {loadCharacter, setInspectedCharacter} = useCharacterStore();
  const {user} = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isGM = selectedTable?.gmId === user?.uid;

  // Efeito para sincronização em tempo real e verificação de segurança
  useEffect(() => {
    if (!gameModalOpen || !selectedTable?._id || !user) return;

    const tableRef = doc(db, "tables", selectedTable._id);

    const unsubscribe = onSnapshot(tableRef, (docSnap) => {
      if (!docSnap.exists()) {
        toggleGameModal();
        showNotification("Esta mesa foi excluída.", "warning");
        return;
      }

      const data = {_id: docSnap.id, ...docSnap.data()};

      // VERIFICAÇÃO: O usuário ainda tem permissão para ver a mesa?
      const isUserGM = data.gmId === user.uid;
      const isUserPlayer = data.playerIds?.includes(user.uid);

      if (!isUserGM && !isUserPlayer) {
        toggleGameModal();
        showNotification("Você não faz mais parte desta mesa.", "error");
        return;
      }

      // Atualiza os dados da mesa em tempo real (jogadores, arquivos, etc)
      setSelectedTable(data);
    });

    return () => unsubscribe();
  }, [
    gameModalOpen,
    selectedTable?._id,
    user,
    toggleGameModal,
    setSelectedTable,
    showNotification,
  ]);

  const handlePlayerClick = (event, player) => {
    // 1. Permitir clicar em si mesmo (para ver ficha ou configurar)
    if (player.uid === user?.uid) {
      setAnchorEl(event.currentTarget);
      setSelectedPlayer(player);
      return;
    }

    // 2. Lógica de Permissão para outros
    if (isGM) {
      // GM pode clicar em qualquer um
      setAnchorEl(event.currentTarget);
      setSelectedPlayer(player);
    } else {
      // Jogador só pode clicar no GM
      if (player.isGM) {
        setAnchorEl(event.currentTarget);
        setSelectedPlayer(player);
      }
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPlayer(null);
  };

  const handleViewSheet = async () => {
    handleCloseMenu();
    if (!selectedPlayer) return;

    try {
      showNotification("Buscando ficha do jogador...", "info");
      let charData = null;

      // 1. Prioridade: Buscar pelo ID da ficha vinculada à mesa
      if (selectedPlayer.characterId) {
        console.log(
          `[GameModal] Buscando ficha vinculada (ID: ${selectedPlayer.characterId})`,
        );
        charData = await APIService.getCharacterById(
          selectedPlayer.characterId,
        );
      }
      // 2. Fallback: Apenas se não houver vínculo, busca a ficha principal do usuário
      else if (selectedPlayer.uid) {
        console.log(
          `[GameModal] Jogador sem vínculo. Buscando ficha principal (UID: ${selectedPlayer.uid})`,
        );
        charData = await APIService.getCharacter(selectedPlayer.uid);
      }

      if (charData) {
        setInspectedCharacter(charData);
        toggleInspectModal();
        showNotification(
          `Visualizando ficha de ${selectedPlayer.name}`,
          "success",
        );
      } else {
        showNotification("Jogador sem ficha vinculada.", "warning");
      }
    } catch (error) {
      console.error("Erro ao visualizar ficha:", error);
      showNotification("Erro ao carregar ficha.", "error");
    }
  };

  const handleSendMessage = () => {
    showNotification(
      `Enviar mensagem para ${selectedPlayer?.name || "Jogador"} (Em breve)`,
      "info",
    );
    handleCloseMenu();
  };

  const handleRequestFile = () => {
    showNotification(
      `Solicitar arquivo de ${selectedPlayer?.name || "Jogador"} (Em breve)`,
      "info",
    );
    handleCloseMenu();
  };

  const handleRemovePlayer = async () => {
    if (!selectedPlayer || !selectedTable) return;

    if (
      !confirm(`Tem certeza que deseja remover ${selectedPlayer.name} da mesa?`)
    ) {
      handleCloseMenu();
      return;
    }

    try {
      await APIService.removePlayer(selectedTable._id, selectedPlayer.uid);

      // Atualizar estado local removendo o jogador da lista
      const updatedPlayers = selectedTable.players.filter(
        (p) => p.uid !== selectedPlayer.uid,
      );
      setSelectedTable({...selectedTable, players: updatedPlayers});
      showNotification(`${selectedPlayer.name} removido da mesa.`, "info");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao remover jogador.", "error");
    }
    handleCloseMenu();
  };

  if (!selectedTable) return null;
  const gmData = {
    uid: selectedTable.gmId,
    name: selectedTable.gmName,
    isGM: true,
    photoURL: selectedTable.gmPhotoURL || (isGM ? user?.photoURL : null),
  };

  return (
    <>
      <Dialog
        open={gameModalOpen}
        onClose={toggleGameModal}
        fullScreen
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
          <Typography variant="h6" component="span" fontWeight="bold">
            🎮 Painel de Jogo: {selectedTable.name}
          </Typography>
          <IconButton onClick={toggleGameModal} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{bgcolor: "#f5f7fa", p: 0}}>
          <Grid container sx={{minHeight: "100%"}}>
            {/* Coluna Esquerda: Configurações */}
            <Grid item xs={12} md={9} sx={{p: 3}}>
              <Box sx={{mb: 3}}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  fontWeight="bold"
                >
                  Dados da Campanha
                </Typography>
                <Paper sx={{p: 2, borderRadius: 2}} elevation={0}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      color: "text.secondary",
                      mb: 2,
                    }}
                  >
                    <GmIcon fontSize="small" />
                    <Typography variant="subtitle1">
                      GM: <strong>{selectedTable.gmName}</strong>
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    paragraph
                    sx={{whiteSpace: "pre-wrap"}}
                  >
                    {selectedTable.description || "Sem descrição disponível."}
                  </Typography>

                  <Divider sx={{my: 2}} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Próxima Sessão
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedTable.nextSession
                          ? new Date(selectedTable.nextSession).toLocaleString()
                          : "Não agendada"}
                      </Typography>
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Link Externo
                    </Typography>
                    <Typography variant="body2">
                      {selectedTable.externalLink ? (
                        <a
                          href={selectedTable.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{color: "#667eea", textDecoration: "none"}}
                        >
                          Acessar Link 🔗
                        </a>
                      ) : (
                        "Nenhum link"
                      )}
                    </Typography>
                  </Grid> */}
                  </Grid>
                </Paper>
              </Box>

              {/* Seção de Materiais e Anexos */}
              <GameFileManager
                tableId={selectedTable._id}
                files={selectedTable.files || []}
                isGM={isGM}
              />
            </Grid>

            {/* Coluna Direita: Lista de Jogadores */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                bgcolor: "#fff",
                borderLeft: {md: "1px solid #e0e0e0"},
                p: 2,
                overflowY: "auto",
              }}
            >
              {/* Seção do Game Master */}
              <Divider textAlign="left" sx={{mb: 2, mt: 1}}>
                <Chip label="Game Master" size="small" color="secondary" />
              </Divider>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#f5f7fa",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                  },
                  border: "1px solid #e0e0e0",
                  mb: 3,
                }}
                onClick={(e) => handlePlayerClick(e, gmData)}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                  badgeContent={
                    <GmIcon
                      sx={{
                        width: 14,
                        height: 14,
                        color: "#f57c00",
                        bgcolor: "white",
                        borderRadius: "50%",
                      }}
                    />
                  }
                >
                  <Avatar
                    src={
                      gmData.photoURL?.includes("googleusercontent.com")
                        ? gmData.photoURL.replace("=s96-c", "=s100-c")
                        : gmData.photoURL
                    }
                    alt={gmData.name}
                    sx={{width: 40, height: 40}}
                    imgProps={{referrerPolicy: "no-referrer"}}
                  />
                </Badge>
                <Box sx={{overflow: "hidden", ml: 1}}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {gmData.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Game Master
                  </Typography>
                </Box>
              </Paper>

              {/* Seção dos Jogadores */}
              <Divider textAlign="left" sx={{mb: 2}}>
                <Chip label="Jogadores" size="small" />
              </Divider>

              <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                {(selectedTable.players || []).map((player) => {
                  const safePhotoURL = player.photoURL?.includes(
                    "googleusercontent.com",
                  )
                    ? player.photoURL.replace("=s96-c", "=s100-c")
                    : player.photoURL;

                  return (
                    <Paper
                      key={player.uid}
                      elevation={0}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "#f5f7fa",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                        },
                        border: "1px solid #e0e0e0",
                      }}
                      onClick={(e) => handlePlayerClick(e, player)}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                      >
                        <Avatar
                          src={safePhotoURL}
                          alt={player.name}
                          sx={{width: 40, height: 40}}
                          imgProps={{referrerPolicy: "no-referrer"}}
                        />
                      </Badge>
                      <Box sx={{overflow: "hidden", ml: 1}}>
                        <Typography variant="body2" fontWeight="bold" noWrap>
                          {player.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {isGM ? "Ver opções" : "Jogador"}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Grid>
          </Grid>

          {/* Menu de Opções do Jogador */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              elevation: 3,
              sx: {minWidth: 180},
            }}
          >
            {/* Opções para o próprio usuário (Self) */}
            {selectedPlayer?.uid === user?.uid && (
              <div>
                <MenuItem onClick={handleViewSheet}>
                  <ListItemIcon>
                    <SheetIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ver Minha Ficha</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    toggleTableDetailsModal();
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Trocar Personagem</ListItemText>
                </MenuItem>
                <Divider />
              </div>
            )}

            {/* Opções exclusivas para o GM (ao clicar em jogadores) */}
            {isGM &&
              !selectedPlayer?.isGM && [
                <MenuItem key="view-sheet" onClick={handleViewSheet}>
                  <ListItemIcon>
                    <SheetIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ver Ficha</ListItemText>
                </MenuItem>,
                <MenuItem key="req-file" onClick={handleRequestFile}>
                  <ListItemIcon>
                    <FileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Solicitar Arquivo</ListItemText>
                </MenuItem>,
                <Divider key="divider-kick" />,
                <MenuItem key="remove-player" onClick={handleRemovePlayer}>
                  <ListItemIcon>
                    <PersonRemoveIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{color: "error.main"}}>
                    Remover Jogador
                  </ListItemText>
                </MenuItem>,
              ]}

            <MenuItem onClick={handleSendMessage}>
              <ListItemIcon>
                <MessageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Enviar Msg</ListItemText>
            </MenuItem>
          </Menu>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GameModal;
