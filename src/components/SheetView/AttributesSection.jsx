/**
 * AttributesSection Component
 * Seção de atributos (Agilidade, Intelecto, Espírito, Força, Vigor)
 */

"use client";

import React from "react";
import styled from "styled-components";
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

const SectionContainer = styled(Paper)`
  && {
    padding: 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.4rem;
  border-left: 4px solid #667eea;
  padding-left: 12px;
`;

const AttributeBox = styled(Box)`
  padding: 16px;
  background: white;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }

  label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .MuiSelect-root {
    font-size: 1.2rem;
    font-weight: 700;
    color: #667eea;
  }
`;

const StatusBar = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  font-size: 0.9rem;

  .spent {
    font-weight: 700;
    color: #667eea;
  }

  .max {
    color: #999;
  }
`;

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
