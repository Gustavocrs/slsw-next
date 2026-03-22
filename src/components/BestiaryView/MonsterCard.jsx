/**
 * MonsterCard Component
 * Exibe as estatísticas de uma criatura baseada nas regras SWADE.
 * Adota o padrão visual do SheetView (OverviewPanel/MetricCard).
 */

"use client";

import React from "react";
import {Box, Typography, Chip, Divider, Grid} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {Pets as PetsIcon} from "@mui/icons-material";

const statBoxStyle = {
  p: 1,
  borderRadius: "8px",
  textAlign: "center",
  bgcolor: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.2)",
};

export default function MonsterCard({monster}) {
  if (!monster) return null;

  // Atributos SWADE padrão
  const attributes = [
    {label: "AGI", value: monster.attributes?.Agility || "d4"},
    {label: "INT", value: monster.attributes?.Smarts || "d4"},
    {label: "ESP", value: monster.attributes?.Spirit || "d4"},
    {label: "FOR", value: monster.attributes?.Strength || "d4"},
    {label: "VIG", value: monster.attributes?.Vigor || "d4"},
  ];

  // Estatísticas Derivadas
  const derived = [
    {label: "Movimento", value: monster.pace || 6, accent: "#1d4ed8"},
    {label: "Aparar", value: monster.parry || 2, accent: "#b91c1c"},
    {label: "Resistência", value: monster.toughness || 2, accent: "#991b1b"},
  ];

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "12px",
        border: `1px solid ${alpha("#667eea", 0.18)}`,
        background: `linear-gradient(180deg, ${alpha("#667eea", 0.05)} 0%, #ffffff 100%)`,
        boxShadow: `0 10px 22px ${alpha("#0f172a", 0.06)}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 2,
      }}
    >
      {/* Header: Nome, Rank e Tipo */}
      <Box sx={{display: "flex", alignItems: "flex-start", gap: 1.5}}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "8px",
            display: "grid",
            placeItems: "center",
            color: "#667eea",
            bgcolor: alpha("#667eea", 0.14),
            flexShrink: 0,
          }}
        >
          <PetsIcon />
        </Box>
        <Box sx={{minWidth: 0, flexGrow: 1}}>
          <Typography
            variant="subtitle1"
            sx={{fontWeight: 800, color: "#0f172a", lineHeight: 1.1}}
            noWrap
          >
            {monster.name || "Criatura Desconhecida"}
          </Typography>
          <Box sx={{display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap"}}>
            <Chip
              label={`Rank ${monster.rank || "?"}`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: alpha("#b91c1c", 0.1),
                color: "#b91c1c",
              }}
            />
            <Chip
              label={monster.type || "Besta"}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: alpha("#475569", 0.1),
                color: "#475569",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{borderColor: alpha("#94a3b8", 0.15)}} />

      {/* Atributos Básicos */}
      <Box
        sx={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0.5}}
      >
        {attributes.map((attr) => (
          <Box key={attr.label} sx={statBoxStyle}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#64748b",
                display: "block",
                fontSize: "0.6rem",
              }}
            >
              {attr.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{fontWeight: 900, color: "#0f172a"}}
            >
              {attr.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Estatísticas Derivadas */}
      <Box
        sx={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1}}
      >
        {derived.map((stat) => (
          <Box
            key={stat.label}
            sx={{
              ...statBoxStyle,
              border: `1px solid ${alpha(stat.accent, 0.2)}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#64748b",
                display: "block",
                fontSize: "0.6rem",
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{fontWeight: 900, color: stat.accent}}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Perícias */}
      {monster.skills && (
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Perícias
          </Typography>
          <Typography
            variant="body2"
            sx={{color: "#334155", fontSize: "0.8rem", mt: 0.5}}
          >
            {monster.skills}
          </Typography>
        </Box>
      )}

      {/* Habilidades Especiais */}
      {monster.specialAbilities && monster.specialAbilities.length > 0 && (
        <Box sx={{flexGrow: 1}}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Habilidades Especiais
          </Typography>
          <Box
            sx={{mt: 0.5, display: "flex", flexDirection: "column", gap: 0.5}}
          >
            {monster.specialAbilities.map((ability, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{fontSize: "0.8rem", color: "#334155", lineHeight: 1.2}}
              >
                <strong style={{color: "#0f172a"}}>{ability.name}:</strong>{" "}
                {ability.description}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Loot (Espólios) */}
      {monster.loot && (
        <Box
          sx={{
            mt: "auto",
            pt: 1,
            borderTop: `1px dashed ${alpha("#94a3b8", 0.3)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{fontWeight: 800, color: "#059669", display: "block"}}
          >
            💎 Espólios Base
          </Typography>
          <Typography
            variant="body2"
            sx={{color: "#10b981", fontSize: "0.75rem", fontWeight: 600}}
          >
            {monster.loot}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
