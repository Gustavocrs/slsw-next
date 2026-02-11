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
  Checkbox,
} from "@mui/material";
import styled from "styled-components";
import {CombatList} from "./CombatList";
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
    min-width: auto;

    @media (max-width: 600px) {
      padding: 12px 4px;
      flex: 1;
      max-width: none;
    }

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

    // Sincronizar dados ao focar na janela (corrige diferenças entre Mobile/Desktop)
    const onFocus = () => {
      if (onLoad) onLoad();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
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

  const GridCard = ({
    title,
    children,
    color = "#667eea",
    bg = "#fff",
    sx = {},
  }) => (
    <Box
      sx={{
        background: bg,
        p: 1.5,
        borderRadius: 2,
        borderLeft: `3px solid ${color}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        overflowY: "auto",
        height: "100%",
        ...sx,
      }}
    >
      {title && (
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#444",
          }}
        >
          {title}
        </h4>
      )}
      {children}
    </Box>
  );

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
              width: "100%",
            },
            "& .MuiTabs-flexContainer": {
              display: {xs: "flex", sm: "flex"},
              justifyContent: {xs: "space-between", sm: "flex-start"},
              gap: 2,
              width: "100%",
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <TabStyled
            label={
              <Box>
                👁️
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
                🆔
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
                🎯
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Combate
                </Box>
              </Box>
            }
          />
          <TabStyled
            label={
              <Box>
                ⚔️
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
                ✨
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
                ⚙️
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
                ✨
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
                📝
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
        <Box sx={{p: 2, pb: 10}}>
          <Box sx={{mb: 3, pb: 1, borderBottom: "1px solid #e0e0e0"}}>
            <h2 style={{margin: 0, color: "#333"}}>
              {character.nome || "Sem Nome"}
            </h2>
            <div style={{fontSize: "0.9rem", color: "#666"}}>
              {character.rank} • {character.arquetipo || "—"} (
              {character.conceito || "—"})
              {character.guilda && ` • ${character.guilda}`}
            </div>
            {(character.xp !== undefined ||
              character.riqueza !== undefined) && (
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#555",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {character.xp !== undefined && (
                  <span style={{marginRight: "12px"}}>XP: {character.xp}</span>
                )}
                {character.riqueza !== undefined && (
                  <span>Riqueza: ${character.riqueza}</span>
                )}
              </div>
            )}
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {xs: "1fr", md: "repeat(4, 1fr)"},
              gridTemplateRows: {md: "repeat(5, minmax(min-content, auto))"},
              alignItems: "stretch",
            }}
          >
            {/* 1. IMAGEM (Col 1, Row 1-4) */}
            <Box
              sx={{
                gridColumn: {md: "1"},
                gridRow: {md: "1 / span 4"},
                height: "100%",
              }}
            >
              {character.imagem_url && (
                <img
                  src={character.imagem_url}
                  alt="Personagem"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    maxHeight: "600px",
                  }}
                />
              )}
              {!character.imagem_url && (
                <Box
                  sx={{
                    height: "100%",
                    background: "#eee",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  Sem Foto
                </Box>
              )}
            </Box>

            {/* 2. ATRIBUTOS (Col 2, Row 1) */}
            <Box sx={{gridColumn: {md: "2"}, gridRow: {md: "1"}}}>
              <GridCard title="Atributos" color="#2196f3" bg="#e3f2fd">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 0.5,
                    textAlign: "center",
                  }}
                >
                  {[
                    {l: "AGI", v: character.agilidade},
                    {l: "INT", v: character.intelecto},
                    {l: "ESP", v: character.espirito},
                    {l: "FOR", v: character.forca},
                    {l: "VIG", v: character.vigor},
                  ].map((a) => (
                    <Box key={a.l}>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          color: "#666",
                        }}
                      >
                        {a.l}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: "#2196f3",
                        }}
                      >
                        {a.v || "d4"}
                      </div>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{mt: 2, pt: 1, borderTop: "1px solid rgba(0,0,0,0.1)"}}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Progresso
                  </h4>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      fontSize: "0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "#666",
                          marginBottom: "2px",
                        }}
                      >
                        XP
                      </div>
                      <strong style={{color: "#667eea"}}>
                        {character.xp || 0}
                      </strong>
                    </Box>
                    <Box>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "#666",
                          marginBottom: "2px",
                        }}
                      >
                        Riqueza ($)
                      </div>
                      <strong style={{color: "#667eea"}}>
                        ${character.riqueza || 0}
                      </strong>
                    </Box>
                    <Box>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "#666",
                          marginBottom: "2px",
                        }}
                      >
                        Bênçãos
                      </div>
                      <strong style={{color: "#667eea"}}>
                        {character.bencaos ?? 3}
                      </strong>
                    </Box>
                  </Box>
                </Box>
              </GridCard>
            </Box>

            {/* 3. COMBATE (Col 3, Row 1) */}
            <Box sx={{gridColumn: {md: "3"}, gridRow: {md: "1"}}}>
              <GridCard title="Combate" color="#ef5350" bg="#ffebee">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    textAlign: "center",
                    gap: 1,
                  }}
                >
                  <Box>
                    <div style={{fontSize: "0.6rem"}}>Aparar</div>
                    <div style={{fontWeight: "bold", color: "#d32f2f"}}>
                      {parryBase +
                        (character.aparar_bonus || 0) +
                        armorParryBonus}
                    </div>
                  </Box>
                  <Box>
                    <div style={{fontSize: "0.6rem"}}>Resist.</div>
                    <div style={{fontWeight: "bold", color: "#d32f2f"}}>
                      {toughnessBase +
                        (character.armadura_bonus || 0) +
                        armorDefenseBonus}
                    </div>
                  </Box>
                  <Box>
                    <div style={{fontSize: "0.6rem"}}>Mov.</div>
                    <div style={{fontWeight: "bold", color: "#d32f2f"}}>
                      {character.movimento || 6}
                    </div>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    pt: 1,
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        color: "#d97706",
                      }}
                    >
                      ABALADO
                    </span>
                    <Checkbox
                      checked={character.abalado || false}
                      size="small"
                      onChange={(e) =>
                        updateAttribute("abalado", e.target.checked)
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        color: "#dc2626",
                      }}
                    >
                      FERIMENTOS
                    </span>
                    <Box>
                      {[1, 2, 3].map((lvl) => (
                        <Checkbox
                          key={lvl}
                          checked={(character.ferimentos || 0) >= lvl}
                          size="small"
                          sx={{p: 0.5}}
                          onChange={() => {
                            const current = character.ferimentos || 0;
                            const newVal = current === lvl ? lvl - 1 : lvl;
                            if (newVal > current && !character.abalado) {
                              updateAttribute("abalado", true);
                            }
                            updateAttribute("ferimentos", newVal);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        color: "#7f1d1d",
                      }}
                    >
                      FADIGA
                    </span>
                    <Box>
                      {[1, 2].map((lvl) => (
                        <Checkbox
                          key={lvl}
                          checked={(character.fadiga || 0) >= lvl}
                          size="small"
                          sx={{p: 0.5}}
                          onChange={() => {
                            const current = character.fadiga || 0;
                            const newVal = current === lvl ? lvl - 1 : lvl;
                            updateAttribute("fadiga", newVal);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </GridCard>
            </Box>

            {/* 5. PERÍCIAS (Col 4, Row 1) */}
            <Box sx={{gridColumn: {md: "4"}, gridRow: {md: "1 / span 2"}}}>
              <GridCard title="Perícias" color="#3f51b5" bg="#e8eaf6">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 1,
                  }}
                >
                  {(character.pericias || []).map((s, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        p: 0.5,
                        background: "rgba(255,255,255,0.5)",
                        borderRadius: 1,
                      }}
                    >
                      <span>{s.name}</span>
                      <strong style={{color: "#3f51b5"}}>{s.die}</strong>
                    </Box>
                  ))}
                  {(!character.pericias || character.pericias.length === 0) && (
                    <span style={{fontSize: "0.7rem"}}>Nenhuma</span>
                  )}
                </Box>
              </GridCard>
            </Box>

            {/* 6. ARMAS (Col 2, Row 2) */}
            <Box sx={{gridColumn: {md: "2"}, gridRow: {md: "2"}}}>
              <GridCard title="Armas" color="#e53e3e" bg="#fff5f5">
                {(character.armas || []).map((w, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.7rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{w.name}</span>
                    <span style={{fontWeight: "bold"}}>{w.damage}</span>
                  </div>
                ))}
              </GridCard>
            </Box>

            {/* 9. ARMADURAS (Col 2, Row 3) */}
            <Box sx={{gridColumn: {md: "2"}, gridRow: {md: "3"}}}>
              <GridCard title="Armaduras" color="#48bb78" bg="#f0fff4">
                {(character.armaduras || []).map((a, i) => (
                  <div key={i} style={{fontSize: "0.7rem"}}>
                    {a.name} (+{a.defense || 0})
                  </div>
                ))}
              </GridCard>
            </Box>

            {/* 10. VANTAGENS E COMPLICAÇÕES (Col 3, Row 2-3) */}
            <Box
              sx={{
                gridColumn: {md: "3"},
                gridRow: {md: "2 / span 2"},
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <GridCard title="Vantagens" color="#667eea" bg="#f0fff4">
                <Box sx={{display: "flex", flexDirection: "column", gap: 0.5}}>
                  {(character.vantagens || []).map((v, i) => (
                    <div key={i} style={{fontSize: "0.7rem"}}>
                      • {v.name}
                    </div>
                  ))}
                </Box>
              </GridCard>
              <GridCard title="Complicações" color="#ff9800" bg="#fffbf0">
                {(character.complicacoes || []).map((c, i) => (
                  <div key={i} style={{fontSize: "0.7rem"}}>
                    • {c.name}
                  </div>
                ))}
              </GridCard>
            </Box>

            {/* 12. RECURSOS DO DESPERTAR (Col 3, Row 5) */}
            <Box sx={{gridColumn: {md: "3"}, gridRow: {md: "5"}}}>
              <GridCard
                title="Recursos do Despertar"
                color="#9c27b0"
                bg="#f3e5f5"
              >
                {(character.recursos_despertar || []).map((res, idx) => (
                  <Box
                    key={idx}
                    sx={{mb: 1.5, pb: 1, borderBottom: "1px dashed #ccc"}}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        color: "#6a1b9a",
                      }}
                    >
                      {res.name} (Nv {res.nivel})
                    </div>
                    <div style={{fontSize: "0.7rem"}}>PP: {res.custo}</div>
                    <div
                      style={{fontSize: "0.65rem", color: "#555", marginTop: 2}}
                    >
                      {res.descricao}
                    </div>
                    {res.limitacao && (
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "#d32f2f",
                          marginTop: 1,
                        }}
                      >
                        Lim: {res.limitacao}
                      </div>
                    )}
                  </Box>
                ))}
              </GridCard>
            </Box>

            {/* 13. ITENS e ESPÓLIOS (Col 2, Row 5) - Trocado com Magias */}
            <Box
              sx={{
                gridColumn: {md: "2"},
                gridRow: {md: "5"},
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <GridCard title="Itens" color="#607d8b" bg="#eceff1">
                {(character.itens || []).map((item, i) => (
                  <div key={i} style={{fontSize: "0.7rem"}}>
                    {item.name}
                  </div>
                ))}
              </GridCard>
              <GridCard title="Espólios" color="#009688" bg="#e0f2f1">
                {(character.espolios || []).map((item, i) => (
                  <div key={i} style={{fontSize: "0.7rem"}}>
                    {item.name}
                  </div>
                ))}
              </GridCard>
            </Box>

            {/* 14. NOTAS (Col 1, Row 5) */}
            <Box sx={{gridColumn: {md: "1"}, gridRow: {md: "5"}}}>
              <GridCard title="Notas" color="#ffd700" bg="#fffde7">
                <textarea
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "150px",
                    border: "none",
                    background: "transparent",
                    resize: "none",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                  value={character.notas || ""}
                  onChange={(e) => updateAttribute("notas", e.target.value)}
                  placeholder="Escreva suas anotações..."
                />
              </GridCard>
            </Box>

            {/* 15. MAGIAS (Col 4, Row 3-5) */}
            <Box sx={{gridColumn: {md: "4"}, gridRow: {md: "3 / span 3"}}}>
              <GridCard title="Magias" color="#7e57c2" bg="#f3e5f5">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 1,
                  }}
                >
                  {(character.magias || []).map((m, i) => (
                    <Box
                      key={i}
                      sx={{
                        fontSize: "0.7rem",
                        p: 0.5,
                        background: "rgba(255,255,255,0.5)",
                        borderRadius: 1,
                      }}
                    >
                      <div style={{fontWeight: "bold"}}>{m.name}</div>
                      <div style={{fontSize: "0.65rem", color: "#555"}}>
                        PP: {m.pp} | {m.range}
                      </div>
                    </Box>
                  ))}
                  {(!character.magias || character.magias.length === 0) && (
                    <span style={{fontSize: "0.7rem"}}>Nenhuma magia</span>
                  )}
                </Box>
              </GridCard>
            </Box>
          </Box>
        </Box>
      )}

      {/* TAB 1: IDENTIFICAÇÃO */}
      {tabValue === 1 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
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
                  background: "#e3f2fd",
                  p: 1.5,
                  borderRadius: 1,
                  borderLeft: "4px solid #2196f3",
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

      {/* TAB 2: COMBATE */}
      {tabValue === 2 && (
        <CombatList character={character} updateAttribute={updateAttribute} />
      )}

      {/* TAB 3: PERÍCIAS */}
      {tabValue === 3 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
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
                const isHigher = pVal > aVal;
                return {
                  ...p,
                  style: isHigher ? {backgroundColor: "#fff3e0"} : undefined,
                  dieColor: isHigher ? "#d32f2f" : "#667eea",
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

      {/* TAB 4: VANTAGENS & COMPLICAÇÕES (lado a lado) */}
      {tabValue === 4 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
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

      {/* TAB 5: EQUIPAMENTOS (2x2 Grid) */}
      {tabValue === 5 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
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

      {/* TAB 6: PODERES (Magias + Recursos Despertar) */}
      {tabValue === 6 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
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

      {/* TAB 7: NOTAS */}
      {tabValue === 7 && (
        <Box
          sx={{
            padding: "16px",
            paddingBottom: "80px",
            background: "#fff",
            borderRadius: "12px",
          }}
        >
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
