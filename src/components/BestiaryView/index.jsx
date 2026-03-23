/**
 * BestiaryView
 * Malha de visualização do bestiário.
 * Implementa layout de grid para os MonsterCards e prepara terreno para Infinite Scroll.
 */

"use client";

import React, {useRef, useCallback, useEffect, useState, useMemo} from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  MenuItem,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Pets as PetsIcon,
  Settings as SettingsIcon,
  FileDownload as FileDownloadIcon,
  Close as CloseIcon,
  FormatListBulleted as ListIcon,
} from "@mui/icons-material";
import MonsterCard from "./MonsterCard";
import MonsterFormDialog from "./MonsterFormDialog";
import {useBestiaryStore} from "../../stores/bestiaryStore";
import BestiaryAdminPage from "@/app/bestiary/admin/page";

export default function BestiaryView() {
  const {
    loading,
    monsters,
    filters,
    setFilters,
    fetchMonsters,
    deleteMonster,
    saveMonster,
  } = useBestiaryStore();

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [monsterToDelete, setMonsterToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [monsterToEdit, setMonsterToEdit] = useState(null);

  // Referência para o IntersectionObserver (Infinite Scroll)
  const observer = useRef();
  const lastMonsterElementRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // TODO: Acionar função `fetchNextPage()` do Zustand aqui
          console.log("Intersected! Fetch more monsters...");
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore],
  );

  useEffect(() => {
    fetchMonsters();
  }, [fetchMonsters]);

  // Ordem oficial de Ranks (do menor pro maior poder)
  const RANK_ORDER = [
    "Extra",
    "Carta Selvagem",
    "Novato",
    "Experiente",
    "Veterano",
    "Heroico",
    "Lendário",
  ];

  // Extrai dinamicamente todos os Ranks presentes nos monstros para o filtro
  const availableRanks = useMemo(() => {
    const ranks = new Set(monsters.map((m) => m.rank).filter(Boolean));
    return Array.from(ranks).sort((a, b) => {
      const indexA = RANK_ORDER.indexOf(a);
      const indexB = RANK_ORDER.indexOf(b);
      // Se ambos não estiverem na lista padrão, ordena alfabeticamente
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1; // Itens desconhecidos vão pro final
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [monsters]);

  const filteredMonsters = useMemo(() => {
    const filtered = monsters.filter((monster) => {
      const mName = monster.name || "";
      const matchName = mName
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchRank = filters.rank ? monster.rank === filters.rank : true;
      const matchType = filters.type ? monster.type === filters.type : true;
      return matchName && matchRank && matchType;
    });

    // Ordena em ordem alfabética pelo nome da criatura
    return filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [monsters, filters]);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(filteredMonsters, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bestiario_swade.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportIndex = () => {
    const namesStr = filteredMonsters
      .map((m) => m.name || "Criatura Desconhecida")
      .join("\n");
    const blob = new Blob([namesStr], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bestiario_indice.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteMonster = (monster) => {
    setMonsterToDelete(monster);
  };

  const confirmDelete = async () => {
    if (!monsterToDelete) return;
    // Pega o ID seguro do Firebase (_id) se existir, caso contrário o id local
    const targetId = monsterToDelete._id || monsterToDelete.id;
    await deleteMonster(targetId);
    if (selectedMonster?._id === targetId || selectedMonster?.id === targetId) {
      setSelectedMonster(null);
    }
    setMonsterToDelete(null);
  };

  const handleOpenForm = (monster = null) => {
    setMonsterToEdit(monster);
    setFormOpen(true);
  };

  const handleSaveMonster = async (data) => {
    const saved = await saveMonster(data);
    // Atualiza automaticamente o monstro selecionado para refletir as edições
    // ou seleciona a criatura que acabou de ser criada.
    setSelectedMonster(saved);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header & Search */}
      <Box
        sx={{
          p: {xs: 2, md: 3},
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#f8fafc",
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="900"
                color="#0f172a"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  m: 0,
                  lineHeight: 1,
                }}
              >
                <PetsIcon sx={{color: "#667eea"}} />
                Bestiário
              </Typography>
              <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleOpenForm(null)}
                  sx={{
                    mr: 1,
                    bgcolor: "#667eea",
                    "&:hover": {bgcolor: "#5a67d8"},
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Novo Monstro
                </Button>
                <IconButton
                  size="small"
                  onClick={handleExportIndex}
                  title="Exportar Índice (Apenas Nomes)"
                >
                  <ListIcon sx={{color: "#94a3b8"}} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setAdminPanelOpen(true)}
                  title="Painel de Ingestão Avançado"
                >
                  <SettingsIcon sx={{color: "#94a3b8"}} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleExportJson}
                  title="Exportar JSON atual"
                >
                  <FileDownloadIcon sx={{color: "#94a3b8"}} />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{display: "flex", gap: 2}}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar pelo nome..."
                value={filters.name}
                onChange={(e) => setFilters({name: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{color: "#94a3b8"}} />
                    </InputAdornment>
                  ),
                }}
                sx={{bgcolor: "#fff", borderRadius: 1}}
              />
              <TextField
                select
                size="small"
                label="Rank"
                value={filters.rank || ""}
                onChange={(e) => setFilters({rank: e.target.value})}
                sx={{minWidth: 130, bgcolor: "#fff", borderRadius: 1}}
              >
                <MenuItem value="">Todos</MenuItem>
                {availableRanks.map((rank) => (
                  <MenuItem key={rank} value={rank}>
                    {rank}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Split Content */}
      <Grid container sx={{flexGrow: 1, overflow: "hidden"}}>
        {/* Coluna Esquerda: Lista de Monstros (25%) */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            height: "100%",
            overflowY: "auto",
            bgcolor: "#fff",
            borderRight: "1px solid #e2e8f0",
            p: 2,
          }}
        >
          {loading ? (
            <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredMonsters.length === 0 ? (
            <Box sx={{textAlign: "center", color: "text.secondary", py: 4}}>
              <Typography variant="body2">
                Nenhuma criatura encontrada.
              </Typography>
            </Box>
          ) : (
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              {filteredMonsters.map((monster, index) => {
                const isLast = filteredMonsters.length === index + 1;
                const isSelected = selectedMonster?.id === monster.id;
                return (
                  <Box
                    key={monster.id}
                    ref={isLast ? lastMonsterElementRef : null}
                    onClick={() => setSelectedMonster(monster)}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: isSelected ? "#667eea" : "#e2e8f0",
                      bgcolor: isSelected
                        ? "rgba(102, 126, 234, 0.08)"
                        : "#fff",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: isSelected
                          ? "rgba(102, 126, 234, 0.08)"
                          : "#f8fafc",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{fontWeight: 700, color: "#0f172a"}}
                      noWrap
                    >
                      {monster.name || "Criatura Desconhecida"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{color: "#64748b"}}
                      display="block"
                    >
                      {monster.type || "Besta"} • Rank {monster.rank || "?"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
          {loadingMore && (
            <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Grid>

        {/* Coluna Direita: Detalhes do Monstro (75%) */}
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            height: "100%",
            overflowY: "auto",
            bgcolor: "#f1f5f9",
            p: {xs: 2, md: 4},
          }}
        >
          {!selectedMonster ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.7,
              }}
            >
              <PetsIcon sx={{fontSize: 64, color: "#94a3b8", mb: 2}} />
              <Typography variant="h5" sx={{color: "#475569", fontWeight: 700}}>
                Bestiário Mágico
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  mt: 1,
                  maxWidth: 400,
                  textAlign: "center",
                }}
              >
                Selecione uma criatura na lista ao lado para inspecionar suas
                estatísticas detalhadas, perícias e espólios.
              </Typography>
            </Box>
          ) : (
            <Box sx={{height: "100%"}}>
              <MonsterCard
                monster={selectedMonster}
                onDelete={handleDeleteMonster}
                onEdit={handleOpenForm}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Modal do Painel de Ingestão */}
      <Dialog
        open={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{display: "flex", justifyContent: "flex-end", pt: 1, pr: 1}}>
          <IconButton onClick={() => setAdminPanelOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{pt: 0, pb: 4}}>
          <BestiaryAdminPage />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={Boolean(monsterToDelete)}
        onClose={() => setMonsterToDelete(null)}
      >
        <DialogTitle>Excluir Criatura</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir{" "}
            <strong>{monsterToDelete?.name}</strong> do bestiário? Esta ação não
            pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{p: 2, pt: 0}}>
          <Button onClick={() => setMonsterToDelete(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disableElevation
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Criação / Edição de Monstro */}
      <MonsterFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveMonster}
        initialData={monsterToEdit}
      />
    </Box>
  );
}
