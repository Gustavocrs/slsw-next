"use client";

import React, {useState, useMemo} from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
} from "@mui/material";
import {Search as SearchIcon, Pets as PetsIcon} from "@mui/icons-material";
import {bestiaryData} from "../../data/bestiary";

export default function BestiaryView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonster, setSelectedMonster] = useState(null);

  const filteredMonsters = useMemo(() => {
    if (!searchTerm) return bestiaryData;
    return bestiaryData.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  return (
    <Box sx={{display: "flex", height: "100%", width: "100%", bgcolor: "#fff"}}>
      {/* Esquerda: Lista de Monstros */}
      <Box
        sx={{
          width: {xs: "100%", md: "350px"},
          borderRight: "1px solid #e0e0e0",
          display: {xs: selectedMonster ? "none" : "flex", md: "flex"},
          flexDirection: "column",
          bgcolor: "#f8fafc",
        }}
      >
        <Box sx={{p: 2, borderBottom: "1px solid #e0e0e0"}}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary"
            sx={{mb: 2, display: "flex", alignItems: "center", gap: 1}}
          >
            <PetsIcon /> Bestiário
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar criatura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List sx={{flexGrow: 1, overflowY: "auto", p: 0}}>
          {filteredMonsters.map((monster) => (
            <ListItem key={monster.id} disablePadding divider>
              <ListItemButton
                selected={selectedMonster?.id === monster.id}
                onClick={() => setSelectedMonster(monster)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "rgba(0, 184, 212, 0.1)",
                    borderLeft: "4px solid #00b8d4",
                  },
                }}
              >
                <ListItemText
                  primary={monster.name}
                  secondary={`Rank ${monster.rank} • ${monster.type}`}
                  primaryTypographyProps={{fontWeight: "bold"}}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {filteredMonsters.length === 0 && (
            <Box sx={{p: 3, textAlign: "center", color: "text.secondary"}}>
              <Typography variant="body2">
                Nenhuma criatura encontrada.
              </Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Direita: Detalhes do Monstro */}
      <Box
        sx={{
          flexGrow: 1,
          display: {xs: !selectedMonster ? "none" : "flex", md: "flex"},
          flexDirection: "column",
          overflowY: "auto",
          bgcolor: "#fff",
        }}
      >
        {selectedMonster ? (
          <Box sx={{p: {xs: 2, md: 4}}}>
            <Box sx={{display: {xs: "block", md: "none"}, mb: 2}}>
              <Typography
                variant="button"
                color="primary"
                sx={{cursor: "pointer", fontWeight: "bold"}}
                onClick={() => setSelectedMonster(null)}
              >
                ← Voltar para lista
              </Typography>
            </Box>

            <Box
              sx={{mb: 4, display: "flex", gap: 3, alignItems: "flex-start"}}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#e2e8f0",
                  color: "#64748b",
                }}
              >
                <PetsIcon sx={{fontSize: 40}} />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{mb: 1}}
                >
                  {selectedMonster.name}
                </Typography>
                <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                  <Chip
                    label={`Rank ${selectedMonster.rank}`}
                    color="error"
                    size="small"
                    sx={{fontWeight: "bold"}}
                  />
                  <Chip
                    label={selectedMonster.type}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>

            <Paper variant="outlined" sx={{p: 2, mb: 3, bgcolor: "#f8fafc"}}>
              <Typography
                variant="body1"
                sx={{fontStyle: "italic", color: "text.secondary"}}
              >
                "{selectedMonster.description}"
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                  sx={{mb: 1, borderBottom: "1px solid #e2e8f0", pb: 0.5}}
                >
                  Atributos
                </Typography>
                <Box sx={{display: "flex", gap: 2, flexWrap: "wrap", mb: 2}}>
                  {Object.entries(selectedMonster.attributes).map(
                    ([key, val]) => (
                      <Box
                        key={key}
                        sx={{
                          textAlign: "center",
                          bgcolor: "#f1f5f9",
                          p: 1,
                          borderRadius: 1,
                          minWidth: 60,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            color: "text.secondary",
                          }}
                        >
                          {key}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {val}
                        </Typography>
                      </Box>
                    ),
                  )}
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                  sx={{mb: 1, borderBottom: "1px solid #e2e8f0", pb: 0.5}}
                >
                  Estatísticas Derivadas
                </Typography>
                <Box sx={{display: "flex", gap: 3, mb: 2}}>
                  <Typography variant="body2">
                    <strong>Movimento:</strong> {selectedMonster.pace}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Aparar:</strong> {selectedMonster.parry}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Resistência:</strong> {selectedMonster.toughness}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                  sx={{mb: 1, borderBottom: "1px solid #e2e8f0", pb: 0.5}}
                >
                  Perícias e Habilidades
                </Typography>
                <Typography variant="body2" sx={{mb: 3}}>
                  {selectedMonster.skills}
                </Typography>

                {selectedMonster.specialAbilities &&
                  selectedMonster.specialAbilities.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary"
                        sx={{mb: 1, borderBottom: "1px solid #e2e8f0", pb: 0.5}}
                      >
                        Habilidades Especiais
                      </Typography>
                      <Box sx={{mb: 3}}>
                        {selectedMonster.specialAbilities.map(
                          (ability, idx) => (
                            <Typography
                              key={idx}
                              variant="body2"
                              sx={{mb: 0.5}}
                            >
                              <strong>{ability.name}:</strong>{" "}
                              {ability.description}
                            </Typography>
                          ),
                        )}
                      </Box>
                    </>
                  )}

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                  sx={{mb: 1, borderBottom: "1px solid #e2e8f0", pb: 0.5}}
                >
                  Espólios (Loot)
                </Typography>
                <Typography
                  variant="body2"
                  color="success.main"
                  fontWeight="bold"
                >
                  {selectedMonster.loot}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">
              Selecione uma criatura para ver os detalhes
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
