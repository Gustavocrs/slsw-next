/**
 * PaperDoll Component
 * Sistema visual de inventário com slots de equipamentos
 */

"use client";

import React, {useState} from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Checkroom as ChestIcon,
  Gavel as WeaponIcon,
  Shield as ShieldIcon,
  Psychology as HeadIcon,
  Snowshoeing as BootsIcon,
  PanTool as GlovesIcon,
  DirectionsWalk as PantsIcon,
  AccessibilityNew as MannequinIcon,
  Diamond as GemIcon,
  MenuBook as BookIcon,
  Science as PotionIcon,
  Map as MapIcon,
  VpnKey as KeyIcon,
  Highlight as TorchIcon,
  Healing as HealIcon,
  Hardware as ToolIcon,
  Backpack as BackpackIcon,
  Category as GenericIcon,
  AllInclusive as NecklaceIcon,
  Toll as RingIcon,
} from "@mui/icons-material";

// Função Inteligente de Ícones: Mapeia palavras-chave para ícones de RPG
const getIconForItem = (name, type) => {
  const lower = name?.toLowerCase() || "";

  // Armaduras e Vestimentas
  if (lower.includes("escudo") || lower.includes("broquel")) return ShieldIcon;
  if (
    lower.includes("elmo") ||
    lower.includes("capacete") ||
    lower.includes("chapéu") ||
    lower.includes("máscara") ||
    lower.includes("capuz") ||
    lower.includes("tiara")
  )
    return HeadIcon;
  if (
    lower.includes("armadura") ||
    lower.includes("colete") ||
    lower.includes("cota") ||
    lower.includes("peitoral") ||
    lower.includes("manto") ||
    lower.includes("capa") ||
    lower.includes("túnica")
  )
    return ChestIcon;
  if (
    lower.includes("bota") ||
    lower.includes("sapato") ||
    lower.includes("sandália") ||
    lower.includes("coturno")
  )
    return BootsIcon;
  if (
    lower.includes("luva") ||
    lower.includes("manopla") ||
    lower.includes("braçadeira")
  )
    return GlovesIcon;
  if (
    lower.includes("calça") ||
    lower.includes("perneira") ||
    lower.includes("greva") ||
    lower.includes("bermuda") ||
    lower.includes("saia")
  )
    return PantsIcon;

  // Itens Comuns de RPG
  if (
    lower.includes("poção") ||
    lower.includes("elixir") ||
    lower.includes("frasco") ||
    lower.includes("veneno") ||
    lower.includes("antídoto")
  )
    return PotionIcon;
  if (
    lower.includes("livro") ||
    lower.includes("grimório") ||
    lower.includes("pergaminho") ||
    lower.includes("tomo") ||
    lower.includes("diário")
  )
    return BookIcon;
  if (lower.includes("mapa") || lower.includes("carta")) return MapIcon;
  if (lower.includes("chave")) return KeyIcon;
  if (
    lower.includes("tocha") ||
    lower.includes("lanterna") ||
    lower.includes("lampião")
  )
    return TorchIcon;
  if (
    lower.includes("kit") ||
    lower.includes("curativo") ||
    lower.includes("médico") ||
    lower.includes("ervas")
  )
    return HealIcon;

  if (
    lower.includes("anel") ||
    lower.includes("aliança") ||
    lower.includes("cristal") ||
    lower.includes("essência") ||
    lower.includes("pedra")
  )
    return RingIcon;

  if (
    lower.includes("cordão") ||
    lower.includes("colar") ||
    lower.includes("amuleto") ||
    lower.includes("pingente")
  )
    return NecklaceIcon;

  // Armas Comuns
  if (
    lower.includes("machado") ||
    lower.includes("picareta") ||
    lower.includes("ferramenta") ||
    lower.includes("martelo") ||
    lower.includes("maça")
  )
    return ToolIcon;

  // Fallbacks baseados na origem do item (aba)
  if (type === "arma") return WeaponIcon;
  if (type === "armadura") return ChestIcon;
  if (type === "espolio") return GemIcon;
  if (type === "item") return BackpackIcon;

  return GenericIcon;
};

// Função para descobrir a categoria e o slot baseado no nome do item
const getItemCategory = (name, type) => {
  const lower = name?.toLowerCase() || "";

  if (lower.includes("escudo") || lower.includes("broquel")) return "shield";
  if (
    lower.includes("elmo") ||
    lower.includes("capacete") ||
    lower.includes("chapéu") ||
    lower.includes("máscara") ||
    lower.includes("capuz") ||
    lower.includes("tiara")
  )
    return "head";
  if (
    lower.includes("armadura") ||
    lower.includes("colete") ||
    lower.includes("cota") ||
    lower.includes("peitoral") ||
    lower.includes("manto") ||
    lower.includes("capa") ||
    lower.includes("túnica")
  )
    return "chest";
  if (
    lower.includes("bota") ||
    lower.includes("sapato") ||
    lower.includes("sandália") ||
    lower.includes("coturno")
  )
    return "feet";
  if (
    lower.includes("calça") ||
    lower.includes("perneira") ||
    lower.includes("greva") ||
    lower.includes("bermuda") ||
    lower.includes("saia")
  )
    return "pants";

  if (
    lower.includes("cordão") ||
    lower.includes("colar") ||
    lower.includes("amuleto") ||
    lower.includes("pingente")
  )
    return "necklace";

  if (
    lower.includes("anel") ||
    lower.includes("aliança") ||
    lower.includes("joia") ||
    lower.includes("cristal") ||
    lower.includes("essência") ||
    lower.includes("pedra")
  )
    return "ring";

  if (
    lower.includes("tocha") ||
    lower.includes("lanterna") ||
    lower.includes("lampião") ||
    lower.includes("poção") ||
    lower.includes("elixir") ||
    lower.includes("frasco") ||
    lower.includes("veneno") ||
    lower.includes("antídoto") ||
    lower.includes("runa") ||
    lower.includes("kit")
  )
    return "offHandItem";

  if (type === "arma") {
    if (/\boh\b/i.test(name)) return "weapon";
    if (/\bth\b/i.test(name)) return "two-handed";

    if (
      lower.includes("arco") ||
      lower.includes("besta") ||
      lower.includes("cajado") ||
      lower.includes("montante") ||
      lower.includes("machado de batalha") ||
      lower.includes("lança longa") ||
      lower.includes("alabarda") ||
      lower.includes("duas mãos") ||
      lower.includes("fuzil") ||
      lower.includes("espingarda") ||
      lower.includes("escopeta")
    ) {
      return "two-handed";
    }
    return "weapon";
  }

  if (type === "armadura") return "chest";
  if (type === "espolio") return "ring";
  if (type === "item") return "offHandItem";

  return "offHandItem";
};

const getValidSlotsForCategory = (category) => {
  switch (category) {
    case "head":
      return ["head"];
    case "chest":
      return ["chest"];
    case "pants":
      return ["pants"];
    case "feet":
      return ["feet"];
    case "shield":
      return ["offHand"];
    case "two-handed":
      return ["mainHand"];
    case "weapon":
      return ["mainHand", "offHand"];
    case "necklace":
      return ["necklace"];
    case "ring":
      return ["ring1", "ring2"];
    case "offHandItem":
      return ["offHand"];
    default:
      return [
        "mainHand",
        "offHand",
        "head",
        "chest",
        "pants",
        "feet",
        "necklace",
        "ring1",
        "ring2",
      ];
  }
};

const SLOTS = [
  // Corpo & Vestimentas (Lado Esquerdo)
  {
    id: "head",
    label: "Cabeça",
    defaultIcon: HeadIcon,
    align: "left",
  },
  {
    id: "chest",
    label: "Tronco",
    defaultIcon: ChestIcon,
    align: "left",
  },
  {
    id: "pants",
    label: "Calça",
    defaultIcon: PantsIcon,
    align: "left",
  },
  {
    id: "feet",
    label: "Botas",
    defaultIcon: BootsIcon,
    align: "left",
  },

  // Combate & Equipamentos (Lado Direito)
  {
    id: "mainHand",
    label: "Arma Principal",
    defaultIcon: WeaponIcon,
    align: "right",
  },
  {
    id: "offHand",
    label: "Mão Secund.",
    defaultIcon: ShieldIcon,
    align: "right",
  },
  {
    id: "necklace",
    label: "Cordão",
    defaultIcon: NecklaceIcon,
    align: "right",
  },
  {
    id: "ring1",
    label: "Anel 1",
    defaultIcon: RingIcon,
    align: "right",
  },
  {
    id: "ring2",
    label: "Anel 2",
    defaultIcon: RingIcon,
    align: "right",
  },
];

// Componente do Manequim Segmentado Interativo
const SegmentedMannequin = ({equipped, isTwoHandedActive}) => {
  const getColor = (isEquipped, isAccessory = false) => {
    if (!isEquipped) return "#cbd5e1"; // Cor apagada
    return isAccessory ? "#fbbf24" : "#3b82f6"; // Dourado p/ Acessórios, Azul p/ Armaduras
  };

  const getOpacity = (isEquipped) => (isEquipped ? 1 : 0.2);
  const getFilter = (isEquipped) =>
    isEquipped ? "drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.6))" : "none";
  const getAccessoryFilter = (isEquipped) =>
    isEquipped ? "drop-shadow(0px 0px 8px rgba(251, 191, 36, 0.6))" : "none";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        viewBox="0 0 200 400"
        width="100%"
        height="100%"
        style={{overflow: "visible"}}
      >
        {/* CABEÇA */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.head)}
          opacity={getOpacity(equipped.head)}
          filter={getFilter(equipped.head)}
        >
          <circle cx="100" cy="50" r="30" />
        </g>

        {/* TRONCO */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.chest)}
          opacity={getOpacity(equipped.chest)}
          filter={getFilter(equipped.chest)}
        >
          <path d="M70,90 Q100,80 130,90 L120,200 Q100,210 80,200 Z" />
          {/* Braços incorporados ao Tronco */}
          <path d="M65,95 L30,170 L45,180 L75,110 Z" />
          <path d="M135,95 L170,170 L155,180 L125,110 Z" />
        </g>

        {/* MÃO SECUNDÁRIA (Apenas a mão esquerda) */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.offHand || isTwoHandedActive)}
          opacity={getOpacity(equipped.offHand || isTwoHandedActive)}
          filter={getFilter(equipped.offHand || isTwoHandedActive)}
        >
          <circle cx="37" cy="185" r="12" />
        </g>

        {/* MÃO PRINCIPAL (Apenas a mão direita) */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.mainHand)}
          opacity={getOpacity(equipped.mainHand)}
          filter={getFilter(equipped.mainHand)}
        >
          <circle cx="163" cy="185" r="12" />
        </g>

        {/* CALÇA */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.pants)}
          opacity={getOpacity(equipped.pants)}
          filter={getFilter(equipped.pants)}
        >
          <path d="M80,205 Q100,215 120,205 L115,310 L102,310 L100,240 L98,310 L85,310 Z" />
        </g>

        {/* PÉS */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.feet)}
          opacity={getOpacity(equipped.feet)}
          filter={getFilter(equipped.feet)}
        >
          <path d="M85,315 L100,315 L95,340 L80,340 Z" />
          <path d="M100,315 L115,315 L120,340 L105,340 Z" />
        </g>

        {/* CORDÃO */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill={getColor(equipped.necklace, true)}
          opacity={getOpacity(equipped.necklace)}
          filter={getAccessoryFilter(equipped.necklace)}
        >
          <path
            d="M 85 85 Q 100 110 115 85"
            fill="none"
            stroke={getColor(equipped.necklace, true)}
            strokeWidth="4"
          />
          <polygon points="100,105 105,115 100,120 95,115" />
        </g>

        {/* ANEL 1 (Mão Secundária - Esquerda da tela) */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill="none"
          stroke={getColor(equipped.ring1, true)}
          strokeWidth="3"
          opacity={getOpacity(equipped.ring1)}
          filter={getAccessoryFilter(equipped.ring1)}
        >
          <circle cx="37" cy="185" r="5" />
        </g>

        {/* ANEL 2 (Mão Principal - Direita da tela) */}
        <g
          style={{transition: "all 0.3s ease"}}
          fill="none"
          stroke={getColor(equipped.ring2, true)}
          strokeWidth="3"
          opacity={getOpacity(equipped.ring2)}
          filter={getAccessoryFilter(equipped.ring2)}
        >
          <circle cx="163" cy="185" r="5" />
        </g>
      </svg>
    </Box>
  );
};

function PaperDoll({character, updateAttribute, isFieldLocked}) {
  const [activeSlot, setActiveSlot] = useState(null);

  // Recupera os itens equipados atualmente (ou inicializa um objeto vazio)
  const equipped = character.equipados || {};

  const handleSlotClick = (slotId) => {
    if (isFieldLocked("equipados")) return;
    setActiveSlot((prev) => (prev === slotId ? null : slotId));
  };

  const handleBagItemClick = (item) => {
    if (isFieldLocked("equipados")) return;

    const category = getItemCategory(item.name, item.listType);
    const validSlots = getValidSlotsForCategory(category);

    if (activeSlot) {
      // Equipa no slot selecionado (se permitido)
      if (validSlots.includes(activeSlot)) {
        let newEquipped = {...equipped, [activeSlot]: item};
        if (activeSlot === "mainHand" && category === "two-handed")
          delete newEquipped.offHand;
        if (activeSlot === "offHand") {
          const mainCat = getItemCategory(
            newEquipped.mainHand?.name,
            newEquipped.mainHand?.listType,
          );
          if (mainCat === "two-handed") delete newEquipped.mainHand;
        }
        updateAttribute("equipados", newEquipped);
        setActiveSlot(null);
      }
    } else {
      // Auto-equipar: Procura o primeiro slot válido vazio (ou substitui o primeiro válido)
      let target = validSlots.find((s) => !equipped[s]);
      if (!target) target = validSlots[0];

      if (target) {
        let newEquipped = {...equipped, [target]: item};
        if (target === "mainHand" && category === "two-handed")
          delete newEquipped.offHand;
        if (target === "offHand") {
          const mainCat = getItemCategory(
            newEquipped.mainHand?.name,
            newEquipped.mainHand?.listType,
          );
          if (mainCat === "two-handed") delete newEquipped.mainHand;
        }
        updateAttribute("equipados", newEquipped);
      }
    }
  };

  const handleUnequip = (e, slotId) => {
    e.stopPropagation();
    if (isFieldLocked("equipados")) return;
    const newEquipped = {...equipped};
    delete newEquipped[slotId];
    updateAttribute("equipados", newEquipped);
  };

  // Reúne todos os itens das listas do personagem para exibir no menu
  const getAvailableItems = () => {
    const weapons = (character.armas || []).map((i) => ({
      ...i,
      listType: "arma",
    }));
    const armors = (character.armaduras || []).map((i) => ({
      ...i,
      listType: "armadura",
    }));
    const items = (character.itens || []).map((i) => ({
      ...i,
      listType: "item",
    }));
    const loot = (character.espolios || []).map((i) => ({
      ...i,
      listType: "espolio",
    }));

    const allItems = [...weapons, ...armors, ...items, ...loot];

    // Opcional: Filtrar os que já estão equipados para não aparecerem duplicados
    const equippedNames = Object.values(equipped)
      .filter(Boolean)
      .map((i) => i.name);

    return allItems.filter((i) => !equippedNames.includes(i.name));
  };

  const availableItems = getAvailableItems();
  const leftSlots = SLOTS.filter((s) => s.align === "left");
  const rightSlots = SLOTS.filter((s) => s.align === "right");

  // Cálculos do Painel de Status (Estilo ARPG)
  let totalDef = 0;
  let totalParry = 0;
  Object.values(equipped).forEach((i) => {
    if (i) {
      totalDef += parseInt(i.defense || i.def || 0, 10);
      totalParry += parseInt(i.parry || i.ap || 0, 10);
    }
  });
  const mainDamage = equipped.mainHand?.damage || "Desarmado";
  const offDamage =
    equipped.offHand?.listType === "arma" ? equipped.offHand.damage : "—";

  const mainHandCategory = getItemCategory(
    equipped.mainHand?.name,
    equipped.mainHand?.listType,
  );
  const isTwoHandedActive = mainHandCategory === "two-handed";

  const renderSlot = (slot) => {
    const isOccupiedByTwoHanded = slot.id === "offHand" && isTwoHandedActive;
    let item = equipped[slot.id];

    let displayName = item ? item.name : "Vazio";
    let Icon = item
      ? getIconForItem(item.name, item.listType)
      : slot.defaultIcon;
    let isItemActual = !!item;

    if (isOccupiedByTwoHanded) {
      displayName = "Ocupado (2 Mãos)";
      Icon = WeaponIcon;
      isItemActual = false;
    }

    const isLeft = slot.align === "left";
    const isActive = activeSlot === slot.id;

    return (
      <Box
        key={slot.id}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexDirection: isLeft ? "row" : "row-reverse",
          width: "100%",
        }}
      >
        {/* Textos do Slot */}
        <Box
          sx={{
            textAlign: isLeft ? "right" : "left",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isActive ? "primary.main" : "text.secondary",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.65rem",
            }}
          >
            {slot.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color:
                isItemActual || isOccupiedByTwoHanded
                  ? "text.primary"
                  : "text.disabled",
              fontSize: "0.75rem",
              lineHeight: 1.1,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {displayName}
          </Typography>
          {isItemActual && (
            <Typography
              variant="caption"
              sx={{
                color: "error.main",
                cursor: "pointer",
                fontSize: "0.65rem",
                "&:hover": {textDecoration: "underline"},
              }}
              onClick={(e) => handleUnequip(e, slot.id)}
            >
              Desequipar
            </Typography>
          )}
        </Box>

        {/* Caixa do Ícone (Clicável) */}
        <Paper
          onClick={() => handleSlotClick(slot.id)}
          elevation={isItemActual || isOccupiedByTwoHanded ? 3 : 0}
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: isFieldLocked("equipados") ? "not-allowed" : "pointer",
            borderRadius: 2,
            bgcolor: isActive
              ? "#e0f2fe"
              : isItemActual || isOccupiedByTwoHanded
                ? "#f8fafc"
                : "#f1f5f9",
            border: isActive
              ? "2px solid #3b82f6"
              : isItemActual || isOccupiedByTwoHanded
                ? "2px solid #cbd5e1"
                : "2px dashed #cbd5e1",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#667eea",
              bgcolor: isActive
                ? "#bae6fd"
                : isItemActual || isOccupiedByTwoHanded
                  ? "#f1f5f9"
                  : "#e2e8f0",
            },
          }}
        >
          <Icon
            sx={{
              color: isActive
                ? "#2563eb"
                : isItemActual || isOccupiedByTwoHanded
                  ? "#64748b"
                  : "#cbd5e1",
              fontSize: 24,
              opacity: isOccupiedByTwoHanded ? 0.3 : 1,
            }}
          />
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid container spacing={2}>
        {/* COLUNA ESQUERDA: O BONECO (PAPER DOLL) */}
        <Grid item xs={12} lg={7}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: {xs: 2, sm: 4},
              flexDirection: {xs: "column", sm: "row"},
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {leftSlots.map(renderSlot)}
            </Box>
            <Box
              sx={{
                width: {xs: 120, md: 200},
                height: {xs: 260, md: 400},
                borderRadius: 3,
                border: "2px solid #e2e8f0",
                bgcolor: "#f1f5f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <SegmentedMannequin
                equipped={equipped}
                isTwoHandedActive={isTwoHandedActive}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top, rgba(241,245,249,1) 0%, transparent 100%)",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                flex: 1,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              {rightSlots.map(renderSlot)}
            </Box>
          </Box>
        </Grid>

        {/* COLUNA DIREITA: STATUS & MOCHILA */}
        <Grid item xs={12} lg={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              height: "100%",
            }}
          >
            {/* Painel de Status */}
            <Paper
              sx={{
                p: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                color: "#0f172a",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  mb: 1.5,
                }}
              >
                Poder de Batalha (Equipado)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{color: "error.main", fontWeight: "bold"}}
                  >
                    ⚔️ DANO PRINCIPAL
                  </Typography>
                  <Typography variant="h6" sx={{fontWeight: 900}}>
                    {mainDamage}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{color: "error.main", fontWeight: "bold"}}
                  >
                    🗡️ MÃO SECUNDÁRIA
                  </Typography>
                  <Typography variant="h6" sx={{fontWeight: 900}}>
                    {offDamage}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{borderColor: "#e2e8f0", my: 0.5}} />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{color: "primary.main", fontWeight: "bold"}}
                  >
                    🛡️ ARMADURA TOTAL
                  </Typography>
                  <Typography variant="h6" sx={{fontWeight: 900}}>
                    +{totalDef}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{color: "info.main", fontWeight: "bold"}}
                  >
                    🛑 APARAR TOTAL
                  </Typography>
                  <Typography variant="h6" sx={{fontWeight: 900}}>
                    +{totalParry}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Painel da Mochila */}
            <Paper
              sx={{
                p: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                color: "#0f172a",
                flexGrow: 1,
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
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Mochila
                </Typography>
                {activeSlot && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: "bold",
                      bgcolor: "#e0f2fe",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    Selecione para:{" "}
                    {SLOTS.find((s) => s.id === activeSlot)?.label}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))",
                  gap: 1,
                }}
              >
                {availableItems.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      py: 4,
                    }}
                  >
                    Sua mochila está vazia.
                  </Typography>
                )}
                {availableItems.map((item, idx) => {
                  const category = getItemCategory(item.name, item.listType);
                  const validSlots = getValidSlotsForCategory(category);
                  const isAllowed =
                    !activeSlot || validSlots.includes(activeSlot);

                  return (
                    <Tooltip
                      key={`${item.name}-${idx}`}
                      title={
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {item.name}
                          </Typography>
                          {item.quantity && parseInt(item.quantity) > 1 && (
                            <Typography variant="caption" display="block">
                              Quantidade: {item.quantity}
                            </Typography>
                          )}
                          {item.damage && (
                            <Typography variant="caption" display="block">
                              Dano: {item.damage}
                            </Typography>
                          )}
                          {item.defense && (
                            <Typography variant="caption" display="block">
                              Defesa: +{item.defense}
                            </Typography>
                          )}
                          {item.parry && (
                            <Typography variant="caption" display="block">
                              Aparar: +{item.parry}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            color="gray"
                            sx={{mt: 1, display: "block"}}
                          >
                            Tipo: {item.listType.toUpperCase()}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="top"
                    >
                      <Paper
                        onClick={() => isAllowed && handleBagItemClick(item)}
                        elevation={isAllowed ? 2 : 0}
                        sx={{
                          aspectRatio: "1/1",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0.5,
                          bgcolor: isAllowed ? "#fff" : "#f1f5f9",
                          border: "1px solid",
                          borderColor: isAllowed ? "#cbd5e1" : "#e2e8f0",
                          cursor:
                            isAllowed && !isFieldLocked("equipados")
                              ? "pointer"
                              : "not-allowed",
                          opacity: isAllowed ? 1 : 0.4,
                          transition: "all 0.2s",
                          "&:hover":
                            isAllowed && !isFieldLocked("equipados")
                              ? {
                                  borderColor: "primary.main",
                                  bgcolor: "#f8fafc",
                                  transform: "scale(1.05)",
                                }
                              : {},
                        }}
                      >
                        {(() => {
                          const ItemIcon = getIconForItem(
                            item.name,
                            item.listType,
                          );
                          return (
                            <ItemIcon
                              sx={{
                                color: isAllowed
                                  ? "primary.main"
                                  : "text.disabled",
                                fontSize: 22,
                              }}
                            />
                          );
                        })()}
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "0.65rem",
                            color: isAllowed ? "text.primary" : "text.disabled",
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Paper>
                    </Tooltip>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PaperDoll;
