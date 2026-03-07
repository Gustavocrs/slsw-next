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
} from "@mui/material";
import {
  Close as CloseIcon,
  Description as SheetIcon,
  Message as MessageIcon,
  AttachFile as FileIcon,
  Security as GmIcon,
  InsertDriveFile as DocIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Slideshow as PptIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedTable) return;

    setUploading(true);
    try {
      const attachment = await APIService.uploadTableAttachment(
        selectedTable._id,
        file,
      );

      // Atualizar a mesa com o novo arquivo
      const updatedFiles = [...(selectedTable.files || []), attachment];
      await APIService.updateTable(selectedTable._id, {files: updatedFiles});

      // Atualizar estado local
      setSelectedTable({...selectedTable, files: updatedFiles});
      showNotification("Arquivo anexado com sucesso!", "success");
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

  // Helper para renderizar ícone ou thumbnail baseado no tipo de arquivo
  const getFileIcon = (file) => {
    const type = file.type?.toLowerCase() || "";
    const name = file.name?.toLowerCase() || "";

    // Imagem: Renderiza Thumbnail
    if (
      type.startsWith("image/") ||
      name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)
    ) {
      return (
        <Avatar
          src={file.url}
          variant="rounded"
          sx={{width: 48, height: 48, mr: 1, border: "1px solid #e0e0e0"}}
          imgProps={{style: {objectFit: "cover"}}}
        >
          <ImageIcon />
        </Avatar>
      );
    }

    // Documentos: Renderiza Ícone Específico
    let Icon = DocIcon;
    let color = "#757575";
    let bg = "#f5f5f5";

    if (type.includes("pdf") || name.endsWith(".pdf")) {
      Icon = PdfIcon;
      color = "#d32f2f"; // Vermelho
      bg = "#ffebee";
    } else if (
      type.includes("sheet") ||
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".csv")
    ) {
      Icon = ExcelIcon;
      color = "#2e7d32"; // Verde
      bg = "#e8f5e9";
    } else if (
      type.includes("word") ||
      type.includes("document") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      Icon = SheetIcon; // Ícone de descrição/texto (Azul)
      color = "#1976d2";
      bg = "#e3f2fd";
    } else if (
      type.includes("presentation") ||
      type.includes("powerpoint") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptx")
    ) {
      Icon = PptIcon;
      color = "#f57c00"; // Laranja
      bg = "#fff3e0";
    }

    return (
      <Avatar
        sx={{bgcolor: bg, color: color, width: 48, height: 48, mr: 1}}
        variant="rounded"
      >
        <Icon />
      </Avatar>
    );
  };

  if (!selectedTable) return null;

  return (
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
                    {uploading ? "Enviando..." : "Anexar Arquivo"}
                    <input type="file" hidden onChange={handleFileUpload} />
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
                            isGM && (
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteFile(file.url)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )
                          }
                        >
                          <ListItemAvatar>{getFileIcon(file)}</ListItemAvatar>
                          <ListItemText
                            primary={
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#333",
                                  fontWeight: 600,
                                  display: "block",
                                  wordBreak: "break-word",
                                }}
                              >
                                {file.name}
                              </a>
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
                      sx={{p: 3, textAlign: "center", color: "text.secondary"}}
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
                    selectedTable.gmPhotoURL || (isGM ? user?.photoURL : null),
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
  );
}

export default GameModal;
