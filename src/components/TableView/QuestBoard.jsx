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
  Tabs,
  Tab,
  Alert,
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
  Close as CloseIcon,
} from "@mui/icons-material";
import APIService from "@/lib/api";
import {useUIStore} from "@/stores/characterStore";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import GameFileManager from "@/components/GameFileManager";

export default function QuestBoard({tableId, isGM}) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const {showNotification, selectedTable} = useUIStore();

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

  const [questTab, setQuestTab] = useState(0);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [questToDelete, setQuestToDelete] = useState(null);

  // Estados da Geração com IA
  const [aiResults, setAiResults] = useState({});
  const [loadingStep, setLoadingStep] = useState(null);

  const loadQuests = async (silent = false) => {
    if (!tableId) return;
    if (!silent) setLoading(true);
    const data = await APIService.getTableQuests(tableId);
    // Ordena para que as mais novas fiquem no topo
    setQuests(
      data.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      ),
    );
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    loadQuests();
  }, [tableId]);

  const handleToggleActive = async (quest, e) => {
    if (e) e.stopPropagation();

    // Atualização Otimista para evitar que a tela pisque
    setQuests(
      quests.map((q) =>
        q._id === quest._id ? {...q, isActive: !q.isActive} : q,
      ),
    );
    if (selectedQuest?._id === quest._id) {
      setSelectedQuest({...quest, isActive: !quest.isActive});
    }
    try {
      await APIService.updateQuestStatus(tableId, quest._id, !quest.isActive);
      loadQuests(true);
    } catch (err) {
      showNotification("Erro ao atualizar status da missão.", "error");
      loadQuests(true);
    }
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
    loadQuests(true);
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
      // Limpa os rascunhos da IA em cache para não vazar para a próxima criação
      setAiResults((prev) => {
        const next = {...prev};
        delete next["unsaved_draft"];
        return next;
      });
      loadQuests(true); // Atualiza a lista silenciosamente
    } catch (e) {
      showNotification("Erro ao salvar aventura.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenQuestDetails = (quest) => {
    setSelectedQuest(quest);
    setQuestTab(0);
    setDetailsOpen(true);
  };

  const handleGenerateTexts = async (quest) => {
    const steps = [
      {id: "narrative_text", label: "Introdução e Narrativa"},
      {id: "map_text", label: "Mapa e Investigação"},
      {id: "encounters_text", label: "Encontros e Desafios"},
      {id: "boss_text", label: "O Boss Final"},
    ];
    await runAIGeneration(quest, steps);
  };

  const handleGenerateImages = async (quest) => {
    const steps = [
      {id: "narrative_image", label: "Cenário Inicial"},
      {id: "map_image", label: "Mapa e Salas da Dungeon"},
      {id: "encounters_image", label: "Encontros e Armadilhas"},
      {id: "boss_image", label: "Boss Final"},
      {id: "loot_image", label: "Arte dos Espólios"},
    ];
    await runAIGeneration(quest, steps);
  };

  const runAIGeneration = async (quest, steps) => {
    const questId = quest._id || "unsaved_draft";
    let currentResults = {...(aiResults[questId] || quest.aiContent || {})};

    for (const step of steps) {
      setLoadingStep(step.id);
      try {
        const res = await fetch("/api/generate/adventures/steps", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({step: step.id, adventure: quest}),
        });
        const data = await res.json();

        if (data.content) {
          currentResults[step.id] = data.content;
          setAiResults((prev) => ({...prev, [questId]: {...currentResults}}));

          // Salva no banco de dados (se a quest já estiver salva no painel)
          if (quest._id) {
            await APIService.updateQuest(tableId, quest._id, {
              aiContent: currentResults,
            });
          } else {
            // Se a quest ainda não foi salva (está no gerador), atualiza o estado local para quando for salva
            setGeneratedQuest((prev) => ({...prev, aiContent: currentResults}));
          }
        }
      } catch (err) {
        console.error(err);
        showNotification(
          "Erro ao comunicar com a IA no passo: " + step.id,
          "error",
        );
        break;
      }
    }
    setLoadingStep(null);
    if (quest._id) {
      loadQuests(true); // Atualiza a lista silenciosamente apenas se a quest já existia
    }
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

    const copyToClipboard = (text) => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      showNotification(
        "Prompt copiado para a área de transferência!",
        "success",
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 2,
          height: "100%",
        }}
      >
        <Box sx={{borderBottom: 1, borderColor: "divider", mb: 2}}>
          <Tabs
            value={questTab}
            onChange={(e, v) => setQuestTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Resumo" />
            <Tab label="Narrativa (IA)" />
            <Tab label="Prompts de Imagens (IA)" />
            <Tab label="Arquivos" />
          </Tabs>
        </Box>

        <Box sx={{flexGrow: 1, overflowY: "auto", pb: 2}}>
          {questTab === 0 && (
            <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
              {/* Resumo/Detalhada */}
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{borderBottom: "1px solid #e0e0e0", pb: 1, mb: 2}}
                >
                  Situação e Objetivo
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      GANCHO
                    </Typography>
                    <Typography variant="body2">{quest.hook}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      OBJETIVO
                    </Typography>
                    <Typography variant="body2">{quest.objective}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      LOCAL DA FENDA
                    </Typography>
                    <Typography variant="body2">{quest.location}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      COMPLICAÇÃO
                    </Typography>
                    <Typography variant="body2">
                      {quest.complication}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="secondary.main"
                      fontWeight="bold"
                    >
                      REVIRAVOLTA
                    </Typography>
                    <Typography variant="body2">{quest.twist}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Estrutura / Encontros */}
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{borderBottom: "1px solid #e0e0e0", pb: 1, mb: 2}}
                >
                  Estrutura e Desafios
                </Typography>
                <Typography variant="body2" sx={{mb: 2}}>
                  <strong>Tamanho Estimado:</strong> {quest.rooms} salas
                  mapeadas.
                </Typography>

                {quest.clues?.length > 0 && (
                  <Box sx={{mb: 2}}>
                    <Typography
                      variant="caption"
                      color="secondary.main"
                      fontWeight="bold"
                      display="block"
                    >
                      PISTAS E INVESTIGAÇÃO
                    </Typography>
                    <List dense disablePadding>
                      {quest.clues.map((c, i) => (
                        <ListItem key={i} disablePadding sx={{py: 0.5}}>
                          <ListItemText
                            primary={`• ${c}`}
                            primaryTypographyProps={{variant: "body2"}}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {quest.traps?.length > 0 && (
                  <Box sx={{mb: 2}}>
                    <Typography
                      variant="caption"
                      color="info.main"
                      fontWeight="bold"
                      display="block"
                    >
                      ARMADILHAS E ENIGMAS
                    </Typography>
                    <List dense disablePadding>
                      {quest.traps.map((t, i) => (
                        <ListItem key={i} disablePadding sx={{py: 0.5}}>
                          <ListItemText
                            primary={`• ${t}`}
                            primaryTypographyProps={{variant: "body2"}}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {quest.encounters?.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="warning.main"
                      fontWeight="bold"
                      display="block"
                      sx={{mb: 1}}
                    >
                      ◆ MONSTROS EXTRAS
                    </Typography>
                    <Grid container spacing={2}>
                      {quest.encounters.map((enc, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Paper
                            variant="outlined"
                            sx={{p: 1.5, bgcolor: "#fffbf0"}}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 1,
                              }}
                            >
                              <Typography variant="body2">
                                <strong>{enc.name}</strong> ({enc.type})
                              </Typography>
                            </Box>
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
                              sx={{mt: 0.5}}
                            >
                              Loot: {enc.loot}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>

              {/* Chefe Final */}
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{borderBottom: "1px solid #e0e0e0", pb: 1, mb: 2}}
                >
                  Chefe Final
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{p: 2, bgcolor: "#fff5f5", borderColor: "#ffcdd2"}}
                >
                  <Typography
                    variant="caption"
                    color="error.main"
                    fontWeight="bold"
                    display="block"
                    sx={{mb: 1}}
                  >
                    ◆ BOSS
                  </Typography>
                  {typeof quest.antagonist === "string" ? (
                    <Typography variant="body2">{quest.antagonist}</Typography>
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>{quest.antagonist?.name}:</strong>{" "}
                          {quest.antagonist?.description}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{mt: 1}}
                      >
                        {quest.antagonist?.stats}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              {/* Espólios e XP */}
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{borderBottom: "1px solid #e0e0e0", pb: 1, mb: 2}}
                >
                  Recompensas e Experiência
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      color="success.main"
                      fontWeight="bold"
                      display="block"
                    >
                      LOOT DO CHEFE
                    </Typography>
                    <Typography variant="body2">
                      {quest.bossLoot?.join(", ") || "Nenhum loot especial"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      color="success.main"
                      fontWeight="bold"
                      display="block"
                    >
                      RECOMPENSA DO SISTEMA/GUILDA
                    </Typography>
                    <Typography variant="body2">{quest.reward}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight="bold"
                      display="block"
                    >
                      EXPERIÊNCIA SUGERIDA (XP)
                    </Typography>
                    <Typography variant="body2">
                      3 XP (Padrão SWADE) ou 1 Avanço se concluída com sucesso.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

          {questTab === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Gere os textos descritivos das cenas para narrar para seus
                jogadores de forma imersiva.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => handleGenerateTexts(quest)}
                disabled={loadingStep !== null}
                sx={{mb: 3}}
              >
                {loadingStep ? "Gerando..." : "Gerar Narrativa IA"}
              </Button>

              <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                {[
                  {id: "narrative_text", label: "1. Introdução e Narrativa"},
                  {id: "map_text", label: "2. Mapa e Investigação"},
                  {id: "encounters_text", label: "3. Encontros e Armadilhas"},
                  {id: "boss_text", label: "4. Cena do Boss Final"},
                ].map((step) => {
                  const questId = quest._id || "unsaved_draft";
                  const content =
                    aiResults[questId]?.[step.id] || quest.aiContent?.[step.id];

                  return (
                    <Box key={step.id}>
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        fontWeight="bold"
                      >
                        {step.label}
                        {loadingStep === step.id && (
                          <span style={{marginLeft: 8, opacity: 0.7}}>
                            ⏳ Gerando...
                          </span>
                        )}
                        {content && (
                          <span style={{marginLeft: 8, color: "green"}}>
                            ✅
                          </span>
                        )}
                      </Typography>
                      {content && (
                        <Paper
                          sx={{
                            p: 2,
                            mt: 1,
                            bgcolor: "#f8fafc",
                            color: "#1e293b",
                            whiteSpace: "pre-wrap",
                            fontSize: "0.9rem",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {content}
                        </Paper>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {questTab === 2 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Gere prompts em INGLÊS prontos para usar no Midjourney, DALL-E
                ou Stable Diffusion.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => handleGenerateImages(quest)}
                disabled={loadingStep !== null}
                sx={{mb: 3}}
              >
                {loadingStep ? "Gerando..." : "Gerar Prompts de Imagem"}
              </Button>

              <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                {[
                  {id: "narrative_image", label: "1. Cenário Inicial"},
                  {id: "map_image", label: "2. Mapa e Salas da Dungeon"},
                  {id: "encounters_image", label: "3. Encontros e Armadilhas"},
                  {id: "boss_image", label: "4. Cena do Boss Final"},
                  {id: "loot_image", label: "5. Arte dos Espólios"},
                ].map((step) => {
                  const questId = quest._id || "unsaved_draft";
                  const prompt =
                    aiResults[questId]?.[step.id] || quest.aiContent?.[step.id];

                  return (
                    <Box key={`prompt-${step.id}`}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        display="block"
                      >
                        {step.label}
                        {loadingStep === step.id && (
                          <span style={{marginLeft: 8, opacity: 0.7}}>
                            ⏳ Gerando...
                          </span>
                        )}
                        {prompt && (
                          <span style={{marginLeft: 8, color: "green"}}>
                            ✅
                          </span>
                        )}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "flex-start",
                          mt: 1,
                        }}
                      >
                        <TextField
                          multiline
                          minRows={3}
                          fullWidth
                          size="small"
                          value={prompt || ""}
                          InputProps={{readOnly: true}}
                          placeholder={
                            loadingStep === step.id
                              ? "Aguardando IA..."
                              : "Nenhum prompt gerado."
                          }
                        />
                        <IconButton
                          onClick={() => copyToClipboard(prompt)}
                          color="primary"
                          disabled={!prompt}
                          sx={{bgcolor: "rgba(0,0,0,0.04)"}}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {questTab === 3 && (
            <Box>
              {!quest._id ? (
                <Alert severity="warning" sx={{mb: 2}}>
                  Salve esta operação no banco de missões primeiro para poder
                  anexar arquivos a ela.
                </Alert>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{mb: 2}}
                  >
                    Anexe mapas, artes de monstros e pistas exclusivas desta
                    operação. Elas só aparecerão na mesa principal quando a
                    missão estiver "Ativa".
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        color="secondary"
                        sx={{mb: 1}}
                      >
                        Arquivos do Mestre (Secretos)
                      </Typography>
                      <GameFileManager
                        tableId={tableId}
                        files={(selectedTable?.files || []).filter(
                          (f) => f.questId === quest._id,
                        )}
                        isGM={isGM}
                        onlySecret={true}
                        forceSecretUpload={true}
                        questId={quest._id}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{mb: 1}}
                      >
                        Pistas (Públicas)
                      </Typography>
                      <GameFileManager
                        tableId={tableId}
                        files={(selectedTable?.files || []).filter(
                          (f) => f.questId === quest._id,
                        )}
                        isGM={isGM}
                        excludeSecret={true}
                        questId={quest._id}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          )}
        </Box>
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
          clickable
          onClick={(e) => handleToggleActive(quest, e)}
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
        fullScreen
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
                component="span"
                fontWeight="bold"
                color={selectedQuest.isActive ? "#008394" : "text.primary"}
              >
                {selectedQuest.title}
              </Typography>
              <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Chip
                  icon={
                    selectedQuest.isActive ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )
                  }
                  label={
                    selectedQuest.isActive
                      ? "Visível na Mesa"
                      : "Oculta (Banco)"
                  }
                  color={selectedQuest.isActive ? "info" : "default"}
                  variant={selectedQuest.isActive ? "filled" : "outlined"}
                  sx={{fontWeight: "bold"}}
                />
                <IconButton
                  onClick={() => setDetailsOpen(false)}
                  color="inherit"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
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
