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
      {/* BARRA DE SAÚDE COMPACTA */}
      <Box
        sx={{
          background: "#fff5f5",
          p: 1.5,
          borderRadius: 2,
          borderLeft: "4px solid #e53e3e",
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Controles de Status (Esquerda) */}
        <Box sx={{display: "flex", alignItems: "center", gap: 3}}>
          {/* Abalado */}
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#d97706",
              }}
            >
              ABALADO
            </span>
            <Checkbox
              checked={character.abalado || false}
              onChange={(e) => updateAttribute("abalado", e.target.checked)}
              size="small"
              sx={{
                p: 0,
                color: "#d97706",
                "&.Mui-checked": {color: "#d97706"},
              }}
            />
          </Box>

          {/* Divisor */}
          <Box sx={{width: "1px", height: "24px", background: "#fecaca"}} />

          {/* Ferimentos */}
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#dc2626",
              }}
            >
              FERIMENTOS
            </span>
            <Box sx={{display: "flex"}}>
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

          {/* Divisor */}
          <Box sx={{width: "1px", height: "24px", background: "#fecaca"}} />

          {/* Fadiga */}
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#991b1b",
              }}
            >
              FADIGA
            </span>
            <Box sx={{display: "flex"}}>
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
        </Box>

        {/* Penalidade (Direita) */}
        <Box
          sx={{
            background: "white",
            border: "1px solid #fecaca",
            borderRadius: 1,
            px: 2,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: "#7f1d1d",
              textTransform: "uppercase",
            }}
          >
            Penalidade
          </span>
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#dc2626",
            }}
          >
            -{(character.ferimentos || 0) + (character.fadiga || 0)}
          </span>
        </Box>
      </Box>

      {/* SEÇÃO 2: ESTATÍSTICAS DE COMBATE */}
      <Grid container spacing={2}>
        {/* Defesas */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              background: "#e3f2fd",
              p: 1.5,
              borderRadius: 2,
              borderLeft: "4px solid #2196f3",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "0.9rem",
                color: "#1e3a8a",
              }}
            >
              Defesas
            </h3>
            <Box sx={{display: "flex", gap: 2}}>
              {/* Aparar */}
              <Box sx={{flex: 1}}>
                <label
                  style={{
                    fontSize: "0.7rem",
                    color: "#1e40af",
                    fontWeight: "bold",
                    marginBottom: "2px",
                    display: "block",
                  }}
                >
                  APARAR
                </label>
                <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                  <Box
                    sx={{
                      background: "#eff6ff",
                      color: "#1e3a8a",
                      fontWeight: "bold",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      minWidth: "30px",
                      textAlign: "center",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    {parryBase +
                      (character.aparar_bonus || 0) +
                      armorParryBonus}
                  </Box>
                  <TextField
                    type="number"
                    placeholder="+Mod"
                    value={character.aparar_bonus || ""}
                    onChange={(e) =>
                      updateAttribute(
                        "aparar_bonus",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    size="small"
                    sx={{
                      width: "60px",
                      "& .MuiInputBase-input": {
                        p: "4px 8px",
                        fontSize: "0.8rem",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Resistência */}
              <Box sx={{flex: 1}}>
                <label
                  style={{
                    fontSize: "0.7rem",
                    color: "#1e40af",
                    fontWeight: "bold",
                    marginBottom: "2px",
                    display: "block",
                  }}
                >
                  RESISTÊNCIA
                </label>
                <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                  <Box
                    sx={{
                      background: "#eff6ff",
                      color: "#1e3a8a",
                      fontWeight: "bold",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      minWidth: "30px",
                      textAlign: "center",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    {toughnessBase +
                      (character.armadura_bonus || 0) +
                      armorDefenseBonus}
                  </Box>
                  <TextField
                    type="number"
                    placeholder="+Arm"
                    value={character.armadura_bonus || ""}
                    onChange={(e) =>
                      updateAttribute(
                        "armadura_bonus",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    size="small"
                    sx={{
                      width: "60px",
                      "& .MuiInputBase-input": {
                        p: "4px 8px",
                        fontSize: "0.8rem",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Recursos e Movimento */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              height: "100%",
            }}
          >
            {/* Bênçãos */}
            <Box
              sx={{
                flex: 1,
                background: "#fffbeb",
                p: 1.5,
                borderRadius: 2,
                borderLeft: "4px solid #ffc107",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: "#b45309",
                  marginBottom: "4px",
                }}
              >
                BÊNÇÃOS
              </label>
              <TextField
                type="number"
                value={character.bencaos ?? 3}
                onChange={(e) =>
                  updateAttribute("bencaos", parseInt(e.target.value) || 0)
                }
                inputProps={{
                  style: {
                    textAlign: "center",
                    fontWeight: 800,
                    color: "#d97706",
                    padding: "4px",
                  },
                }}
                sx={{width: "60px", background: "#fff", borderRadius: 1}}
              />
            </Box>

            {/* Movimentação */}
            <Box
              sx={{
                flex: 1,
                background: "#f3f4f6",
                p: 1.5,
                borderRadius: 2,
                borderLeft: "4px solid #9ca3af",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                MOVIMENTO
              </label>
              <Box sx={{display: "flex", alignItems: "baseline", gap: 0.5}}>
                <TextField
                  type="number"
                  value={character.movimento ?? 6}
                  onChange={(e) =>
                    updateAttribute("movimento", parseInt(e.target.value) || 0)
                  }
                  size="small"
                  inputProps={{
                    style: {
                      textAlign: "center",
                      fontWeight: "bold",
                      padding: "4px",
                    },
                  }}
                  sx={{width: "50px", background: "#fff", borderRadius: 1}}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#6b7280",
                  }}
                >
                  qd
                </span>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* SEÇÃO 3: LESÕES */}
      <Box sx={{mt: 2}}>
        <TextField
          multiline
          rows={2}
          fullWidth
          placeholder="Lesões Permanentes..."
          value={character.lesoes || ""}
          onChange={(e) => updateAttribute("lesoes", e.target.value)}
          sx={{
            background: "#f9fafb",
            "& .MuiOutlinedInput-root": {fontSize: "0.85rem"},
          }}
        />
      </Box>
    </Box>
  );
}
