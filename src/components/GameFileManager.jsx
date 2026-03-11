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
import APIService from "@/lib/api";
import {useUIStore} from "@/stores/characterStore";

export default function GameFileManager({
  tableId,
  files = [],
  isGM,
  hideList = false,
  hideUpload = false,
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

  const handleDeleteFile = async (file) => {
    if (!confirm(`Remover o arquivo "${file.name}"?`)) return;
    try {
      await APIService.removeAttachmentFromTable(tableId, file);
      showNotification("Arquivo removido.", "info");
    } catch (error) {
      console.error(error);
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

  const getFileIcon = (file) => {
    const type = file.type?.toLowerCase() || "";
    const name = file.name?.toLowerCase() || "";
    const size = 26;

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
        <Paper sx={{borderRadius: 2, overflow: "hidden"}} elevation={0}>
          <List disablePadding>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <Box sx={{display: "flex", gap: 1}}>
                        <IconButton
                          edge="end"
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
                            onClick={() => handleDeleteFile(file)}
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
                      sx={{minWidth: 40, cursor: "pointer"}}
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
                            cursor: "pointer",
                            color: "primary.main",
                            textDecoration: "underline",
                            "&:hover": {color: "primary.dark"},
                          }}
                        >
                          {file.name}
                        </Typography>
                      }
                      secondary={new Date(file.uploadedAt).toLocaleDateString()}
                    />
                  </ListItem>
                </React.Fragment>
              ))
            ) : (
              <Box sx={{p: 3, textAlign: "center", color: "text.secondary"}}>
                <Typography variant="body2">
                  {forceSecretUpload
                    ? "Nenhum arquivo secreto."
                    : "Nenhum material público anexado."}
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
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
    </Box>
  );
}
