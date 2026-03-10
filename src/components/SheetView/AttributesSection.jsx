/**
 * AttributesSection Component
 * Seção de atributos (Agilidade, Intelecto, Espírito, Força, Vigor)
 */

"use client";

import React from "react";
import {styled} from "@mui/material/styles";
import {
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from "@mui/material";
import {useCharacterStore} from "@/stores/characterStore";
import {validateAttributes, DICE} from "@/lib/rpgEngine";

const SectionContainer = styled(Paper)(({theme}) => ({
  padding: "24px",
  borderRadius: "12px",
  background: "#1e293b",
  marginBottom: "24px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  borderLeft: "4px solid #29b6f6",
}));

const SectionTitle = styled("h2")(({theme}) => ({
  margin: "0 0 20px 0",
  color: theme.palette.text.primary,
  fontSize: "1.4rem",
  borderLeft: "4px solid #667eea",
  paddingLeft: "12px",
}));

const AttributeBox = styled(Box)(({theme}) => ({
  padding: "16px",
  background: theme.palette.background.default,
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "2px solid transparent",

  "&:hover": {
    borderColor: "#667eea",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
  },

  "& label": {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  "& .MuiSelect-root": {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
}));

const StatusBar = styled(Box)(({theme}) => ({
  display: "flex",
  gap: "8px",
  marginTop: "12px",
  fontSize: "0.9rem",
  "& .spent": {fontWeight: 700, color: "#667eea"},
  "& .max": {color: "#999"},
}));

const ATTRIBUTES = [
  {key: "agilidade", label: "🏃", name: "Agilidade"},
  {key: "intelecto", label: "🧠", name: "Intelecto"},
  {key: "espirito", label: "✨", name: "Espírito"},
  {key: "forca", label: "💪", name: "Força"},
  {key: "vigor", label: "❤️", name: "Vigor"},
];

function AttributesSection() {
  const character = useCharacterStore((state) => state.character);
  const updateAttribute = useCharacterStore((state) => state.updateAttribute);

  const attrs = {
    agilidade: character.agilidade || "d6",
    intelecto: character.intelecto || "d6",
    espirito: character.espirito || "d6",
    forca: character.forca || "d6",
    vigor: character.vigor || "d6",
  };

  const validation = validateAttributes(attrs);

  return (
    <SectionContainer>
      <SectionTitle>⚔️ Atributos</SectionTitle>

      <Grid container spacing={2} sx={{mb: 3}}>
        {ATTRIBUTES.map((attr) => (
          <Grid item xs={12} sm={6} md={4} key={attr.key}>
            <AttributeBox>
              <FormControl fullWidth>
                <InputLabel>{attr.name}</InputLabel>
                <Select
                  value={attrs[attr.key]}
                  onChange={(e) => updateAttribute(attr.key, e.target.value)}
                  label={attr.name}
                >
                  {DICE.map((die) => (
                    <MenuItem key={die} value={die}>
                      {die}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AttributeBox>
          </Grid>
        ))}
      </Grid>

      {/* Status de Validação */}
      {validation.status === "error" && (
        <Alert severity="error" sx={{mb: 2}}>
          ⚠️ Você gastou {validation.spent} pontos em atributos. Máximo
          permitido: {validation.max}
        </Alert>
      )}
      {validation.status === "warn" && (
        <Alert severity="info" sx={{mb: 2}}>
          ℹ️ Você usou todos os {validation.max} pontos de atributo disponíveis!
        </Alert>
      )}

      {/* Status Summary */}
      <StatusBar>
        <span className="spent">Pontos gastos: {validation.spent}</span>
        <span className="max">/ {validation.max} máximo</span>
      </StatusBar>
    </SectionContainer>
  );
}

export default AttributesSection;
