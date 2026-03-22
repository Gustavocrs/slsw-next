/**
 * BestiaryView
 * Malha de visualização do bestiário.
 * Implementa layout de grid para os MonsterCards e prepara terreno para Infinite Scroll.
 */

"use client";

import React, {useRef, useCallback, useEffect, useState} from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Pets as PetsIcon,
  Settings as SettingsIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import MonsterCard from "./MonsterCard";
import {useBestiaryStore} from "../../stores/bestiaryStore";

export default function BestiaryView() {
  const {loading, filters, setFilters, fetchMonsters, getFilteredMonsters} =
    useBestiaryStore();

  const router = useRouter();

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState(null);

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

  const filteredMonsters = getFilteredMonsters();

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
          <Grid item xs={12} md={4}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#0f172a"
                sx={{display: "flex", alignItems: "center", gap: 1}}
              >
                <PetsIcon sx={{color: "#667eea"}} />
                Bestiário SWADE
              </Typography>
              <IconButton
                size="small"
                onClick={() => router.push("/bestiary/admin")}
                title="Painel de Ingestão (Admin)"
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
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{display: "block", mt: 0.5}}
            >
              Catálogo de criaturas e entidades mapeadas.
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
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
            <Box sx={{maxWidth: "800px", mx: "auto", height: "100%"}}>
              <MonsterCard monster={selectedMonster} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
