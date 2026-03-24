import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Pets as PetsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import APIService from "@/lib/api";

const DEFAULT_ATTRIBUTES = {
  Agility: "d4",
  Smarts: "d4",
  Spirit: "d4",
  Strength: "d4",
  Vigor: "d4",
};

export default function MonsterFormDialog({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    rank: "Extra",
    pace: 6,
    parry: 2,
    toughness: 4,
    skills: "",
    loot: "",
    imagem_url: "",
    attributes: DEFAULT_ATTRIBUTES,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        ...initialData,
        attributes: initialData.attributes || DEFAULT_ATTRIBUTES,
      });
    } else if (open) {
      setFormData({
        name: "",
        type: "",
        rank: "Extra",
        pace: 6,
        parry: 2,
        toughness: 4,
        skills: "",
        loot: "",
        imagem_url: "",
        attributes: DEFAULT_ATTRIBUTES,
      });
    }
  }, [open, initialData]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({...prev, [field]: value}));
  const handleAttrChange = (attr, value) =>
    setFormData((prev) => ({
      ...prev,
      attributes: {...prev.attributes, [attr]: value},
    }));

  const processFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await APIService.uploadFile(file);
      handleChange("imagem_url", url);
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  // Intercepta o "Ctrl+V" na área de transferência
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        processFile(item.getAsFile());
        break; // Processa apenas a primeira imagem encontrada
      }
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    try {
      // 1. Gera o prompt otimizado usando a rota de prompts já existente
      const promptRes = await fetch("/api/generate/prompt", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          character: {
            nome: `${formData.name}, Criatura do Livro de Monstros de Pathfinder RPG`,
            arquetipo: formData.type || "Criatura Monstruosa",
            conceito: `Monstro de RPG - Rank: ${formData.rank}`,
            descricao:
              "Ilustração de monstro altamente detalhada, design oficial de RPG de mesa.",
          },
          context:
            "Concept art de um monstro assustador. Fundo limpo e centralizado, estilo retrato (portrait) para ser usado como token em VTT.",
          artStyle: "solo_leveling",
        }),
      });

      if (!promptRes.ok) throw new Error("Falha ao gerar o prompt");
      const promptData = await promptRes.json();
      const generatedPrompt = promptData.prompt;

      // 2. Copia o prompt para a área de transferência em vez de tentar gerar a imagem (por enquanto)
      await navigator.clipboard.writeText(generatedPrompt.trim());
      setPromptCopied(true);
    } catch (err) {
      console.error("Erro na geração da imagem:", err);
      alert(`Erro ao tentar gerar o prompt com IA: ${err.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      onPaste={handlePaste}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pb: 1,
        }}
      >
        <DialogTitle sx={{p: 0, fontWeight: "bold"}}>
          {initialData ? "Editar Criatura" : "Nova Criatura"}
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Coluna da Esquerda (Foto) */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: "100%",
                height: 220,
                bgcolor: "#f1f5f9",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "2px dashed #cbd5e1",
                position: "relative",
                mb: 2,
              }}
            >
              {formData.imagem_url ? (
                <>
                  <Box
                    component="img"
                    src={formData.imagem_url}
                    alt="Preview"
                    sx={{width: "100%", height: "100%", objectFit: "cover"}}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleChange("imagem_url", "")}
                    title="Remover Imagem"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      "&:hover": {bgcolor: "rgba(220,38,38,0.9)"},
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <PetsIcon sx={{fontSize: 64, color: "#94a3b8", opacity: 0.5}} />
              )}

              {uploading && (
                <Box
                  sx={{
                    position: "absolute",
                    bgcolor: "rgba(255,255,255,0.7)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={32} />
                </Box>
              )}

              {generatingImage && (
                <Box
                  sx={{
                    position: "absolute",
                    bgcolor: "rgba(255,255,255,0.8)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={32} color="secondary" />
                  <Typography
                    variant="caption"
                    color="secondary"
                    fontWeight="bold"
                  >
                    Gerando IA...
                  </Typography>
                </Box>
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              disabled={uploading || generatingImage}
            >
              Upload Foto (ou Ctrl+V)
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<AutoAwesomeIcon />}
              disabled={uploading || generatingImage || !formData.name}
              onClick={handleGenerateImage}
              sx={{mt: 1}}
            >
              Gerar prompt com IA
            </Button>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<DeleteIcon />}
              disabled={uploading || generatingImage || !formData.imagem_url}
              onClick={() => handleChange("imagem_url", "")}
              sx={{mt: 1}}
            >
              Remover Imagem
            </Button>
          </Grid>

          {/* Coluna da Direita (Dados) */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome da Criatura"
                  size="small"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="Rank"
                  size="small"
                  value={formData.rank}
                  onChange={(e) => handleChange("rank", e.target.value)}
                >
                  {[
                    "Extra",
                    "Carta Selvagem",
                    "Novato",
                    "Experiente",
                    "Veterano",
                    "Heroico",
                    "Lendário",
                  ].map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Tipo (ex: Fera)"
                  size="small"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Atributos Base (ex: d6, d8)
                </Typography>
                <Grid container spacing={1} sx={{mt: 0.5}}>
                  {["Agility", "Smarts", "Spirit", "Strength", "Vigor"].map(
                    (attr) => (
                      <Grid item xs key={attr}>
                        <TextField
                          fullWidth
                          label={attr.substring(0, 3).toUpperCase()}
                          size="small"
                          value={formData.attributes[attr]}
                          onChange={(e) =>
                            handleAttrChange(attr, e.target.value)
                          }
                        />
                      </Grid>
                    ),
                  )}
                </Grid>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Movimento"
                  size="small"
                  value={formData.pace}
                  onChange={(e) => handleChange("pace", Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Aparar"
                  size="small"
                  value={formData.parry}
                  onChange={(e) =>
                    handleChange("parry", Number(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Resistência (ex: 8(2))"
                  size="small"
                  value={formData.toughness}
                  onChange={(e) => handleChange("toughness", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Perícias"
                  size="small"
                  placeholder="Ex: Lutar d8, Perceber d6"
                  value={formData.skills}
                  onChange={(e) => handleChange("skills", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Loot / Espólios"
                  size="small"
                  value={formData.loot}
                  onChange={(e) => handleChange("loot", e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{p: 2}}>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !formData.name}
          sx={{minWidth: 120}}
        >
          {saving ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Salvar Criatura"
          )}
        </Button>
      </DialogActions>

      <Snackbar
        open={promptCopied}
        autoHideDuration={3000}
        onClose={() => setPromptCopied(false)}
        message="Prompt copiado!"
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      />
    </Dialog>
  );
}
