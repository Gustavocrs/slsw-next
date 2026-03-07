/**
 * GameModal Component
 * Painel de Jogo (Dashboard da Sessão)
 */

"use client";

import React, {useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  List,
  ListItem,
  ListItemAvatar,
  Button,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Description as SheetIcon,
  Message as MessageIcon,
  AttachFile as FileIcon,
  Security as GmIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import {
  BsFiletypePdf,
  BsFiletypeXls,
  BsFiletypeDoc,
  BsFiletypePpt,
  BsFiletypeTxt,
  BsCardImage,
  BsFileEarmark,
} from "react-icons/bs";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";

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
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxLoading, setLightboxLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [customFileName, setCustomFileName] = useState("");

  const isGM = selectedTable?.gmId === user?.uid;

  const handlePlayerClick = (event, player) => {
    // Lógica de Permissão de Clique
    if (isGM) {
      // GM pode clicar em qualquer um (exceto ele mesmo, opcional)
      if (player.uid === user.uid) return;
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
    if (selectedPlayer && selectedPlayer.characterId) {
      try {
        const charData = await APIService.getCharacterById(
          selectedPlayer.characterId,
        );
        if (charData) {
          setInspectedCharacter(charData);
          toggleInspectModal();
          showNotification(
            `Visualizando ficha de ${selectedPlayer.name}`,
            "success",
          );
        }
      } catch (error) {
        console.error(error);
        if (error.code === "permission-denied") {
          showNotification(
            "Sem permissão para ver esta ficha. Atualize as regras do Firebase.",
            "error",
          );
        } else {
          showNotification("Erro ao carregar ficha.", "error");
        }
      }
    } else {
      showNotification("Jogador sem ficha vinculada.", "warning");
    }
    handleCloseMenu();
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileToUpload(file);
    setCustomFileName(file.name); // Sugere o nome original
    setUploadModalOpen(true);
    event.target.value = ""; // Limpa o input para permitir selecionar o mesmo arquivo novamente
  };

  const handleConfirmUpload = async () => {
    if (!fileToUpload || !selectedTable) return;

    setUploading(true);
    try {
      const attachment = await APIService.uploadTableAttachment(
        selectedTable._id,
        fileToUpload,
      );

      // Sobrescreve o nome com o escolhido pelo usuário
      attachment.name = customFileName || attachment.name;

      // Atualizar a mesa com o novo arquivo
      const updatedFiles = [...(selectedTable.files || []), attachment];
      await APIService.updateTable(selectedTable._id, {files: updatedFiles});

      // Atualizar estado local
      setSelectedTable({...selectedTable, files: updatedFiles});
      showNotification("Arquivo anexado com sucesso!", "success");
      setUploadModalOpen(false);
      setFileToUpload(null);
    } catch (error) {
      console.error(error);
      showNotification("Erro ao enviar arquivo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileUrl) => {
    if (!confirm("Remover este arquivo?")) return;
    try {
      const updatedFiles = selectedTable.files.filter((f) => f.url !== fileUrl);
      await APIService.updateTable(selectedTable._id, {files: updatedFiles});
      setSelectedTable({...selectedTable, files: updatedFiles});
      showNotification("Arquivo removido.", "info");
    } catch (error) {
      showNotification("Erro ao remover arquivo.", "error");
    }
  };

  const handleViewFile = async (file) => {
    const isImg =
      file.type?.startsWith("image/") ||
      file.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

    if (isImg) {
      setLightboxSrc(null);
      setLightboxLoading(true);
      setLightboxOpen(true);

      try {
        // Gera o Blob via fetch para evitar abrir nova aba/janela
        const response = await fetch(file.url);
        if (!response.ok) throw new Error("Erro ao carregar arquivo");

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setLightboxSrc(objectUrl);
      } catch (error) {
        console.error("Erro ao gerar blob da imagem:", error);
        showNotification("Erro ao carregar imagem.", "error");
        setLightboxOpen(false);
      } finally {
        setLightboxLoading(false);
      }
    } else {
      // Para outros arquivos, força o download direto
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper para renderizar ícone ou thumbnail baseado no tipo de arquivo
  const getFileIcon = (file) => {
    const type = file.type?.toLowerCase() || "";
    const name = file.name?.toLowerCase() || "";
    const size = 26;

    // PDF
    if (type.includes("pdf") || name.endsWith(".pdf")) {
      return <BsFiletypePdf size={size} color="#d32f2f" />;
    }

    // Excel / Planilhas
    if (
      type.includes("sheet") ||
      type.includes("excel") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".csv")
    ) {
      return <BsFiletypeXls size={size} color="#2e7d32" />;
    }

    // Word / Documentos
    if (
      type.includes("word") ||
      type.includes("document") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return <BsFiletypeDoc size={size} color="#1976d2" />;
    }

    // PowerPoint / Apresentações
    if (
      type.includes("presentation") ||
      type.includes("powerpoint") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptx")
    ) {
      return <BsFiletypePpt size={size} color="#f57c00" />;
    }

    // Texto
    if (type.includes("text") || name.endsWith(".txt")) {
      return <BsFiletypeTxt size={size} color="#616161" />;
    }

    // Imagens
    if (
      type.startsWith("image/") ||
      name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)
    ) {
      return <BsCardImage size={size} color="#7b1fa2" />;
    }

    // Genérico
    return <BsFileEarmark size={size} color="#9e9e9e" />;
  };

  // Helper para nome amigável
  const getFileDisplayName = (file) => {
    return file.name || "Arquivo Anexado";
  };

  if (!selectedTable) return null;

  return (
    <>
      {/* Lightbox para Imagens */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="xl"
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
            minWidth: 300,
          }}
        >
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {bgcolor: "rgba(0,0,0,0.7)"},
            }}
          >
            <CloseIcon />
          </IconButton>
          {lightboxLoading ? (
            <CircularProgress sx={{color: "white"}} />
          ) : (
            lightboxSrc && (
              <img
                src={lightboxSrc}
                alt="Visualização"
                style={{maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8}}
              />
            )
          )}
        </Box>
      </Dialog>

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
              <Box sx={{mb: 3}}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Materiais & Anexos
                  </Typography>
                  {isGM && (
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<UploadIcon />}
                      size="small"
                      disabled={uploading}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      Anexar Arquivo
                      <input type="file" hidden onChange={handleFileSelect} />
                    </Button>
                  )}
                </Box>

                <Paper sx={{borderRadius: 2, overflow: "hidden"}} elevation={0}>
                  <List disablePadding>
                    {selectedTable.files && selectedTable.files.length > 0 ? (
                      selectedTable.files.map((file, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <Divider />}
                          <ListItem
                            secondaryAction={
                              <Box sx={{display: "flex", gap: 1}}>
                                <IconButton
                                  edge="end"
                                  aria-label="download"
                                  href={file.url}
                                  download
                                  target="_blank"
                                  title="Baixar"
                                >
                                  <DownloadIcon />
                                </IconButton>
                                {isGM && (
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteFile(file.url)}
                                    color="error"
                                    title="Excluir"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>
                            }
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 40,
                                cursor:
                                  file.type?.startsWith("image/") ||
                                  file.name?.match(
                                    /\.(jpg|jpeg|png|gif|webp|svg)$/i,
                                  )
                                    ? "pointer"
                                    : "default",
                              }}
                              onClick={() => handleViewFile(file)}
                            >
                              {getFileIcon(file)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  component="span"
                                  variant="body1"
                                  onClick={() => handleViewFile(file)}
                                  sx={{
                                    fontWeight: 600,
                                    display: "block",
                                    wordBreak: "break-word",
                                    cursor: "pointer",
                                    color: "primary.main",
                                    textDecoration: "underline",
                                    "&:hover": {
                                      color: "primary.dark",
                                    },
                                  }}
                                >
                                  {getFileDisplayName(file)}
                                </Typography>
                              }
                              secondary={new Date(
                                file.uploadedAt,
                              ).toLocaleDateString()}
                            />
                          </ListItem>
                        </React.Fragment>
                      ))
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        <Typography variant="body2">
                          Nenhum material anexado.{" "}
                          {isGM
                            ? "Faça upload de mapas, imagens ou PDFs."
                            : "O GM ainda não disponibilizou arquivos."}
                        </Typography>
                      </Box>
                    )}
                  </List>
                </Paper>
              </Box>
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
              <Divider textAlign="left" sx={{mb: 2}}>
                <Chip label="Jogadores" size="small" />
              </Divider>

              {/* Lista Combinada: GM + Jogadores */}
              <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                {[
                  {
                    uid: selectedTable.gmId,
                    name: selectedTable.gmName,
                    isGM: true,
                    // Usa a foto salva na mesa, ou a do usuário atual se for o GM
                    photoURL:
                      selectedTable.gmPhotoURL ||
                      (isGM ? user?.photoURL : null),
                  },
                  ...(selectedTable.players || []),
                ].map((player) => {
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
                        badgeContent={
                          player.isGM ? (
                            <GmIcon
                              sx={{
                                width: 14,
                                height: 14,
                                color: "#f57c00",
                                bgcolor: "white",
                                borderRadius: "50%",
                              }}
                            />
                          ) : null
                        }
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
                          {player.isGM
                            ? "Game Master"
                            : isGM
                              ? "Ver opções"
                              : "Jogador"}
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

      {/* Modal de Confirmação de Upload */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => !uploading && setUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nomear Arquivo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
            Defina um nome para identificar este arquivo na lista de anexos.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Arquivo"
            fullWidth
            variant="outlined"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUploadModalOpen(false)}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmUpload}
            variant="contained"
            disabled={uploading}
          >
            {uploading ? "Enviando..." : "Salvar Anexo"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GameModal;
