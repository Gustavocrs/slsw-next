/**
 * MonsterCard Component
 * Exibe as estatísticas de uma criatura baseada nas regras SWADE.
 * Adota o padrão visual do SheetView (OverviewPanel/MetricCard).
 */

"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {
  Pets as PetsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const statBoxStyle = {
  p: 1,
  borderRadius: "8px",
  textAlign: "center",
  bgcolor: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.2)",
};

export default function MonsterCard({monster, onDelete, onEdit}) {
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
        height: "100%",
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* Botões de Ação */}
      {(onDelete || onEdit) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            gap: 0.5,
          }}
        >
          {onEdit && (
            <Tooltip title="Editar Criatura">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(monster)}
                sx={{
                  bgcolor: alpha("#667eea", 0.1),
                  "&:hover": {bgcolor: alpha("#667eea", 0.2)},
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Excluir Criatura">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(monster)}
              sx={{
                bgcolor: alpha("#b91c1c", 0.1),
                "&:hover": {bgcolor: alpha("#b91c1c", 0.2)},
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Grid container spacing={3} sx={{height: "100%"}}>
        {/* Lado Esquerdo - Detalhes do Monstro */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{display: "flex", flexDirection: "column", gap: 2}}
        >
          {/* Header: Nome, Rank e Tipo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              pr: {xs: 4, md: 0},
            }}
          >
            <Box sx={{minWidth: 0, flexGrow: 1}}>
              <Typography
                variant="subtitle1"
                sx={{fontWeight: 800, color: "#0f172a", lineHeight: 1.1}}
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
                  label={
                    monster.type ? monster.type.split("/")[0].trim() : "Besta"
                  }
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
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 0.5,
            }}
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
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
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
                sx={{
                  mt: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
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
        </Grid>

        {/* Lado Direito - Imagem */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{display: "flex", flexDirection: "column"}}
        >
          <Box
            sx={{
              width: "100%",
              minHeight: {xs: 200, md: "100%"},
              borderRadius: "8px",
              border: `1px solid ${alpha("#94a3b8", 0.2)}`,
              bgcolor: alpha("#0f172a", 0.03),
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {monster.imagem_url ? (
              <Box
                component="img"
                src={monster.imagem_url}
                alt={monster.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            ) : (
              <Box sx={{textAlign: "center", color: "#94a3b8"}}>
                <PetsIcon sx={{fontSize: 64, mb: 1, opacity: 0.5}} />
                <Typography variant="caption" display="block">
                  Sem Imagem
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
