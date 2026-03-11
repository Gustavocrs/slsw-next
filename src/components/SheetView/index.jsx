/**
 * SheetView Component
 * Visualização da ficha do personagem - Tabs com Identificação e Visualizar tipo SWADE
 */

"use client";

import React, {useMemo, useState} from "react";
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
  Switch,
  FormControlLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
} from "@mui/material";
import {CircularProgress} from "@mui/material";
import {styled} from "@mui/material/styles";
import {
  CheckCircle,
  CloudUpload,
  Error as ErrorIcon,
  AutoAwesome as AiIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Bolt as BoltIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {CombatList} from "./CombatList";
import SkillsList from "./SkillsList";
import MagiasList from "./MagiasList";
import ArmorList from "./ArmorList";
import WeaponsList from "./WeaponsList";
import ItemsList from "./ItemsList";
import EspoliosList from "./EspoliosList";
import VantagesList from "./VantagesList";
import ComplicacoesList from "./ComplicacoesList";
import AwakeningSection from "./AwakeningSection";
import {useCharacterStore, useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";
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
  calculateMaxMana,
} from "@/lib/rpgEngine";

const TabsPaper = styled(Paper)(({theme}) => ({
  marginBottom: "12px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "@media print": {
    display: "none",
  },
}));

const TabStyled = styled(Tab)(({theme}) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#666",
  padding: "10px 16px",
  minWidth: "auto",

  [theme.breakpoints.down("sm")]: {
    padding: "12px 4px",
    flex: 1,
    maxWidth: "none",
  },

  "&.Mui-selected": {
    color: "#667eea",
    fontWeight: 700,
  },
}));

const StyledTextField = styled(TextField)(({theme}) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
  "& .MuiInputBase-input": {
    padding: "10px 12px",
  },
}));

const StyledSelect = styled(Select)(({theme}) => ({
  borderRadius: "8px",
  fontSize: "0.95rem",
}));

const PointsBadge = styled("span")(({theme}) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  background: "#f0f0f0",
  color: "#333",
  marginLeft: "8px",
}));

const GridCard = ({
  title,
  children,
  color = "#667eea",
  bg = "#fff",
  retro = false,
  sx = {},
}) => (
  <Box
    sx={{
      background: retro ? "#f4e4bc" : bg,
      p: 1.5,
      borderRadius: retro ? 0 : 2,
      border: retro ? "1px solid #5d4037" : "none",
      borderLeft: retro ? "1px solid #5d4037" : `3px solid ${color}`,
      boxShadow: retro
        ? "3px 3px 0 rgba(93, 64, 55, 0.4)"
        : "0 2px 4px rgba(0,0,0,0.05)",
      color: retro ? "#3e2723" : "inherit",
      overflowY: "auto",
      height: "100%",
      position: "relative",
      "&::before": retro
        ? {
            content: '""',
            position: "absolute",
            top: "2px",
            left: "2px",
            right: "2px",
            bottom: "2px",
            border: "1px solid rgba(93, 64, 55, 0.2)",
            pointerEvents: "none",
          }
        : {},
      "@media print": {
        overflow: "visible",
        height: "auto",
        boxShadow: "none",
        border: "1px solid #000",
        breakInside: "avoid",
      },
      ...sx,
    }}
  >
    {title && (
      <h4
        style={{
          margin: "0 0 8px 0",
          fontSize: retro ? "1.1rem" : "1rem",
          fontWeight: retro ? 700 : 600,
          color: retro ? "#3e2723" : "#444",
          fontFamily: retro ? '"Times New Roman", serif' : "inherit",
          textTransform: retro ? "uppercase" : "none",
          borderBottom: retro ? "1px solid rgba(93, 64, 55, 0.2)" : "none",
          paddingBottom: retro ? "4px" : "0",
        }}
      >
        {title}
      </h4>
    )}
    <div style={{fontFamily: retro ? '"Times New Roman", serif' : "inherit"}}>
      {children}
    </div>
  </Box>
);

function SheetView({
  saveSuccess,
  onLoad,
  character: propCharacter,
  actions: propActions,
}) {
  const {sheetTab, setSheetTab, selectedTable, showNotification} = useUIStore();

  // Se estiver inspecionando (propCharacter), usa estado local para não afetar a navegação principal
  const [localTab, setLocalTab] = React.useState(0);
  const isInspection = !!propCharacter;

  const tabValue = isInspection ? localTab : sheetTab;
  const handleTabChange = (e, newValue) =>
    isInspection ? setLocalTab(newValue) : setSheetTab(newValue);

  // Store Hooks (Default)
  const storeCharacter = useCharacterStore((state) => state.character);
  const storeUpdateAttribute = useCharacterStore(
    (state) => state.updateAttribute,
  );
  const storeUpdateListItem = useCharacterStore(
    (state) => state.updateListItem,
  );
  const storeAddItemToList = useCharacterStore((state) => state.addItemToList);
  const storeRemoveItemFromList = useCharacterStore(
    (state) => state.removeItemFromList,
  );
  const storeUpdateCharacter = useCharacterStore((s) => s.updateCharacter);

  // Resolve Character & Actions (Prop vs Store)
  const character = propCharacter || storeCharacter;
  const updateAttribute = propActions?.updateAttribute || storeUpdateAttribute;
  const updateListItem = propActions?.updateListItem || storeUpdateListItem;
  const addItemToList = propActions?.addItemToList || storeAddItemToList;
  const removeItemFromList =
    propActions?.removeItemFromList || storeRemoveItemFromList;

  const {user} = useAuth();
  const [autoSaveStatus, setAutoSaveStatus] = React.useState("idle"); // idle, saving, saved, error

  // Lógica de Auto-Save
  React.useEffect(() => {
    // Não salva se estiver inspecionando (propCharacter existe) ou se não tiver ID/User
    if (propCharacter || !character._id || !user) return;

    const timeoutId = setTimeout(async () => {
      try {
        setAutoSaveStatus("saving");
        // Usa APIService direto para não atualizar o store e evitar loops
        await APIService.saveCharacter(user.uid, character);
        setAutoSaveStatus("saved");

        // Volta para idle após 2 segundos
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Erro no auto-save:", error);
        setAutoSaveStatus("error");
      }
    }, 3000); // Espera 3 segundos após a última alteração

    return () => clearTimeout(timeoutId);
  }, [character, propCharacter, user]);

  const [retroMode, setRetroMode] = React.useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptData, setPromptData] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgLoading(true);
    try {
      const url = await APIService.uploadFile(file);
      updateAttribute("imagem_url", url);
      showNotification("Imagem enviada com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao enviar imagem.", "error");
    } finally {
      setImgLoading(false);
    }
  };

  const handleGeneratePrompt = () => {
    const weapons = (character.armas || []).map((w) => w.name).join(", ");
    const armor = (character.armaduras || []).map((a) => a.name).join(", ");
    const items = (character.itens || []).map((i) => i.name).join(", ");
    const loot = (character.espolios || []).map((e) => e.name).join(", ");
    const advantages = (character.vantagens || [])
      .map((v) => v.name)
      .join(", ");
    const complications = (character.complicacoes || [])
      .map((c) => c.name)
      .join(", ");
    const awakeningResources = (character.recursos_despertar || [])
      .map((r) => `${r.name} (Nv ${r.nivel})`)
      .join(", ");

    const data = {
      artStyle:
        "Solo Leveling Manhwa Style, Anime, High Fantasy, 8k, Detailed, Cinematic Lighting, Portrait Orientation (9:16)",
      characterDetails: `Name: ${character.nome || "Unknown Hunter"}, Rank: ${character.rank || "Novice"}, Archetype: ${character.arquetipo || "Hunter"}, Concept: ${character.conceito || "Adventurer"}, Guild: ${character.guilda || "None"}, Age: ${character.idade || "Unknown"}, Height: ${character.altura || "Unknown"}, Weight: ${character.peso || "Unknown"}, Hair: ${character.cabelos || "Unknown"}, Eyes: ${character.olhos || "Unknown"}, Skin: ${character.pele || "Unknown"}`,
      awakeningDetails: `Awakening Origin: ${character.despertar_origem || "Unknown"}, Sensation: ${character.despertar_sensacao || "Unknown"}, Mana Affinity: ${character.despertar_afinidade || "Blue"}, Mark: ${character.despertar_marca || "None"}, Unique Power: ${awakeningResources || "None"}`,
      equipmentDetails: `Weapons: ${weapons || "None"}, Armor: ${armor || "Standard Hunter Gear"}, Items: ${items || "None"}, Loot/Artifacts: ${loot || "None"}`,
      traits: `Advantages: ${advantages || "None"}, Complications: ${complications || "None"}`,
      visualContext: `The character is standing in a dynamic pose, ready for battle, surrounded by magical energy reflecting their Mana Affinity (${character.despertar_afinidade || "Blue"}). Their Awakening Mark (${character.despertar_marca || "None"}) is visible. IMPORTANT: Ensure the full character and all weapons are fully visible within the vertical frame, avoiding cropping on the sides.`,
      negativePrompt:
        "No text, no watermarks, no signatures, no seals, no writing, no UI elements. Clean artwork only. No cropped weapons.",
    };

    setPromptData(data);
    setPromptModalOpen(true);
  };

  const handlePromptDataChange = (field, value) => {
    setPromptData((prev) => ({...prev, [field]: value}));
  };

  const copyToClipboard = () => {
    if (!promptData) return;

    const finalPrompt = `Art Style: ${promptData.artStyle}.
Character: ${promptData.characterDetails}.
Awakening: ${promptData.awakeningDetails}.
Equipment: ${promptData.equipmentDetails}.
Traits: ${promptData.traits}.
Visuals: ${promptData.visualContext}.
Negative Prompt: ${promptData.negativePrompt}.
`.replace(/\n/g, " ");

    navigator.clipboard.writeText(finalPrompt);
    showNotification("Prompt copiado para a área de transferência!", "success");
    setPromptModalOpen(false);
  };

  // Mana Logic
  const maxMana = useMemo(() => calculateMaxMana(character), [character]);
  const currentMana =
    character.mana_atual !== undefined ? character.mana_atual : maxMana;

  const handleUpdateMana = (newValue) => {
    updateAttribute("mana_atual", Math.min(newValue, maxMana)); // Cap at max? Or allow overflow? Usually cap.
  };

  const handleCastSpell = (spell) => {
    const cost = parseInt(spell.pp, 10) || 0;
    if (cost > 0) {
      if (currentMana < cost) {
        showNotification(
          `Mana insuficiente! Necessário: ${cost} PP`,
          "warning",
        );
        return;
      }
      const newValue = currentMana - cost;
      updateAttribute("mana_atual", newValue);
      showNotification(`Magia usada! -${cost} Mana`, "info");
    }
  };

  // Redirecionar para Visualizar após salvar
  React.useEffect(() => {
    if (saveSuccess && !isInspection) {
      setSheetTab(0);
    }
  }, [saveSuccess, isInspection, setSheetTab]);

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

  return (
    <Box>
      {/* Tabs - Nova ordem */}
      <TabsPaper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
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
                🌀
                <Box
                  component="span"
                  sx={{display: {xs: "none", sm: "inline"}}}
                >
                  Despertar
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
                  Magias
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
          <Box
            sx={{
              display: "flex",
              flexDirection: {xs: "column", sm: "row"},
              justifyContent: "space-between",
              alignItems: {xs: "flex-start", sm: "center"},
              gap: 2,
              mb: 3,
              pb: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Box>
              <Grid container spacing={2}>
                {/* Coluna Esquerda: Dados Atuais */}
                <Grid item xs={12} md={8}>
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
                        <span style={{marginRight: "12px"}}>
                          XP: {character.xp}
                        </span>
                      )}
                      {character.riqueza !== undefined && (
                        <span>Riqueza: ${character.riqueza}</span>
                      )}
                    </div>
                  )}
                </Grid>

                {/* Coluna Direita: Espaço para Mana */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: {xs: "flex-start", md: "flex-end"},
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Widget de Mana */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: "20px",
                        background: "rgba(33, 150, 243, 0.1)",
                        color: "#1565c0",
                        border: "1px solid rgba(33, 150, 243, 0.3)",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                      }}
                    >
                      <AiIcon fontSize="small" />
                      {currentMana}/{maxMana}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Status do Auto-Save */}
            {!propCharacter && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  position: "absolute",
                  top: 16,
                  right: 16,
                }}
              >
                {autoSaveStatus === "saving" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#666",
                      fontSize: "0.8rem",
                    }}
                  >
                    <CloudUpload sx={{fontSize: 16, mr: 0.5}} /> Salvando...
                  </Box>
                )}
                {autoSaveStatus === "saved" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#4caf50",
                      fontSize: "0.8rem",
                    }}
                  >
                    <CheckCircle sx={{fontSize: 16, mr: 0.5}} /> Salvo
                  </Box>
                )}
                {autoSaveStatus === "error" && (
                  <Tooltip title="Falha ao salvar automaticamente. Verifique sua conexão.">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#f44336",
                        fontSize: "0.8rem",
                        cursor: "help",
                      }}
                    >
                      <ErrorIcon sx={{fontSize: 16, mr: 0.5}} /> Erro ao salvar
                    </Box>
                  </Tooltip>
                )}
              </Box>
            )}

            {/* <FormControlLabel
              sx={{"@media print": {display: "none"}}}
              control={
                <Switch
                  checked={retroMode}
                  onChange={(e) => setRetroMode(e.target.checked)}
                  color="default"
                />
              }
              label={retroMode ? "📜 Pergaminho" : "🎨 Moderno"}
            /> */}
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
                  referrerPolicy="no-referrer"
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
              <GridCard
                title="Atributos"
                color="#2196f3"
                bg="#e3f2fd"
                retro={retroMode}
              >
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
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: retroMode ? "#5d4037" : "#666",
                        }}
                      >
                        {a.l}
                      </div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: retroMode ? "#3e2723" : "#2196f3",
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
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Progresso
                  </h4>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      fontSize: "0.9rem",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: retroMode ? "#5d4037" : "#666",
                          marginBottom: "2px",
                        }}
                      >
                        XP
                      </div>
                      <strong
                        style={{color: retroMode ? "#3e2723" : "#667eea"}}
                      >
                        {character.xp || 0}
                      </strong>
                    </Box>
                    <Box>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: retroMode ? "#5d4037" : "#666",
                          marginBottom: "2px",
                        }}
                      >
                        Riqueza ($)
                      </div>
                      <strong
                        style={{color: retroMode ? "#3e2723" : "#667eea"}}
                      >
                        ${character.riqueza || 0}
                      </strong>
                    </Box>
                    <Box>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: retroMode ? "#5d4037" : "#666",
                          marginBottom: "2px",
                        }}
                      >
                        Bênçãos
                      </div>
                      <strong
                        style={{color: retroMode ? "#3e2723" : "#667eea"}}
                      >
                        {character.bencaos ?? 3}
                      </strong>
                    </Box>
                  </Box>
                </Box>
              </GridCard>
            </Box>

            {/* 3. COMBATE (Col 3, Row 1) */}
            <Box sx={{gridColumn: {md: "3"}, gridRow: {md: "1"}}}>
              <GridCard
                title="Combate"
                color="#ef5350"
                bg="#ffebee"
                retro={retroMode}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    textAlign: "center",
                    gap: 1,
                  }}
                >
                  <Box>
                    <div style={{fontSize: "0.8rem"}}>Aparar</div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: retroMode ? "#3e2723" : "#d32f2f",
                      }}
                    >
                      {parryBase +
                        (character.aparar_bonus || 0) +
                        armorParryBonus}
                    </div>
                  </Box>
                  <Box>
                    <div style={{fontSize: "0.8rem"}}>Resist.</div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: retroMode ? "#3e2723" : "#d32f2f",
                      }}
                    >
                      {toughnessBase +
                        (character.armadura_bonus || 0) +
                        armorDefenseBonus}
                    </div>
                  </Box>
                  <Box>
                    <div style={{fontSize: "0.8rem"}}>Mov.</div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: retroMode ? "#3e2723" : "#d32f2f",
                      }}
                    >
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
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: retroMode ? "#3e2723" : "#d97706",
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
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: retroMode ? "#3e2723" : "#dc2626",
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
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: retroMode ? "#3e2723" : "#7f1d1d",
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
              <GridCard
                title="Perícias"
                color="#3f51b5"
                bg="#e8eaf6"
                retro={retroMode}
              >
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
                        fontSize: "0.9rem",
                        p: 0.5,
                        background: retroMode
                          ? "transparent"
                          : "rgba(255,255,255,0.5)",
                        borderRadius: 1,
                      }}
                    >
                      <span>{s.name}</span>
                      <strong
                        style={{color: retroMode ? "#3e2723" : "#3f51b5"}}
                      >
                        {s.die}
                      </strong>
                    </Box>
                  ))}
                  {(!character.pericias || character.pericias.length === 0) && (
                    <span style={{fontSize: "0.9rem"}}>Nenhuma</span>
                  )}
                </Box>
              </GridCard>
            </Box>

            {/* 6. ARMAS (Col 2, Row 2) */}
            <Box sx={{gridColumn: {md: "2"}, gridRow: {md: "2"}}}>
              <GridCard
                title="Armas"
                color="#e53e3e"
                bg="#fff5f5"
                retro={retroMode}
              >
                {(character.armas || []).map((w, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.9rem",
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
              <GridCard
                title="Armaduras"
                color="#48bb78"
                bg="#f0fff4"
                retro={retroMode}
              >
                {(character.armaduras || []).map((a, i) => (
                  <div key={i} style={{fontSize: "0.9rem"}}>
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
              <GridCard
                title="Vantagens"
                color="#667eea"
                bg="#f0fff4"
                retro={retroMode}
                sx={{height: "auto"}}
              >
                <Box sx={{display: "flex", flexDirection: "column", gap: 0.5}}>
                  {(character.vantagens || []).map((v, i) => (
                    <div key={i} style={{fontSize: "0.9rem"}}>
                      • {v.name}
                    </div>
                  ))}
                </Box>
              </GridCard>
              <GridCard
                title="Complicações"
                color="#ff9800"
                bg="#fffbf0"
                retro={retroMode}
                sx={{height: "auto"}}
              >
                {(character.complicacoes || []).map((c, i) => (
                  <div key={i} style={{fontSize: "0.9rem"}}>
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
                retro={retroMode}
              >
                {(character.recursos_despertar || []).map((res, idx) => (
                  <Box
                    key={idx}
                    sx={{mb: 1.5, pb: 1, borderBottom: "1px dashed #ccc"}}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        color: retroMode ? "#3e2723" : "#6a1b9a",
                      }}
                    >
                      {res.name} (Nv {res.nivel})
                    </div>
                    <div style={{fontSize: "0.9rem"}}>PP: {res.custo}</div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: retroMode ? "#5d4037" : "#555",
                        marginTop: 2,
                      }}
                    >
                      {res.descricao}
                    </div>
                    {res.limitacao && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: retroMode ? "#3e2723" : "#d32f2f",
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
              <GridCard
                title="Itens"
                color="#607d8b"
                bg="#eceff1"
                retro={retroMode}
                sx={{height: "auto"}}
              >
                {(character.itens || []).map((item, i) => (
                  <div key={i} style={{fontSize: "0.9rem"}}>
                    {item.name}
                  </div>
                ))}
              </GridCard>
              <GridCard
                title="Espólios"
                color="#009688"
                bg="#e0f2f1"
                retro={retroMode}
                sx={{height: "auto"}}
              >
                {(character.espolios || []).map((item, i) => (
                  <div key={i} style={{fontSize: "0.9rem"}}>
                    {item.name}
                  </div>
                ))}
              </GridCard>
            </Box>

            {/* 14. NOTAS (Col 1, Row 5) */}
            <Box sx={{gridColumn: {md: "1"}, gridRow: {md: "5"}}}>
              <GridCard
                title="Notas"
                color="#ffd700"
                bg="#fffde7"
                retro={retroMode}
              >
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    border: "none",
                    background: "transparent",
                    resize: "vertical",
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
              <GridCard
                title="Magias"
                color="#7e57c2"
                bg="#f3e5f5"
                retro={retroMode}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {(character.magias || []).map((m, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        p: 0.5,
                        background: retroMode
                          ? "transparent"
                          : "rgba(255,255,255,0.5)",
                        borderRadius: 1,
                        borderBottom: retroMode
                          ? "1px dashed rgba(93, 64, 55, 0.2)"
                          : "none",
                      }}
                    >
                      <Box sx={{flex: 1, mr: 1}}>
                        <div style={{fontWeight: "bold"}}>
                          {m.name}{" "}
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "normal",
                              opacity: 0.8,
                            }}
                          >
                            ({m.pp} PP)
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: retroMode ? "#5d4037" : "#555",
                          }}
                        >
                          {m.range} {m.duration && `• ${m.duration}`}
                        </div>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color={
                          currentMana >= (parseInt(m.pp) || 0)
                            ? "primary"
                            : "error"
                        }
                        disabled={currentMana < (parseInt(m.pp) || 0)}
                        sx={{
                          fontSize: "0.75rem",
                          py: 0.5,
                          minWidth: "60px",
                        }}
                        onClick={() => handleCastSpell(m)}
                      >
                        Usar
                      </Button>
                    </Box>
                  ))}
                  {(!character.magias || character.magias.length === 0) && (
                    <span style={{fontSize: "0.9rem"}}>Nenhuma magia</span>
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
          <Stack spacing={3}>
            {/* Seção 1: Dados Principais */}
            <Box>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{borderBottom: "1px solid #eee", pb: 1, mb: 2}}
              >
                Dados Principais
              </Typography>
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

                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    fullWidth
                    label="Conceito"
                    value={character.conceito || ""}
                    onChange={(e) =>
                      updateAttribute("conceito", e.target.value)
                    }
                    placeholder="Ex: Guerreiro prudente"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Arquétipo</InputLabel>
                    <StyledSelect
                      value={character.arquetipo || ""}
                      label="Arquétipo"
                      onChange={(e) =>
                        updateAttribute("arquetipo", e.target.value)
                      }
                    >
                      <MenuItem value="">Selecione...</MenuItem>
                      <MenuItem value="Assaulter">⚡ Assaulter</MenuItem>
                      <MenuItem value="Tank">🛡️ Tank</MenuItem>
                      <MenuItem value="Healer">✨ Healer</MenuItem>
                      <MenuItem value="Caster">🔮 Caster</MenuItem>
                    </StyledSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    fullWidth
                    label="Guilda"
                    value={character.guilda || ""}
                    onChange={(e) => updateAttribute("guilda", e.target.value)}
                    placeholder="Ex: Hunter's Association"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
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

                <Grid item xs={6} sm={4}>
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

                <Grid item xs={6} sm={4}>
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
              </Grid>
            </Box>

            {/* Características Físicas */}
            <Box>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{borderBottom: "1px solid #eee", pb: 1, mb: 2}}
              >
                Aparência Física
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Idade"
                    value={character.idade || ""}
                    onChange={(e) => updateAttribute("idade", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Altura"
                    value={character.altura || ""}
                    onChange={(e) => updateAttribute("altura", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Peso"
                    value={character.peso || ""}
                    onChange={(e) => updateAttribute("peso", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Cabelos"
                    value={character.cabelos || ""}
                    onChange={(e) => updateAttribute("cabelos", e.target.value)}
                    size="small"
                    placeholder="Curto / Castanho"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Olhos"
                    value={character.olhos || ""}
                    onChange={(e) => updateAttribute("olhos", e.target.value)}
                    size="small"
                    placeholder="Brilhantes"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Pele"
                    value={character.pele || ""}
                    onChange={(e) => updateAttribute("pele", e.target.value)}
                    size="small"
                    placeholder="Negra / Parda / Outras"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Atributos */}
            <Box>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{borderBottom: "1px solid #eee", pb: 1, mb: 2}}
              >
                Atributos Base
              </Typography>
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
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: {xs: "column", md: "row"},
                gap: 4,
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              {/* Descrição */}
              <Box sx={{flex: 2, width: "100%"}}>
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{
                    borderBottom: "1px solid #eee",
                    pb: 1,
                    mb: 2,
                  }}
                >
                  Histórico & Personalidade
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Descrição & Histórico"
                      value={character.descricao || ""}
                      onChange={(e) =>
                        updateAttribute("descricao", e.target.value)
                      }
                      placeholder="Descreva a personalidade e um breve histórico do personagem..."
                      multiline
                      rows={9}
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* Imagem */}
              <Box sx={{flex: 1, width: "100%"}}>
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{borderBottom: "1px solid #eee", pb: 1, mb: 2, gap: 2}}
                >
                  Retrato do Personagem
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    border: "1px dashed #ccc",
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#f9f9f9",
                    display: "flex",
                    flexDirection: {xs: "column", sm: "row"},
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {character.imagem_url && (
                    <Box
                      sx={{mb: 2, display: "flex", justifyContent: "center"}}
                    >
                      <img
                        src={character.imagem_url}
                        alt="Personagem"
                        style={{
                          maxHeight: 200,
                          borderRadius: 8,
                          maxWidth: "100%",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Box>
                  )}

                  <Box
                    className="flex flex-col"
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={
                        imgLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CloudUpload />
                        )
                      }
                      disabled={imgLoading}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      Upload
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AiIcon />}
                      onClick={handleGeneratePrompt}
                      sx={{
                        background:
                          "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                        color: "white",
                      }}
                    >
                      Prompt
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>
      )}

      {/* TAB 2: DESPERTAR */}
      {tabValue === 2 && <AwakeningSection />}

      {/* TAB 3: COMBATE */}
      {tabValue === 3 && (
        <CombatList character={character} updateAttribute={updateAttribute} />
      )}

      {/* TAB 4: PERÍCIAS */}
      {tabValue === 4 && (
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
                  attributeShort: attrKey
                    ? attrKey.substring(0, 3).toUpperCase()
                    : "",
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

      {/* TAB 5: VANTAGENS & COMPLICAÇÕES (lado a lado) */}
      {tabValue === 5 && (
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
                  availableOptions={availableEdges}
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

      {/* TAB 6: EQUIPAMENTOS (2x2 Grid) */}
      {tabValue === 6 && (
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

      {/* TAB 7: PODERES (Magias + Recursos Despertar) */}
      {tabValue === 7 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
          <Grid container spacing={2}>
            {/* MAGIAS - Coluna esquerda */}
            <Grid item xs={12}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                🔮 Magias
              </h3>
              <MagiasList
                items={character.magias || []}
                onAdd={(item) => addItemToList("magias", item)}
                availableOptions={availablePowers}
                onRemove={(idx) => removeItemFromList("magias", idx)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 8: NOTAS */}
      {tabValue === 8 && (
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
              minHeight: "600px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              resize: "vertical",
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

      {/* Modal de Prompt IA */}
      <Dialog
        open={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Gerador de Prompt para IA</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Ajuste os detalhes abaixo para refinar a imagem que será gerada.
            Depois, copie o prompt final.
          </Typography>
          {promptData && (
            <Stack spacing={2} sx={{mt: 2}}>
              <TextField
                label="Estilo de Arte & Formato"
                value={promptData.artStyle}
                onChange={(e) =>
                  handlePromptDataChange("artStyle", e.target.value)
                }
                multiline
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Identidade do Personagem"
                value={promptData.characterDetails}
                onChange={(e) =>
                  handlePromptDataChange("characterDetails", e.target.value)
                }
                multiline
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Despertar & Poderes"
                value={promptData.awakeningDetails}
                onChange={(e) =>
                  handlePromptDataChange("awakeningDetails", e.target.value)
                }
                multiline
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Equipamentos & Inventário"
                value={promptData.equipmentDetails}
                onChange={(e) =>
                  handlePromptDataChange("equipmentDetails", e.target.value)
                }
                multiline
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Contexto Visual & Pose"
                value={promptData.visualContext}
                onChange={(e) =>
                  handlePromptDataChange("visualContext", e.target.value)
                }
                multiline
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Prompt Negativo (O que evitar)"
                value={promptData.negativePrompt}
                onChange={(e) =>
                  handlePromptDataChange("negativePrompt", e.target.value)
                }
                multiline
                fullWidth
                variant="outlined"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromptModalOpen(false)}>Fechar</Button>
          <Button
            onClick={copyToClipboard}
            variant="contained"
            startIcon={<CopyIcon />}
          >
            Copiar Prompt Final
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SheetView;
