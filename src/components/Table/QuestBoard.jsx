"use client";

import React, {useState, useEffect} from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import APIService from "@/lib/api";
import {useUIStore} from "@/stores/characterStore";
import {ConfirmDialog} from "@/components/ConfirmDialog";

export default function QuestBoard({tableId, isGM}) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const {showNotification} = useUIStore();

  // Dialog States
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedQuest, setGeneratedQuest] = useState(null);
  const [generatorStep, setGeneratorStep] = useState("params");
  const [generatorParams, setGeneratorParams] = useState({
    players: 4,
    swadeRank: "Novato",
    hunterRank: "E",
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [questToDelete, setQuestToDelete] = useState(null);

  const loadQuests = async () => {
    if (!tableId) return;
    setLoading(true);
    const data = await APIService.getTableQuests(tableId);
    // Ordena para que as mais novas fiquem no topo
    setQuests(
      data.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    loadQuests();
  }, [tableId]);

  const handleToggleActive = async (quest) => {
    await APIService.updateQuestStatus(tableId, quest._id, !quest.isActive);
    if (selectedQuest?._id === quest._id) {
      setSelectedQuest({...quest, isActive: !quest.isActive});
    }
    loadQuests();
  };

  const handleDeleteRequest = (questId) => {
    setQuestToDelete(questId);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!questToDelete) return;
    await APIService.deleteQuestFromTable(tableId, questToDelete);
    setConfirmDeleteOpen(false);
    setDetailsOpen(false);
    setSelectedQuest(null);
    setQuestToDelete(null);
    loadQuests();
  };

  const handleOpenGenerator = async () => {
    setGeneratorOpen(true);
    setGeneratorStep("params");
  };

  const handleGenerateQuest = async () => {
    try {
      setGenerating(true);
      setGeneratorStep("result");
      const quest = await APIService.generateRandomAdventure(generatorParams);
      setGeneratedQuest(quest);
    } catch (e) {
      showNotification("Erro ao gerar aventura.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleApproveQuest = async () => {
    try {
      setGenerating(true);
      await APIService.addQuestToTable(tableId, generatedQuest);
      showNotification(
        "Aventura salva! Ela já está no banco de missões.",
        "success",
      );
      setGeneratorOpen(false);
      setGeneratedQuest(null);
      loadQuests(); // Refresh the list
    } catch (e) {
      showNotification("Erro ao salvar aventura.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenQuestDetails = (quest) => {
    setSelectedQuest(quest);
    setDetailsOpen(true);
  };

  if (!isGM) return null; // O painel de Quests agora é exclusivo do Mestre na Tab 4

  if (loading) {
    return (
      <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const renderQuestDetails = (quest) => {
    if (!quest) return null;

    const prompts = {
      narrative: `Crie uma descrição narrativa envolvente para uma aventura de RPG de fantasia urbana (estilo Solo Leveling). Tema: ${quest.theme}. O portal se abriu em: ${quest.hook}. O objetivo dos caçadores é: ${quest.objective}. O interior da fenda é: ${quest.location}. A aventura terá uma complicação: ${quest.complication} e uma reviravolta: ${quest.twist}. O chefe final será: ${typeof quest.antagonist === "string" ? quest.antagonist : quest.antagonist?.name}. Recompensa: ${quest.reward}. Descreva o clima, o ambiente e o perigo inicial que os caçadores sentem ao entrar na fenda.`,
      encounters: `Gere uma descrição detalhada para os seguintes encontros e armadilhas em uma dungeon de RPG. Armadilhas: ${quest.traps?.join("; ") || "Nenhuma"}. Pistas disponíveis: ${quest.clues?.join("; ") || "Nenhuma"}. Monstros: ${quest.encounters?.map((e) => e.name).join(", ") || "Nenhum"}. Descreva como esses monstros agem, como as armadilhas estão escondidas no cenário (${quest.location}) e o que os jogadores sentem ao se deparar com eles.`,
      boss: `Crie uma descrição épica e aterrorizante para a entrada do Chefe da Dungeon: ${typeof quest.antagonist === "string" ? quest.antagonist : quest.antagonist?.name + " - " + quest.antagonist?.description}. Descreva sua aparência, a aura mágica ao seu redor, o cenário da sala do chefe e a primeira ação que ele faz quando os jogadores entram.`,
      map: `Crie um guia de mapeamento para uma Dungeon de ${quest.rooms} salas com o tema visual: ${quest.location}. Descreva como as salas estão conectadas e o design geral do lugar (ex: corredores estreitos, cavernas amplas, arquitetura ancestral).`,
      rooms: `Divida a Dungeon de ${quest.rooms} salas em uma progressão lógica. Distribua o gancho (investigação inicial), as armadilhas (${quest.traps?.join(", ") || "Nenhuma"}), os monstros (${quest.encounters?.map((e) => e.name).join(", ") || "Nenhum"}) e a sala do chefe final (${typeof quest.antagonist === "string" ? quest.antagonist : quest.antagonist?.name}) entre essas ${quest.rooms} salas de forma orgânica e desafiadora.`,
    };

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      showNotification(
        "Prompt copiado para a área de transferência!",
        "success",
      );
    };

    return (
      <Box sx={{display: "flex", flexDirection: "column", gap: 1, mt: 2}}>
        {/* Resumo */}
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              Resumo
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="caption" color="primary" fontWeight="bold">
              SITUAÇÃO (HOOK)
            </Typography>
            <Typography variant="body2" sx={{mb: 1.5}}>
              {quest.hook}
            </Typography>

            <Typography variant="caption" color="primary" fontWeight="bold">
              OBJETIVO
            </Typography>
            <Typography variant="body2" sx={{mb: 1.5}}>
              {quest.objective}
            </Typography>

            <Typography variant="caption" color="primary" fontWeight="bold">
              LOCAL DA FENDA
            </Typography>
            <Typography variant="body2">{quest.location}</Typography>
          </AccordionDetails>
        </Accordion>

        {/* Detalhada */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              Detalhada
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="caption"
              color="warning.main"
              fontWeight="bold"
            >
              COMPLICAÇÃO
            </Typography>
            <Typography variant="body2" sx={{mb: 1.5}}>
              {quest.complication}
            </Typography>

            <Typography
              variant="caption"
              color="secondary.main"
              fontWeight="bold"
            >
              REVIRAVOLTA
            </Typography>
            <Typography variant="body2">{quest.twist}</Typography>
          </AccordionDetails>
        </Accordion>

        {/* Estrutura */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              Estrutura
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              <strong>Tamanho Estimado:</strong> {quest.rooms} salas mapeadas.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Encontros */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              Encontros
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {quest.clues?.length > 0 && (
              <Box sx={{mb: 2}}>
                <Typography
                  variant="caption"
                  color="secondary.main"
                  fontWeight="bold"
                >
                  PISTAS E INVESTIGAÇÃO
                </Typography>
                {quest.clues.map((c, i) => (
                  <Typography key={i} variant="body2">
                    • {c}
                  </Typography>
                ))}
              </Box>
            )}
            {quest.traps?.length > 0 && (
              <Box sx={{mb: 2}}>
                <Typography
                  variant="caption"
                  color="info.main"
                  fontWeight="bold"
                >
                  ARMADILHAS E ENIGMAS
                </Typography>
                {quest.traps.map((t, i) => (
                  <Typography key={i} variant="body2">
                    • {t}
                  </Typography>
                ))}
              </Box>
            )}
            {quest.encounters?.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  color="warning.main"
                  fontWeight="bold"
                  display="block"
                  sx={{mb: 0.5}}
                >
                  ◆ MONSTROS EXTRAS
                </Typography>
                {quest.encounters.map((enc, i) => (
                  <Box
                    key={i}
                    sx={{mb: i === quest.encounters.length - 1 ? 0 : 1}}
                  >
                    <Typography variant="body2">
                      <strong>{enc.name}</strong> ({enc.type})
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {enc.stats}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="success.main"
                      display="block"
                    >
                      Loot: {enc.loot}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Chefe Final */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              Chefe Final
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="caption"
              color="error.main"
              fontWeight="bold"
              display="block"
            >
              ◆ BOSS
            </Typography>
            {typeof quest.antagonist === "string" ? (
              <Typography variant="body2">{quest.antagonist}</Typography>
            ) : (
              <Box sx={{mt: 0.5}}>
                <Typography variant="body2">
                  <strong>{quest.antagonist?.name}:</strong>{" "}
                  {quest.antagonist?.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{mt: 0.5}}
                >
                  {quest.antagonist?.stats}
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Espólios */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              Espólios
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="caption"
              color="success.main"
              fontWeight="bold"
              display="block"
            >
              LOOT DO CHEFE E RECOMPENSAS
            </Typography>
            {quest.bossLoot && (
              <Typography variant="body2" sx={{mb: 0.5}}>
                <strong>Loot do Chefe:</strong> {quest.bossLoot.join(", ")}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>Recompensa do Sistema/Guilda:</strong> {quest.reward}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* XP */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              XP
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              <strong>Experiência Sugerida:</strong> 3 XP (Padrão SWADE) ou 1
              Avanço se concluída com sucesso.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Prompt */}
        <Accordion
          disableGutters
          elevation={0}
          sx={{border: "1px solid #e0e0e0", "&:before": {display: "none"}}}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="secondary">
              Prompt (IA Assistente)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  1. Descrição Narrativa
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    mt: 0.5,
                  }}
                >
                  <TextField
                    multiline
                    fullWidth
                    size="small"
                    value={prompts.narrative}
                    InputProps={{readOnly: true}}
                  />
                  <IconButton
                    onClick={() => copyToClipboard(prompts.narrative)}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  2. Encontros (Armadilhas, Enigmas e Monstros)
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    mt: 0.5,
                  }}
                >
                  <TextField
                    multiline
                    fullWidth
                    size="small"
                    value={prompts.encounters}
                    InputProps={{readOnly: true}}
                  />
                  <IconButton
                    onClick={() => copyToClipboard(prompts.encounters)}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  3. Boss
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    mt: 0.5,
                  }}
                >
                  <TextField
                    multiline
                    fullWidth
                    size="small"
                    value={prompts.boss}
                    InputProps={{readOnly: true}}
                  />
                  <IconButton
                    onClick={() => copyToClipboard(prompts.boss)}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  4. Mapa da Masmorra
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    mt: 0.5,
                  }}
                >
                  <TextField
                    multiline
                    fullWidth
                    size="small"
                    value={prompts.map}
                    InputProps={{readOnly: true}}
                  />
                  <IconButton
                    onClick={() => copyToClipboard(prompts.map)}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  5. Salas da Masmorra
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    mt: 0.5,
                  }}
                >
                  <TextField
                    multiline
                    fullWidth
                    size="small"
                    value={prompts.rooms}
                    InputProps={{readOnly: true}}
                  />
                  <IconButton
                    onClick={() => copyToClipboard(prompts.rooms)}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const renderSimpleQuest = (quest) => (
    <ListItem
      key={quest._id}
      disablePadding
      sx={{
        mb: 1.5,
        border: "1px solid",
        borderColor: quest.isActive ? "#00e5ff" : "#cbd5e1",
        borderRadius: 2,
        bgcolor: quest.isActive ? "rgba(0, 229, 255, 0.05)" : "#fff",
        boxShadow: quest.isActive
          ? "0 2px 10px rgba(0, 229, 255, 0.15)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <ListItemButton
        onClick={() => handleOpenQuestDetails(quest)}
        sx={{py: 1.5}}
      >
        <ListItemText
          primary={quest.title}
          secondary={`${quest.theme || "Missão Padrão"} | Rank Fenda: ${quest.hunterRank || "N/A"} | ${quest.players || "?"} Jogadores`}
          secondaryTypographyProps={{noWrap: true, display: "block", mt: 0.5}}
          primaryTypographyProps={{
            fontWeight: "bold",
            color: quest.isActive ? "#008394" : "text.primary",
          }}
        />
        <Chip
          icon={
            quest.isActive ? (
              <VisibilityIcon fontSize="small" />
            ) : (
              <VisibilityOffIcon fontSize="small" />
            )
          }
          label={quest.isActive ? "Visível" : "Oculta"}
          color={quest.isActive ? "info" : "default"}
          size="small"
          variant={quest.isActive ? "filled" : "outlined"}
          sx={{ml: 2, fontWeight: "bold"}}
        />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" color="primary">
          Operações da Mesa
        </Typography>
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleOpenGenerator}
          sx={{borderRadius: 2}}
        >
          Nova Operação
        </Button>
      </Box>

      {quests.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary">
            Nenhuma missão no banco. Clique em "Nova Operação" para gerar uma.
          </Typography>
        </Paper>
      ) : (
        <List disablePadding>{quests.map(renderSimpleQuest)}</List>
      )}

      {/* Dialog de Detalhes da Missão */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedQuest && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: selectedQuest.isActive
                  ? "rgba(0, 229, 255, 0.1)"
                  : "#f8fafc",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                color={selectedQuest.isActive ? "#008394" : "text.primary"}
              >
                {selectedQuest.title}
              </Typography>
              <Chip
                icon={
                  selectedQuest.isActive ? (
                    <VisibilityIcon fontSize="small" />
                  ) : (
                    <VisibilityOffIcon fontSize="small" />
                  )
                }
                label={
                  selectedQuest.isActive ? "Visível na Mesa" : "Oculta (Banco)"
                }
                color={selectedQuest.isActive ? "info" : "default"}
                variant={selectedQuest.isActive ? "filled" : "outlined"}
                sx={{fontWeight: "bold"}}
              />
            </DialogTitle>
            <Box
              sx={{
                px: 3,
                py: 1,
                bgcolor: "#1e293b",
                color: "white",
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <Typography variant="body2">
                <strong>Caçadores:</strong> {selectedQuest.players || "?"}
              </Typography>
              <Typography variant="body2">
                <strong>Rank da Fenda:</strong>{" "}
                {selectedQuest.hunterRank || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Rank SWADE:</strong> {selectedQuest.swadeRank || "N/A"}
              </Typography>
            </Box>
            <DialogContent dividers sx={{p: 2}}>
              {renderQuestDetails(selectedQuest)}
            </DialogContent>
            <DialogActions sx={{p: 2, justifyContent: "space-between"}}>
              {!selectedQuest.isActive ? (
                <Button
                  color="error"
                  onClick={() => handleDeleteRequest(selectedQuest._id)}
                  startIcon={<DeleteIcon />}
                >
                  Excluir
                </Button>
              ) : (
                <Box /> // Spacer
              )}
              <Box sx={{display: "flex", gap: 2}}>
                <Button onClick={() => setDetailsOpen(false)} color="inherit">
                  Fechar
                </Button>
                <Button
                  variant={selectedQuest.isActive ? "outlined" : "contained"}
                  color={selectedQuest.isActive ? "info" : "primary"}
                  startIcon={
                    selectedQuest.isActive ? <StopIcon /> : <PlayArrowIcon />
                  }
                  onClick={() => handleToggleActive(selectedQuest)}
                >
                  {selectedQuest.isActive ? "Ocultar Missão" : "Ativar na Mesa"}
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog do Gerador */}
      <Dialog
        open={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "#f5f7fa",
            color: "text.primary",
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Gerador de Operações
        </DialogTitle>
        <DialogContent dividers sx={{p: 2}}>
          {generatorStep === "params" ? (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 1}}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Antes de iniciar o escaneamento, defina os parâmetros da
                incursão:
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Quantidade de Caçadores (Jogadores)</InputLabel>
                <Select
                  value={generatorParams.players}
                  label="Quantidade de Caçadores (Jogadores)"
                  onChange={(e) =>
                    setGeneratorParams({
                      ...generatorParams,
                      players: e.target.value,
                    })
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} Caçador{num > 1 ? "es" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Rank do Personagem (SWADE)</InputLabel>
                <Select
                  value={generatorParams.swadeRank}
                  label="Rank do Personagem (SWADE)"
                  onChange={(e) =>
                    setGeneratorParams({
                      ...generatorParams,
                      swadeRank: e.target.value,
                    })
                  }
                >
                  {[
                    "Novato",
                    "Experiente",
                    "Veterano",
                    "Heroico",
                    "Lendário",
                  ].map((rank) => (
                    <MenuItem key={rank} value={rank}>
                      {rank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Rank da Fenda (Caçador)</InputLabel>
                <Select
                  value={generatorParams.hunterRank}
                  label="Rank da Fenda (Caçador)"
                  onChange={(e) =>
                    setGeneratorParams({
                      ...generatorParams,
                      hunterRank: e.target.value,
                    })
                  }
                >
                  {["E", "D", "C", "B", "A", "S"].map((rank) => (
                    <MenuItem key={rank} value={rank}>
                      Rank {rank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : generating ? (
            <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
              <CircularProgress />
            </Box>
          ) : generatedQuest ? (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
              <Box>
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{fontWeight: "bold", letterSpacing: 1, lineHeight: 1}}
                >
                  [{" "}
                  {generatedQuest.theme
                    ? generatedQuest.theme.toUpperCase()
                    : "ANÁLISE DE INCURSÃO"}{" "}
                  ]
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mt: 0.5,
                    textTransform: "uppercase",
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {generatedQuest.title}
                </Typography>
                <Box sx={{display: "flex", flexWrap: "wrap", gap: 2, mt: 1}}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Fenda:</strong> {generatedQuest.hunterRank}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>SWADE:</strong> {generatedQuest.swadeRank}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Caçadores:</strong> {generatedQuest.players}
                  </Typography>
                </Box>
              </Box>

              {renderQuestDetails(generatedQuest)}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{p: 1.5, bgcolor: "#f5f7fa"}}>
          <Button
            onClick={() => setGeneratorOpen(false)}
            color="inherit"
            sx={{color: "text.secondary"}}
          >
            Cancelar
          </Button>
          <Box sx={{flex: 1}} />
          {generatorStep === "params" ? (
            <Button
              onClick={handleGenerateQuest}
              variant="contained"
              color="primary"
              disabled={generating}
              startIcon={<AutoAwesomeIcon />}
              sx={{px: 3}}
            >
              Iniciar
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setGeneratorStep("params")}
                variant="outlined"
                disabled={generating}
                sx={{mr: 1}}
              >
                Voltar
              </Button>
              <Button
                onClick={handleGenerateQuest}
                variant="outlined"
                color="secondary"
                disabled={generating}
                startIcon={<RefreshIcon />}
                sx={{mr: 1}}
              >
                Rerolar
              </Button>
              <Button
                onClick={handleApproveQuest}
                variant="contained"
                color="primary"
                disabled={generating || !generatedQuest}
                startIcon={<SaveIcon />}
                sx={{px: 3}}
              >
                Salvar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Missão"
      >
        <Typography>
          Tem certeza que deseja excluir esta operação permanentemente do banco
          da mesa?
        </Typography>
      </ConfirmDialog>
    </Box>
  );
}
