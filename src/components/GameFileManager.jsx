"use client";

import React, {useState} from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
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
import {ConfirmDialog} from "@/components/ConfirmDialog";
import APIService from "@/lib/api";
import {useUIStore} from "@/stores/characterStore";

export default function GameFileManager({
  tableId,
  files = [],
  isGM,
  hideList = false,
  hideUpload = false,
  questId = null, // ID da missão vinculada a este painel
  onlySecret = false, // Mostrar apenas arquivos secretos
  excludeSecret = false, // Esconder arquivos secretos
  forceSecretUpload = false, // Forçar upload como secreto
}) {
  const {showNotification} = useUIStore();
  const [uploading, setUploading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [customFileName, setCustomFileName] = useState("");

  // Lightbox States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxLoading, setLightboxLoading] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [publicConfirmOpen, setPublicConfirmOpen] = useState(false);
  const [fileToMakePublic, setFileToMakePublic] = useState(null);

  const [secretConfirmOpen, setSecretConfirmOpen] = useState(false);
  const [fileToMakeSecret, setFileToMakeSecret] = useState(null);

  const filteredFiles = files.filter((file) => {
    if (onlySecret && !file.secret) return false;
    if (excludeSecret && file.secret) return false;
    return true;
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileToUpload(file);
    setCustomFileName(file.name);
    setUploadModalOpen(true);
    event.target.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!fileToUpload || !tableId) return;

    setUploading(true);
    try {
      // 1. Upload físico
      const attachment = await APIService.uploadTableAttachment(
        tableId,
        fileToUpload,
      );

      // 2. Ajuste de nome e vínculo no Firestore
      attachment.name = customFileName || attachment.name;
      if (forceSecretUpload) attachment.secret = true;
      if (questId) attachment.questId = questId; // Salva o vínculo da missão
      await APIService.addAttachmentToTable(tableId, attachment);

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

  const handleDeleteFileClick = (e, file) => {
    e.stopPropagation();
    setFileToDelete(file);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      await APIService.removeAttachmentFromTable(tableId, fileToDelete);
      showNotification("Arquivo removido.", "info");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao remover arquivo.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setFileToDelete(null);
    }
  };

  const handleMakePublicClick = (e, file) => {
    e.stopPropagation();
    setFileToMakePublic(file);
    setPublicConfirmOpen(true);
  };

  const confirmMakePublic = async () => {
    if (!fileToMakePublic) return;
    try {
      await APIService.removeAttachmentFromTable(tableId, fileToMakePublic);
      const publicFile = {...fileToMakePublic, secret: false};
      await APIService.addAttachmentToTable(tableId, publicFile);
      showNotification("Pista liberada com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao liberar pista.", "error");
    } finally {
      setPublicConfirmOpen(false);
      setFileToMakePublic(null);
    }
  };

  const handleMakeSecretClick = (e, file) => {
    e.stopPropagation();
    setFileToMakeSecret(file);
    setSecretConfirmOpen(true);
  };

  const confirmMakeSecret = async () => {
    if (!fileToMakeSecret) return;
    try {
      await APIService.removeAttachmentFromTable(tableId, fileToMakeSecret);
      const secretFile = {...fileToMakeSecret, secret: true};
      await APIService.addAttachmentToTable(tableId, secretFile);
      showNotification("Arquivo ocultado com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao ocultar arquivo.", "error");
    } finally {
      setSecretConfirmOpen(false);
      setFileToMakeSecret(null);
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
        const response = await fetch(file.url);
        if (!response.ok) throw new Error("Erro ao carregar arquivo");
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setLightboxSrc(objectUrl);
      } catch (error) {
        console.error("Erro imagem:", error);
        showNotification("Erro ao carregar imagem.", "error");
        setLightboxOpen(false);
      } finally {
        setLightboxLoading(false);
      }
    } else {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (file, customSize = 26) => {
    const type = file.type?.toLowerCase() || "";
    const name = file.name?.toLowerCase() || "";
    const size = customSize;

    if (type.includes("pdf") || name.endsWith(".pdf"))
      return <BsFiletypePdf size={size} color="#d32f2f" />;
    if (
      type.includes("sheet") ||
      type.includes("excel") ||
      name.match(/\.(xls|xlsx|csv)$/)
    )
      return <BsFiletypeXls size={size} color="#2e7d32" />;
    if (
      type.includes("word") ||
      type.includes("document") ||
      name.match(/\.(doc|docx)$/)
    )
      return <BsFiletypeDoc size={size} color="#1976d2" />;
    if (type.includes("presentation") || name.match(/\.(ppt|pptx)$/))
      return <BsFiletypePpt size={size} color="#f57c00" />;
    if (type.includes("text") || name.endsWith(".txt"))
      return <BsFiletypeTxt size={size} color="#616161" />;
    if (
      type.startsWith("image/") ||
      name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)
    )
      return <BsCardImage size={size} color="#7b1fa2" />;
    return <BsFileEarmark size={size} color="#9e9e9e" />;
  };

  return (
    <Box sx={{mb: 3}}>
      {!hideUpload && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 1,
          }}
        >
          {isGM && (
            <Button
              component="label"
              variant="contained"
              startIcon={<UploadIcon />}
              size="small"
              disabled={uploading}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {forceSecretUpload ? "Anexar Secreto" : "Anexar Arquivo"}
              <input type="file" hidden onChange={handleFileSelect} />
            </Button>
          )}
        </Box>
      )}

      {!hideList && (
        <Box>
          {filteredFiles.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(5, 1fr)",
                },
                gap: 2,
              }}
            >
              {filteredFiles.map((file, index) => {
                const isImg =
                  file.type?.startsWith("image/") ||
                  file.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

                return (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      position: "relative",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        borderColor: "primary.main",
                      },
                      "&:hover .action-btn": {
                        opacity: 1,
                      },
                    }}
                  >
                    {/* Botão de Excluir Flutuante */}
                    {isGM && (
                      <IconButton
                        className="action-btn"
                        size="small"
                        onClick={(e) => handleDeleteFileClick(e, file)}
                        title="Excluir"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          opacity: {xs: 1, md: 0}, // No mobile aparece sempre
                          transition: "all 0.2s",
                          bgcolor: "rgba(255, 255, 255, 0.85)",
                          color: "error.main",
                          zIndex: 10,
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "white",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}

                    {/* Botão de Liberar Pista Flutuante */}
                    {isGM && file.secret && (
                      <IconButton
                        className="action-btn"
                        size="small"
                        onClick={(e) => handleMakePublicClick(e, file)}
                        title="Liberar Pista para Jogadores"
                        sx={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          opacity: {xs: 1, md: 0}, // No mobile aparece sempre
                          transition: "all 0.2s",
                          bgcolor: "rgba(255, 255, 255, 0.85)",
                          color: "success.main",
                          zIndex: 10,
                          "&:hover": {
                            bgcolor: "success.main",
                            color: "white",
                          },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}

                    {/* Botão de Ocultar Pista Flutuante */}
                    {isGM && !file.secret && (
                      <IconButton
                        className="action-btn"
                        size="small"
                        onClick={(e) => handleMakeSecretClick(e, file)}
                        title="Ocultar dos Jogadores"
                        sx={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          opacity: {xs: 1, md: 0}, // No mobile aparece sempre
                          transition: "all 0.2s",
                          bgcolor: "rgba(255, 255, 255, 0.85)",
                          color: "warning.main",
                          zIndex: 10,
                          "&:hover": {
                            bgcolor: "warning.main",
                            color: "white",
                          },
                        }}
                      >
                        <VisibilityOffIcon fontSize="small" />
                      </IconButton>
                    )}

                    {/* Botão de Download Flutuante */}
                    <IconButton
                      className="action-btn"
                      size="small"
                      href={file.url}
                      download
                      target="_blank"
                      title="Baixar"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        opacity: {xs: 1, md: 0}, // No mobile aparece sempre
                        transition: "all 0.2s",
                        color: "primary.main",
                        zIndex: 10,
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "white",
                        },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>

                    {/* Área do Ícone em Destaque */}
                    <Box
                      sx={{
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f5f7fa",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      onClick={() => handleViewFile(file)}
                    >
                      {isImg ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        getFileIcon(file, 48)
                      )}
                    </Box>
                    <Divider />
                    {/* Área de Informações e Ações */}
                    <Box
                      sx={{
                        p: 1.5,
                        pr: 5,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        title={file.name}
                        onClick={() => handleViewFile(file)}
                        sx={{
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": {color: "primary.main"},
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box sx={{p: 3, textAlign: "center", color: "text.secondary"}}>
              <Typography variant="body2">
                {forceSecretUpload
                  ? "Nenhum arquivo secreto."
                  : "Nenhum material público anexado."}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Modal de Upload */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => !uploading && setUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nomear Arquivo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
            Defina um nome para identificar este arquivo.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Arquivo"
            fullWidth
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

      {/* Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="xl"
        PaperProps={{
          sx: {bgcolor: "transparent", boxShadow: "none", overflow: "hidden"},
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
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
                alt="Preview"
                style={{maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8}}
              />
            )
          )}
        </Box>
      </Dialog>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteFile}
        title="Excluir Arquivo"
      >
        <Typography>Remover o arquivo "{fileToDelete?.name}"?</Typography>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={publicConfirmOpen}
        onClose={() => setPublicConfirmOpen(false)}
        onConfirm={confirmMakePublic}
        title="Liberar Pista"
      >
        <Typography>
          Liberar a pista "{fileToMakePublic?.name}" para todos os jogadores?
        </Typography>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={secretConfirmOpen}
        onClose={() => setSecretConfirmOpen(false)}
        onConfirm={confirmMakeSecret}
        title="Ocultar Pista"
      >
        <Typography>
          Deseja ocultar a pista "{fileToMakeSecret?.name}" dos jogadores e
          movê-la de volta para os Arquivos do Mestre?
        </Typography>
      </ConfirmDialog>
    </Box>
  );
}
