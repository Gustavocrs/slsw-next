/**
 * AwakeningSection Component
 * Seção para registro dos dados do Despertar e Estrutura do Poder Único
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
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {useCharacterStore} from "@/stores/characterStore";
import RecursosDespertarList from "./RecursosDespertarList";

const SectionContainer = styled(Paper)`
  && {
    padding: 24px;
    margin-bottom: 24px;
    height: 100%;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-left: 4px solid ${({$borderColor}) => $borderColor || "#ccc"};
  }
`;

const SectionHeader = styled(Typography)`
  && {
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

// Opções extraídas do Manual (src/data/manualSections.js)
const OPTIONS = {
  origem: [
    "Explosão de Mana ao abrir um Portal",
    "Toque de uma criatura rúnica morrendo",
    "Contato com artefato ou relíquia antiga",
    "Participação em ritual arcano instável",
    "Trauma físico extremo (quase-morte)",
    "Chamado de uma entidade desconhecida",
  ],
  sensacao: [
    "Calor intenso no peito",
    "Clarão repentino e perda breve de sentidos",
    "Sensação de leveza, como flutuar",
    "Eco de uma voz ou memória estranha",
    "Veias brilhando por segundos",
    "Dor aguda seguida de calma profunda",
    "Sombra movendo-se por conta própria",
    "Percepção do tempo ficando lento",
  ],
  afinidade: [
    "Fogosa (Força e impacto)",
    "Sombria (Furtividade e sombras)",
    "Luminosa (Cura e proteção)",
    "Instável (Poder alto, risco alto)",
    "Ancestral (Runas e Relíquias)",
    "Elemental (Fogo, vento, terra, gelo)",
    "Bestial (Força bruta e sentidos)",
    "Sábia (Controle mágico refinado)",
    "Pura (Interação com Portais)",
    "Corrompida (Poder intenso e riscos)",
  ],
  marca: [
    "Veias brilhantes",
    "Olho alterado",
    "Sombra viva",
    "Aura quente",
    "Aura fria",
    "Runa no peito",
    "Respiração pesada",
    "Voz dupla",
    "Cabelo que muda",
    "Cicatriz brilhante",
    "Mãos frias",
    "Forma astral",
  ],
  fonte: ["Mana Bruta", "Corpo", "Alma", "Sombra", "Tempo", "Vínculo"],
  expressao: [
    "Ataque Especial",
    "Defesa Reativa",
    "Transformação",
    "Passiva Permanente",
    "Área de Efeito",
    "Invocação",
    "Controle",
    "Suporte",
  ],
  gatilho: [
    "Gasto de Mana",
    "Ao sofrer dano",
    "Ao derrotar um inimigo",
    "1x por cena",
    "Condição específica",
    "Sempre ativo (efeito reduzido)",
  ],
};

function AwakeningSection() {
  const character = useCharacterStore((state) => state.character);
  const updateAttribute = useCharacterStore((state) => state.updateAttribute);
  const addItemToList = useCharacterStore((state) => state.addItemToList);
  const updateListItem = useCharacterStore((state) => state.updateListItem);

  const renderSelect = (label, key, options) => (
    <Grid item xs={12}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          value={character[key] || ""}
          label={label}
          onChange={(e) => updateAttribute(key, e.target.value)}
        >
          <MenuItem value="">
            <em>Selecione...</em>
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  return (
    <Box sx={{p: 2, pb: 10}}>
      <Grid container spacing={3}>
        {/* Coluna 1: O Despertar */}
        <Grid item xs={12} md={4}>
          <SectionContainer $borderColor="#9c27b0">
            <SectionHeader variant="h6">✨ O Despertar</SectionHeader>
            <Typography variant="body2" color="textSecondary" paragraph>
              Detalhes sobre o momento em que você se tornou um Caçador.
            </Typography>

            <Grid container spacing={2}>
              {renderSelect("Origem", "despertar_origem", OPTIONS.origem)}
              {renderSelect("Sensação", "despertar_sensacao", OPTIONS.sensacao)}
              {renderSelect(
                "Afinidade",
                "despertar_afinidade",
                OPTIONS.afinidade,
              )}
              {renderSelect("Marca", "despertar_marca", OPTIONS.marca)}
            </Grid>
          </SectionContainer>
        </Grid>

        {/* Coluna 2: Estrutura do Poder Único */}
        <Grid item xs={12} md={4}>
          <SectionContainer $borderColor="#ff9800">
            <SectionHeader variant="h6">⚡ Estrutura do Poder</SectionHeader>
            <Typography variant="body2" color="textSecondary" paragraph>
              A fundação do seu poder especial (Fonte + Expressão + Gatilho).
            </Typography>

            <Grid container spacing={2}>
              {renderSelect("Fonte", "poder_unico_fonte", OPTIONS.fonte)}
              {renderSelect(
                "Expressão",
                "poder_unico_expressao",
                OPTIONS.expressao,
              )}
              {renderSelect("Gatilho", "poder_unico_gatilho", OPTIONS.gatilho)}
            </Grid>
          </SectionContainer>
        </Grid>

        {/* Coluna 3: Detalhes Mecânicos */}
        <Grid item xs={12} md={4}>
          <SectionContainer $borderColor="#2196f3">
            <SectionHeader variant="h6">⚙️ Detalhes Mecânicos</SectionHeader>
            <Typography variant="body2" color="textSecondary" paragraph>
              Definição de regras e custos.
            </Typography>

            <RecursosDespertarList
              items={character.recursos_despertar || []}
              onAdd={(item) => addItemToList("recursos_despertar", item)}
              onUpdate={(idx, item) =>
                updateListItem("recursos_despertar", idx, item)
              }
            />
            <Typography
              variant="caption"
              display="block"
              sx={{color: "#666", fontStyle: "italic", mt: 2}}
            >
              * Defina aqui o nome, custo e regras do seu Poder Único.
            </Typography>
          </SectionContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AwakeningSection;
