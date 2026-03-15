"use client";

import React, {useState, useEffect} from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import APIService from "@/lib/api";

export default function QuestBoard({tableId, isGM}) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

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
    loadQuests();
  };

  const handleDelete = async (questId) => {
    if (confirm("Tem certeza que deseja apagar esta missão do banco?")) {
      await APIService.deleteQuestFromTable(tableId, questId);
      loadQuests();
    }
  };

  if (loading) {
    return (
      <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const activeQuests = quests.filter((q) => q.isActive);
  const inactiveQuests = quests.filter((q) => !q.isActive);

  // =====================================================================
  // VISÃO DO JOGADOR (Aviso do Sistema / Associação)
  // =====================================================================
  if (!isGM) {
    if (activeQuests.length === 0) {
      return (
        <Box sx={{textAlign: "center", p: 4, color: "text.secondary"}}>
          <Typography>Nenhuma operação ativa no momento.</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
        {activeQuests.map((quest) => (
          <Card
            key={quest._id}
            sx={{
              border: "1px solid #00e5ff",
              backgroundColor: "rgba(0, 229, 255, 0.05)",
              boxShadow: "0 0 15px rgba(0, 229, 255, 0.2)",
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                color="#00e5ff"
                sx={{fontWeight: "bold", letterSpacing: 2}}
              >
                [ AVISO DO SISTEMA / CONTRATO DE ASSOCIAÇÃO ]
              </Typography>
              <Typography
                variant="h5"
                sx={{mt: 1, mb: 2, color: "white", textTransform: "uppercase"}}
              >
                {quest.title}
              </Typography>
              <Divider sx={{borderColor: "rgba(0, 229, 255, 0.2)", mb: 2}} />

              <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Box>
                  <Typography variant="caption" color="#00e5ff">
                    SITUAÇÃO (GANCHO)
                  </Typography>
                  <Typography variant="body1" color="grey.300">
                    {quest.hook}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="#00e5ff">
                    OBJETIVO PRINCIPAL
                  </Typography>
                  <Typography variant="body1" color="grey.300">
                    {quest.objective}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="#00e5ff">
                    PONTO DE INCURSÃO (LOCAL)
                  </Typography>
                  <Typography variant="body1" color="grey.300">
                    {quest.location}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // =====================================================================
  // VISÃO DO MESTRE (GM Dashboard)
  // =====================================================================
  const renderGMQuestCard = (quest) => (
    <Card
      key={quest._id}
      sx={{
        mb: 2,
        borderLeft: quest.isActive ? "4px solid #00e5ff" : "4px solid grey",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6">{quest.title}</Typography>
            <Chip
              label={
                quest.isActive
                  ? "MISSÃO ATIVA (Visível aos Jogadores)"
                  : "NO BANCO (Oculta)"
              }
              color={quest.isActive ? "primary" : "default"}
              size="small"
              sx={{mt: 1}}
            />
          </Box>
          <Box>
            <Button
              variant={quest.isActive ? "outlined" : "contained"}
              color={quest.isActive ? "warning" : "primary"}
              size="small"
              onClick={() => handleToggleActive(quest)}
              sx={{mr: 1}}
            >
              {quest.isActive ? "Desativar" : "Ativar Missão"}
            </Button>
            {!quest.isActive && (
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(quest._id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <strong>Gancho:</strong> {quest.hook}
            </Typography>
            <Typography variant="body2" sx={{mt: 1}}>
              <strong>Objetivo:</strong> {quest.objective}
            </Typography>
            <Typography variant="body2" sx={{mt: 1}}>
              <strong>Local:</strong> {quest.location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="error.light">
              <strong>Antagonista:</strong> {quest.antagonist}
            </Typography>
            <Typography variant="body2" color="warning.light" sx={{mt: 1}}>
              <strong>Complicação:</strong> {quest.complication}
            </Typography>
            <Typography variant="body2" color="secondary.light" sx={{mt: 1}}>
              <strong>Twist:</strong> {quest.twist}
            </Typography>
            <Typography variant="body2" color="success.light" sx={{mt: 1}}>
              <strong>Recompensa:</strong> {quest.reward}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{mb: 3}}>
        Gerenciador de Operações (GM)
      </Typography>

      <Box sx={{mb: 4}}>
        <Typography variant="h6" color="primary" sx={{mb: 2}}>
          Operações Ativas da Campanha
        </Typography>
        <Divider sx={{mb: 2}} />
        {activeQuests.length === 0 ? (
          <Typography color="text.secondary">
            Nenhuma missão ativa. Ative uma do banco abaixo.
          </Typography>
        ) : (
          activeQuests.map(renderGMQuestCard)
        )}
      </Box>

      <Box>
        <Typography variant="h6" color="text.secondary" sx={{mb: 2}}>
          Banco de Missões Geradas (Inativas)
        </Typography>
        <Divider sx={{mb: 2}} />
        {inactiveQuests.length === 0 ? (
          <Typography color="text.secondary">
            O banco está vazio. Use o botão "Gerar Aventura Aleatória" no menu
            do topo.
          </Typography>
        ) : (
          inactiveQuests.map(renderGMQuestCard)
        )}
      </Box>
    </Box>
  );
}
