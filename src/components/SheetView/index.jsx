/**
 * SheetView Component
 * Visualização da ficha do personagem - Tabs com Identificação e Visualizar tipo SWADE
 */

"use client";

import React, {useMemo} from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  Alert,
} from "@mui/material";
import styled from "styled-components";
import DynamicList from "./DynamicList";
import SkillsList from "./SkillsList";
import MagiasList from "./MagiasList";
import ArmorList from "./ArmorList";
import WeaponsList from "./WeaponsList";
import ItemsList from "./ItemsList";
import EspoliosList from "./EspoliosList";
import VantagesList from "./VantagesList";
import ComplicacoesList from "./ComplicacoesList";
import RecursosDespertarList from "./RecursosDespertarList";
import {useCharacterStore} from "@/stores/characterStore";
import {
  DICE,
  SKILLS,
  EDGES,
  HINDRANCES,
  POWERS,
  RANKS,
  getSkillAttribute,
  filterEdgesByRank,
  filterPowersByRank,
  calculateTotalSkillPoints,
  calculateTotalEdgePoints,
  calculateTotalHindrancePoints,
} from "@/lib/rpgEngine";

const TabsPaper = styled(Paper)`
  && {
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TabStyled = styled(Tab)`
  && {
    text-transform: none;
    font-weight: 600;
    font-size: 0.95rem;
    color: #666;
    padding: 10px 16px;

    &.Mui-selected {
      color: #667eea;
      font-weight: 700;
    }
  }
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 8px;
      font-size: 0.95rem;
    }
    .MuiInputBase-input {
      padding: 10px 12px;
    }
  }
`;

const StyledSelect = styled(Select)`
  && {
    border-radius: 8px;
    font-size: 0.95rem;
  }
`;

const PointsBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  background: #f0f0f0;
  color: #333;
  margin-left: 8px;
`;

function SheetView({saveSuccess, onLoad}) {
  const [tabValue, setTabValue] = React.useState(0);
  const character = useCharacterStore((state) => state.character);
  const updateAttribute = useCharacterStore((state) => state.updateAttribute);
  const updateListItem = useCharacterStore((state) => state.updateListItem);
  const addItemToList = useCharacterStore((state) => state.addItemToList);
  const removeItemFromList = useCharacterStore(
    (state) => state.removeItemFromList,
  );
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  // Redirecionar para Visualizar após salvar
  React.useEffect(() => {
    if (saveSuccess) {
      setTabValue(0);
    }
  }, [saveSuccess]);

  // Carregar dados ao montar o componente para garantir sincronia com Firestore
  React.useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Calcular pontos gastos
  const skillPointsSpent = useMemo(
    () =>
      calculateTotalSkillPoints(character.pericias, {
        agilidade: character.agilidade,
        intelecto: character.intelecto,
        espirito: character.espirito,
        forca: character.forca,
        vigor: character.vigor,
      }),
    [
      character.pericias,
      character.agilidade,
      character.intelecto,
      character.espirito,
      character.forca,
      character.vigor,
    ],
  );

  const edgePointsSpent = useMemo(
    () => calculateTotalEdgePoints(character.vantagens),
    [character.vantagens],
  );

  const hindrancePointsGained = useMemo(
    () => calculateTotalHindrancePoints(character.complicacoes),
    [character.complicacoes],
  );

  const attributePointsSpent = useMemo(() => {
    const costs = {d4: 0, d6: 1, d8: 2, d10: 3, d12: 4};
    return (
      (costs[character.agilidade || "d4"] || 0) +
      (costs[character.intelecto || "d4"] || 0) +
      (costs[character.espirito || "d4"] || 0) +
      (costs[character.forca || "d4"] || 0) +
      (costs[character.vigor || "d4"] || 0)
    );
  }, [
    character.agilidade,
    character.intelecto,
    character.espirito,
    character.forca,
    character.vigor,
  ]);

  const availableAttributePoints = 5 - attributePointsSpent;

  const availableEdges = useMemo(
    () => filterEdgesByRank(character.rank || "Novato"),
    [character.rank],
  );

  const availablePowers = useMemo(
    () => filterPowersByRank(character.rank || "Novato"),
    [character.rank],
  );

  const skillFields = [
    {
      name: "name",
      label: "Perícia",
      type: "select",
      options: Object.keys(SKILLS).map((k) => ({value: k, label: k})),
    },
    {
      name: "die",
      label: "Dado",
      type: "select",
      options: DICE.map((d) => ({value: d, label: d})),
    },
  ];

  const weaponFields = [
    {name: "name", label: "Arma"},
    {name: "damage", label: "Dano"},
    {name: "range", label: "Alcance"},
  ];

  const armorFields = [
    {name: "name", label: "Armadura"},
    {name: "defense", label: "Defesa"},
    {name: "parry", label: "Aparar"},
  ];

  const resources_fields = [
    {name: "name", label: "Nome", flex: 1},
    {name: "pp", label: "Custo", flex: 0.5, width: "80px"},
    {
      name: "nivel",
      label: "Nível",
      type: "select",
      options: [1, 2, 3, 4, 5].map((n) => ({value: n, label: `${n}`})),
      flex: 0.5,
      width: "80px",
    },
    {name: "descricao", label: "Descrição"},
    {name: "limitacao", label: "Limitação"},
  ];

  return (
    <Box>
      {/* Tabs - Nova ordem */}
      <TabsPaper>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: "2px solid #e0e0e0",
            "& .MuiTabs-indicator": {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              height: 3,
            },
            "& .MuiTabs-scroller": {
              display: {xs: "flex", sm: "block"},
            },
            "& .MuiTabs-flexContainer": {
              display: {xs: "flex", sm: "flex"},
              justifyContent: {xs: "space-around", sm: "flex-start"},
              gap: {xs: 0, sm: 1},
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <TabStyled
            label={
              <Box>
                👁️{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Visualizar
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                🆔{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Identificação
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                🎯{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Perícias
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                ✨{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Vant. & Comp.
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                ⚙️{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Equipamentos
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                ✨{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Poderes
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                📝{" "}
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Notas
                </Box>
              </Box>
            }
          />
        </Tabs>
      </TabsPaper>

      {/* TAB 0: VISUALIZAR */}
      {tabValue === 0 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
          <Box sx={{mb: 2, pb: 1.5, borderBottom: "2px solid #667eea"}}>
            <h2 style={{margin: "0 0 4px 0", fontSize: "1.4rem"}}>
              {character.nome || "Sem Nome"}
            </h2>
            <p style={{margin: "0", fontSize: "0.9rem", color: "#666"}}>
              {character.rank} • {character.arquetipo || "—"} (
              {character.conceito || "—"})
              {character.guilda ? ` • ${character.guilda}` : ""}
            </p>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{background: "#f9f9f9", p: 1.5, borderRadius: 1}}>
                <h4 style={{margin: "0 0 12px 0", fontSize: "0.9rem"}}>
                  Atributos
                </h4>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 0.5,
                    textAlign: "center",
                  }}
                >
                  {[
                    {label: "AGI", key: "agilidade"},
                    {label: "INT", key: "intelecto"},
                    {label: "ESP", key: "espirito"},
                    {label: "FOR", key: "forca"},
                    {label: "VIG", key: "vigor"},
                  ].map((attr) => (
                    <Box key={attr.key}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        {attr.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "700",
                          color: "#667eea",
                        }}
                      >
                        {character[attr.key] || "d4"}
                      </div>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{background: "#f9f9f9", p: 1.5, borderRadius: 1}}>
                <h4 style={{margin: "0 0 10px 0", fontSize: "0.9rem"}}>
                  Progresso
                </h4>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    fontSize: "0.85rem",
                  }}
                >
                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <span>XP:</span>
                    <strong style={{color: "#667eea"}}>
                      {character.xp || 0}
                    </strong>
                  </Box>
                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <span>Riqueza ($):</span>
                    <strong style={{color: "#667eea"}}>
                      ${character.riqueza || 0}
                    </strong>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "#f9f9f9",
                  p: 1.5,
                  borderRadius: 1,
                  maxHeight: "100%",
                  overflowY: "auto",
                }}
              >
                <h4 style={{margin: "0 0 10px 0", fontSize: "0.9rem"}}>
                  Perícias
                </h4>
                {character.pericias && character.pericias.length > 0 ? (
                  <Box
                    sx={{display: "flex", flexDirection: "column", gap: 0.5}}
                  >
                    {character.pericias.map((skill, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                        }}
                      >
                        <span>{skill.name}</span>
                        <strong style={{color: "#667eea"}}>{skill.die}</strong>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <p style={{margin: 0, fontSize: "0.85rem", color: "#999"}}>
                    Nenhuma perícia
                  </p>
                )}
              </Box>
            </Grid>

            {character.recursos_despertar &&
              character.recursos_despertar.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      background: "#fff0f5",
                      p: 1.5,
                      borderRadius: 1,
                      borderLeft: "3px solid #e53e3e",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 18px 0",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      Recursos Despertar
                    </h4>
                    <Box
                      sx={{display: "flex", flexDirection: "column", gap: 0.5}}
                    >
                      {character.recursos_despertar.map((res, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            fontSize: "0.8rem",
                          }}
                        >
                          <div className="w-full flex flex-col justify-start items-center gap-2">
                            <div className="w-full flex justify-between items-center">
                              <p className="w-full">
                                <i>{res.name}</i>
                              </p>
                              <div
                                className="w-full"
                                style={{fontSize: "0.75rem", color: "#666"}}
                              >
                                PP: {res.custo} | Nível {res.nivel}
                              </div>
                            </div>
                            <div className="w-full font-bold text-xs">
                              <span>Descrição: </span>
                              <span className="font-normal text-xs ">
                                {res.descricao || "N/A"}
                              </span>
                            </div>
                            <div className="w-full font-bold  text-xs">
                              <span>Limitação: </span>
                              <span className="font-normal">
                                {res.limitacao || "N/A"}
                              </span>
                            </div>
                          </div>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}

            {character.vantagens && character.vantagens.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "#f0fff4",
                    p: 1.5,
                    borderRadius: 1,
                    borderLeft: "3px solid #667eea",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Vantagens
                  </h4>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      flex: 1,
                    }}
                  >
                    {character.vantagens.map((edge, idx) => {
                      const source =
                        EDGES.find((e) => e.name === edge.name)?.source ||
                        "SWADE";
                      return (
                        <div key={idx} style={{fontSize: "0.7rem"}}>
                          • {edge.name}
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "#999",
                              marginLeft: "4px",
                            }}
                          >
                            ({source})
                          </span>
                        </div>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            )}

            {character.complicacoes && character.complicacoes.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "#fffbf0",
                    p: 1.5,
                    borderRadius: 1,
                    borderLeft: "3px solid #ff9800",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Complicações
                  </h4>
                  <Box
                    sx={{display: "flex", flexDirection: "column", gap: 0.5}}
                  >
                    {character.complicacoes.map((hind, idx) => (
                      <div key={idx} style={{fontSize: "0.7rem"}}>
                        • {hind.name}
                      </div>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}

            {character.magias && character.magias.length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    background: "#f0e6ff",
                    p: 1.5,
                    borderRadius: 1,
                    borderLeft: "3px solid #667eea",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Magias Conhecidas
                  </h4>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {xs: "1fr", md: "1fr 1fr"},
                      gap: 1,
                    }}
                  >
                    {character.magias.map((spell, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          fontSize: "0.7rem",
                          background: "rgba(255,255,255,0.6)",
                          p: 1,
                          borderRadius: "4px",
                        }}
                      >
                        <span className="font-semibold">{spell.name}</span>
                        <div style={{fontSize: "0.6rem", color: "#666"}}>
                          PP: {spell.pp} | {spell.range} | {spell.duration}
                        </div>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}

            {character.armas && character.armas.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "#fff5f5",
                    p: 1.5,
                    borderRadius: 1,
                    borderLeft: "3px solid #e53e3e",
                    maxHeight: "140px",
                    overflowY: "auto",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Armas
                  </h4>
                  <Box
                    sx={{display: "flex", flexDirection: "column", gap: 0.5}}
                  >
                    {character.armas.map((weapon, idx) => (
                      <div key={idx} style={{fontSize: "0.85rem"}}>
                        {weapon.name} - {weapon.damage || "—"}
                      </div>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}

            {character.armaduras && character.armaduras.length > 0 && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "#f5f9e6",
                    p: 1.5,
                    borderRadius: 1,
                    borderLeft: "3px solid #48bb78",
                    maxHeight: "140px",
                    overflowY: "auto",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Armaduras
                  </h4>
                  <Box
                    sx={{display: "flex", flexDirection: "column", gap: 0.5}}
                  >
                    {character.armaduras.map((armor, idx) => {
                      const isShield =
                        armor.name?.toLowerCase().includes("escudo") ||
                        (parseInt(armor.defense) === 0 &&
                          parseInt(armor.ap) > 0);
                      return (
                        <div key={idx} style={{fontSize: "0.85rem"}}>
                          {isShield
                            ? `${armor.name}: Aparar +${armor.ap || "—"}`
                            : `${armor.name}: Def +${armor.defense || "—"}`}
                        </div>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            )}

            {character.itens && character.itens.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{background: "#f5f5f5", p: 1.5, borderRadius: 1}}>
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Itens ({character.itens.length})
                  </h4>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      },
                      gap: 1,
                    }}
                  >
                    {character.itens.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: "0.8rem",
                          padding: "4px 8px",
                          background: "#fff",
                          borderRadius: "4px",
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* TAB 1: IDENTIFICAÇÃO */}
      {tabValue === 1 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Nome do Personagem"
                value={character.nome || ""}
                onChange={(e) => updateAttribute("nome", e.target.value)}
                placeholder="Ex: Sung Jinwoo"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Jogador"
                value={character.jogador || ""}
                onChange={(e) => updateAttribute("jogador", e.target.value)}
                placeholder="Nome do jogador"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Conceito"
                value={character.conceito || ""}
                onChange={(e) => updateAttribute("conceito", e.target.value)}
                placeholder="Ex: Guerreiro prudente"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Arquétipo</InputLabel>
                <StyledSelect
                  value={character.arquetipo || ""}
                  label="Arquétipo"
                  onChange={(e) => updateAttribute("arquetipo", e.target.value)}
                >
                  <MenuItem value="">Selecione...</MenuItem>
                  <MenuItem value="Assaulter">⚡ Assaulter</MenuItem>
                  <MenuItem value="Tank">🛡️ Tank</MenuItem>
                  <MenuItem value="Healer">✨ Healer</MenuItem>
                  <MenuItem value="Caster">🔮 Caster</MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Guilda"
                value={character.guilda || ""}
                onChange={(e) => updateAttribute("guilda", e.target.value)}
                placeholder="Ex: Hunter's Association"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <StyledTextField
                fullWidth
                type="number"
                label="XP"
                value={character.xp || 0}
                onChange={(e) =>
                  updateAttribute("xp", parseInt(e.target.value) || 0)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Rank</InputLabel>
                <StyledSelect
                  value={character.rank || "Novato"}
                  label="Rank"
                  onChange={(e) => updateAttribute("rank", e.target.value)}
                >
                  {RANKS.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="number"
                label="Riqueza ($)"
                value={character.riqueza || 0}
                onChange={(e) =>
                  updateAttribute("riqueza", parseInt(e.target.value) || 0)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="URL da Imagem (Retrato)"
                value={character.imagem_url || ""}
                onChange={(e) => updateAttribute("imagem_url", e.target.value)}
                placeholder="https://..."
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  background: "#f0f0f0",
                  p: 1.5,
                  borderRadius: 1,
                  borderLeft: "4px solid #667eea",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <h4 style={{margin: "0", fontSize: "0.95rem"}}>Atributos</h4>
                  <Tooltip title="Cada d6 custa 1 ponto, d8 custa 2, d10 custa 3, d12 custa 4. Total: 5 pontos">
                    <PointsBadge
                      style={{
                        background:
                          availableAttributePoints > 0 ? "#e8f5e9" : "#ffebee",
                      }}
                    >
                      {availableAttributePoints}/5 restantes
                    </PointsBadge>
                  </Tooltip>
                </Box>
                <Grid container spacing={1}>
                  {[
                    {key: "agilidade", label: "Agi"},
                    {key: "intelecto", label: "Int"},
                    {key: "espirito", label: "Esp"},
                    {key: "forca", label: "For"},
                    {key: "vigor", label: "Vig"},
                  ].map((attr) => (
                    <Grid item xs={6} sm={4} md={2.4} key={attr.key}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{attr.label}</InputLabel>
                        <StyledSelect
                          value={character[attr.key] || "d4"}
                          label={attr.label}
                          onChange={(e) =>
                            updateAttribute(attr.key, e.target.value)
                          }
                        >
                          {DICE.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 2: PERÍCIAS */}
      {tabValue === 2 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h3 style={{margin: "0", fontSize: "1.1rem"}}>🎯 Perícias</h3>
            <Tooltip title="Custo: 1 ponto por dado até o atributo chave. 2 pontos por dado acima.">
              <PointsBadge>{skillPointsSpent}/12 pts</PointsBadge>
            </Tooltip>
          </Box>

          <Alert severity="info" sx={{mb: 2}}>
            Ao comprar uma perícia acima do seu atributo chave, o custo sobe
            para 2 pontos por passo.
          </Alert>

          <Box sx={{maxWidth: "600px"}}>
            <SkillsList
              items={character?.pericias?.map((p) => {
                const attrKey = getSkillAttribute(p.name);
                const attrDie = character[attrKey] || "d4";
                const pVal = parseInt((p.die || "d4").replace("d", ""), 10);
                const aVal = parseInt(attrDie.replace("d", ""), 10);
                return {
                  ...p,
                  style: pVal > aVal ? {backgroundColor: "#fff3e0"} : undefined,
                };
              })}
              onAdd={(item) => {
                const idx = (character.pericias || []).findIndex(
                  (p) => p.name === item.name,
                );
                if (idx >= 0) removeItemFromList("pericias", idx);
                addItemToList("pericias", item);
              }}
              onRemove={(idx) => removeItemFromList("pericias", idx)}
              addButtonLabel="+ "
            />
          </Box>
        </Box>
      )}

      {/* TAB 3: VANTAGENS & COMPLICAÇÕES (lado a lado) */}
      {tabValue === 3 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2}}>
          <Grid container spacing={2}>
            {/* VANTAGENS - Coluna esquerda */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <h3 style={{margin: "0", fontSize: "1.1rem"}}>
                    ✨ Vantagens
                  </h3>
                  <Tooltip title="Cada vantagem custa 2 pontos.">
                    <PointsBadge>{edgePointsSpent} pts</PointsBadge>
                  </Tooltip>
                </Box>

                <VantagesList
                  items={(character.vantagens || []).map((v) => {
                    const edge = EDGES.find((e) => e.name === v.name);
                    return edge ? {...edge, ...v} : v;
                  })}
                  onAdd={(item) => addItemToList("vantagens", item)}
                  onRemove={(idx) => removeItemFromList("vantagens", idx)}
                  onUpdate={(idx, item) =>
                    updateListItem("vantagens", idx, item)
                  }
                />
              </Box>
            </Grid>

            {/* COMPLICAÇÕES - Coluna direita */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <h3 style={{margin: "0", fontSize: "1.1rem"}}>
                    ⚠️ Complicações
                  </h3>
                  <Tooltip title="Maior: -2 pts. Menor: -1 ponto.">
                    <PointsBadge
                      style={{
                        background:
                          hindrancePointsGained < 0 ? "#e8f5e9" : "#f5f5f5",
                      }}
                    >
                      {hindrancePointsGained < 0 ? "" : "+"}
                      {hindrancePointsGained}
                      <span> pts</span>
                    </PointsBadge>
                  </Tooltip>
                </Box>

                <ComplicacoesList
                  items={(character.complicacoes || []).map((c) => {
                    const hind = HINDRANCES.find((h) => h.name === c.name);
                    return hind ? {...hind, ...c} : c;
                  })}
                  onAdd={(item) => addItemToList("complicacoes", item)}
                  onRemove={(idx) => removeItemFromList("complicacoes", idx)}
                  onUpdate={(idx, item) =>
                    updateListItem("complicacoes", idx, item)
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 4: EQUIPAMENTOS (2x2 Grid) */}
      {tabValue === 4 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2}}>
          <Grid container spacing={2}>
            {/* ARMAS - Superior esquerdo */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                ⚔️ Armas
              </h3>
              <WeaponsList
                items={character.armas || []}
                onAdd={(item) => addItemToList("armas", item)}
                onRemove={(idx) => removeItemFromList("armas", idx)}
                onUpdate={(idx, item) => updateListItem("armas", idx, item)}
              />
            </Grid>

            {/* ITENS - Superior direito */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                🎒 Itens
              </h3>
              <ItemsList
                items={character.itens || []}
                onAdd={(item) => addItemToList("itens", item)}
                onRemove={(idx) => removeItemFromList("itens", idx)}
                onUpdate={(idx, item) => updateListItem("itens", idx, item)}
              />
            </Grid>

            {/* ARMADURAS - Inferior esquerdo */}
            <Grid item xs={12} md={6}>
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Armaduras & Escudos
              </h3>
              <ArmorList
                items={character.armaduras || []}
                onAdd={(item) => addItemToList("armaduras", item)}
                onRemove={(idx) => removeItemFromList("armaduras", idx)}
                onUpdate={(idx, item) => updateListItem("armaduras", idx, item)}
                addButtonLabel="+ "
              />
            </Grid>

            {/* ESPÓLIOS - Inferior direito */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                💎 Espólios
              </h3>
              <EspoliosList
                items={character.espolios || []}
                onAdd={(item) => addItemToList("espolios", item)}
                onRemove={(idx) => removeItemFromList("espolios", idx)}
                onUpdate={(idx, item) => updateListItem("espolios", idx, item)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 5: PODERES (Magias + Recursos Despertar) */}
      {tabValue === 5 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2}}>
          <Grid container spacing={2}>
            {/* MAGIAS - Coluna esquerda */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                🔮 Magias
              </h3>
              <MagiasList
                items={character.magias || []}
                onAdd={(item) => addItemToList("magias", item)}
                onRemove={(idx) => removeItemFromList("magias", idx)}
              />
            </Grid>

            {/* RECURSOS DESPERTAR - Coluna direita */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                💥 Recursos do Despertar
              </h3>
              <RecursosDespertarList
                items={character.recursos_despertar || []}
                onAdd={(item) => addItemToList("recursos_despertar", item)}
                onUpdate={(idx, item) =>
                  updateListItem("recursos_despertar", idx, item)
                }
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 6: NOTAS */}
      {tabValue === 6 && (
        <Box sx={{padding: "16px", background: "#fff", borderRadius: "12px"}}>
          <h3 style={{margin: "0 0 12px 0"}}>📝 Notas</h3>
          <textarea
            style={{
              width: "100%",
              height: "300px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}
            value={character.notas || ""}
            onChange={(e) =>
              useCharacterStore.setState((state) => ({
                character: {
                  ...state.character,
                  notas: e.target.value,
                },
              }))
            }
            placeholder="Adicione suas anotações aqui..."
          />
        </Box>
      )}
    </Box>
  );
}

export default SheetView;
