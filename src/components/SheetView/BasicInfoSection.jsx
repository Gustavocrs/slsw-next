/**
 * BasicInfoSection Component
 * Seção de informações básicas (nome, conceito, arquétipo, rank)
 */

"use client";

import React from "react";
import {styled} from "@mui/material/styles";
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import {useCharacterStore} from "@/stores/characterStore";
import {RANKS} from "@/lib/rpgEngine";

const SectionContainer = styled(Paper)(({theme}) => ({
  padding: "24px",
  borderRadius: "12px",
  background: "#1e293b",
  marginBottom: "24px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  borderLeft: "4px solid #00bcd4",
}));

const StyledTextField = styled(TextField)(({theme}) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s ease",

    "&:hover": {
      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.15)",
    },

    "&.Mui-focused": {
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
    },
  },
}));

const StyledSelect = styled(Select)(({theme}) => ({
  borderRadius: "8px",
}));

function BasicInfoSection() {
  const character = useCharacterStore((state) => state.character);
  const updateAttribute = useCharacterStore((state) => state.updateAttribute);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);

  return (
    <SectionContainer>
      <Grid container spacing={3}>
        {/* Nome */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Nome do Personagem"
            value={character.nome || ""}
            onChange={(e) => updateAttribute("nome", e.target.value)}
            placeholder="Ex: Sung Jinwoo"
            variant="outlined"
          />
        </Grid>

        {/* Concepção */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Conceito"
            value={character.conceito || ""}
            onChange={(e) => updateAttribute("conceito", e.target.value)}
            placeholder="Ex: Caçador Shadow"
            variant="outlined"
          />
        </Grid>

        {/* Arquétipo */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Arquétipo"
            value={character.arquetipo || ""}
            onChange={(e) => updateAttribute("arquetipo", e.target.value)}
            placeholder="Ex: Assassino Sombrio"
            variant="outlined"
          />
        </Grid>

        {/* Rank */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Rank</InputLabel>
            <StyledSelect
              value={character.rank || "Novato"}
              onChange={(e) => updateAttribute("rank", e.target.value)}
              label="Rank"
            >
              {RANKS.map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </Grid>
      </Grid>
    </SectionContainer>
  );
}

export default BasicInfoSection;
