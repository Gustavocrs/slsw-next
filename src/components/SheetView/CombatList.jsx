/**
 * CombatList Component
 * Aba de Combate refatorada: Saúde, Defesas, Recursos e Lesões
 */

"use client";

import React from "react";
import {Box, Grid, Checkbox, TextField} from "@mui/material";

export function CombatList({character, updateAttribute}) {
  // Cálculos de Combate
  const fightingSkill = character.pericias?.find((p) => p.name === "Lutar");
  const fightingDieVal = fightingSkill
    ? parseInt((fightingSkill.die || "d4").replace("d", ""), 10)
    : 0;
  const parryBase = fightingSkill ? 2 + fightingDieVal / 2 : 2;
  const armorParryBonus = (character.armaduras || []).reduce((acc, item) => {
    return acc + (parseInt(item.ap || item.parry || 0, 10) || 0);
  }, 0);
  const armorDefenseBonus = (character.armaduras || []).reduce((acc, item) => {
    return acc + (parseInt(item.defense || item.def || 0, 10) || 0);
  }, 0);
  const vigorDieVal = parseInt((character.vigor || "d4").replace("d", ""), 10);
  const toughnessBase = 2 + vigorDieVal / 2;

  return (
    <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
      {/* TITULO: SAÚDE */}
      <Box sx={{mb: 4}}>
        <h3
          style={{
            margin: "0 0 16px 0",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            color: "#333",
          }}
        >
          Saúde
        </h3>
        <Grid container spacing={2} alignItems="center">
          {/* Abalado */}
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#d97706",
                  marginBottom: "4px",
                }}
              >
                ABALADO
              </span>
              <Checkbox
                checked={character.abalado || false}
                onChange={(e) => updateAttribute("abalado", e.target.checked)}
                sx={{color: "#d97706", "&.Mui-checked": {color: "#d97706"}}}
              />
            </Box>
          </Grid>

          {/* Ferimentos */}
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#dc2626",
                  marginBottom: "4px",
                }}
              >
                FERIMENTOS
              </span>
              <Box>
                {[1, 2, 3].map((level) => (
                  <Checkbox
                    key={level}
                    checked={(character.ferimentos || 0) >= level}
                    onChange={() => {
                      const current = character.ferimentos || 0;
                      const newVal = current === level ? level - 1 : level;
                      if (newVal > current && !character.abalado) {
                        updateAttribute("abalado", true);
                      }
                      updateAttribute("ferimentos", newVal);
                    }}
                    size="small"
                    sx={{
                      p: 0.5,
                      color: "#ef4444",
                      "&.Mui-checked": {color: "#dc2626"},
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Fadiga */}
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#991b1b",
                  marginBottom: "4px",
                }}
              >
                FADIGA
              </span>
              <Box>
                {[1, 2].map((level) => (
                  <Checkbox
                    key={level}
                    checked={(character.fadiga || 0) >= level}
                    onChange={() => {
                      const current = character.fadiga || 0;
                      const newVal = current === level ? level - 1 : level;
                      updateAttribute("fadiga", newVal);
                    }}
                    size="small"
                    sx={{
                      p: 0.5,
                      color: "#ef4444",
                      "&.Mui-checked": {color: "#dc2626"},
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Penalidade */}
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#7f1d1d",
                  marginBottom: "4px",
                }}
              >
                PENALIDADE
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#dc2626",
                }}
              >
                -{(character.ferimentos || 0) + (character.fadiga || 0)}
              </span>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* TITULO: DEFESAS */}
      <Box sx={{mb: 4}}>
        <h3
          style={{
            margin: "0 0 16px 0",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            color: "#333",
          }}
        >
          Defesas
        </h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f9fafb",
                p: 2,
                borderRadius: 1,
              }}
            >
              <span
                style={{fontWeight: "bold", color: "#374151", fontSize: "1rem"}}
              >
                Aparar
              </span>
              <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <span
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#1e3a8a",
                  }}
                >
                  {parryBase + (character.aparar_bonus || 0) + armorParryBonus}
                </span>
                <TextField
                  type="number"
                  placeholder="+A"
                  value={character.aparar_bonus || ""}
                  onChange={(e) =>
                    updateAttribute(
                      "aparar_bonus",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  size="small"
                  sx={{width: "80px", bgcolor: "white"}}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f9fafb",
                p: 2,
                borderRadius: 1,
              }}
            >
              <span
                style={{fontWeight: "bold", color: "#374151", fontSize: "1rem"}}
              >
                Resistência
              </span>
              <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <span
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#1e3a8a",
                  }}
                >
                  {toughnessBase +
                    (character.armadura_bonus || 0) +
                    armorDefenseBonus}
                </span>
                <TextField
                  type="number"
                  placeholder="+D"
                  value={character.armadura_bonus || ""}
                  onChange={(e) =>
                    updateAttribute(
                      "armadura_bonus",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  size="small"
                  sx={{width: "80px", bgcolor: "white"}}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* TITULO: OUTROS */}
      <Box sx={{mb: 4}}>
        <h3
          style={{
            margin: "0 0 16px 0",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            color: "#333",
          }}
        >
          Outros
        </h3>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              <label
                style={{fontSize: "0.9rem", fontWeight: "bold", color: "#666"}}
              >
                Benes
              </label>
              <TextField
                type="number"
                value={character.bencaos ?? 3}
                onChange={(e) =>
                  updateAttribute("bencaos", parseInt(e.target.value) || 0)
                }
                size="small"
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              <label
                style={{fontSize: "0.9rem", fontWeight: "bold", color: "#666"}}
              >
                Movimento
              </label>
              <TextField
                type="number"
                value={character.movimento ?? 6}
                onChange={(e) =>
                  updateAttribute("movimento", parseInt(e.target.value) || 0)
                }
                size="small"
                fullWidth
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* LESÕES PERMANENTES */}
      <Box>
        <h3
          style={{
            margin: "0 0 16px 0",
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            color: "#333",
          }}
        >
          Lesões Permanentes
        </h3>
        <TextField
          multiline
          rows={3}
          fullWidth
          value={character.lesoes || ""}
          onChange={(e) => updateAttribute("lesoes", e.target.value)}
          sx={{
            background: "#f9fafb",
            "& .MuiOutlinedInput-root": {fontSize: "0.95rem"},
          }}
        />
      </Box>
    </Box>
  );
}
