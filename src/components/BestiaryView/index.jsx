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
} from "@mui/material";
import {Search as SearchIcon, Pets as PetsIcon} from "@mui/icons-material";
import MonsterCard from "./MonsterCard";
import {useBestiaryStore} from "../../stores/bestiaryStore";

export default function BestiaryView() {
  const {loading, filters, setFilters, fetchMonsters, getFilteredMonsters} =
    useBestiaryStore();

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

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

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
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
            <Typography
              variant="h5"
              fontWeight="900"
              color="#0f172a"
              sx={{display: "flex", alignItems: "center", gap: 1}}
            >
              <PetsIcon sx={{color: "#667eea"}} />
              Bestiário SWADE
            </Typography>
            <Typography variant="caption" color="text.secondary">
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

      {/* Grid Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: {xs: 2, md: 3},
          bgcolor: "#f1f5f9",
        }}
      >
        {loading ? (
          <Box sx={{display: "flex", justifyContent: "center", py: 8}}>
            <CircularProgress />
          </Box>
        ) : filteredMonsters.length === 0 ? (
          <Box sx={{textAlign: "center", color: "text.secondary", py: 8}}>
            <Typography variant="body1">
              Nenhuma criatura encontrada.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredMonsters.map((monster, index) => {
              const isLast = filteredMonsters.length === index + 1;
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={monster.id}
                  ref={isLast ? lastMonsterElementRef : null}
                >
                  <MonsterCard monster={monster} />
                </Grid>
              );
            })}
          </Grid>
        )}

        {loadingMore && (
          <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
