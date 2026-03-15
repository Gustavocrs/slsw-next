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
  Snowshoeing as FeetIcon,
  PanTool as PanToolIcon,
  Person as PersonIcon,
  AddCircleOutline as AddIcon,
  AllInclusive as NecklaceIcon,
  Toll as RingIcon,
  Waves as CapeIcon,
  LineWeight as BeltIcon,
  DirectionsWalk as PantsIcon,
} from "@mui/icons-material";

const SLOTS = [
  // Corpo (Lado Esquerdo)
  {
    id: "head",
    label: "Cabeça",
    icon: HeadIcon,
    align: "left",
    allowedTypes: ["armadura", "item"],
  },
  {
    id: "chest",
    label: "Tronco",
    icon: ChestIcon,
    align: "left",
    allowedTypes: ["armadura"],
  },
  {
    id: "hands",
    label: "Luvas",
    icon: PanToolIcon,
    align: "left",
    allowedTypes: ["armadura", "item"],
  },
  {
    id: "belt",
    label: "Cinto",
    icon: BeltIcon,
    align: "left",
    allowedTypes: ["armadura", "item"],
  },
  {
    id: "pants",
    label: "Calça",
    icon: PantsIcon,
    align: "left",
    allowedTypes: ["armadura", "item"],
  },
  {
    id: "feet",
    label: "Botas",
    icon: FeetIcon,
    align: "left",
    allowedTypes: ["armadura", "item"],
  },

  // Acessórios e Armas (Lado Direito)
  {
    id: "cape",
    label: "Capa",
    icon: CapeIcon,
    align: "right",
    allowedTypes: ["item"],
  },
  {
    id: "necklace",
    label: "Amuleto",
    icon: NecklaceIcon,
    align: "right",
    allowedTypes: ["item", "espolio"],
  },
  {
    id: "ring1",
    label: "Anel 1",
    icon: RingIcon,
    align: "right",
    allowedTypes: ["item", "espolio"],
  },
  {
    id: "ring2",
    label: "Anel 2",
    icon: RingIcon,
    align: "right",
    allowedTypes: ["item", "espolio"],
  },
  {
    id: "mainHand",
    label: "Arma Principal",
    icon: WeaponIcon,
    align: "right",
    allowedTypes: ["arma"],
  },
  {
    id: "offHand",
    label: "Mão Secund.",
    icon: ShieldIcon,
    align: "right",
    allowedTypes: ["armadura", "item", "arma"],
  },
];

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

    if (activeSlot) {
      // Equipa no slot selecionado (se permitido)
      const slotConfig = SLOTS.find((s) => s.id === activeSlot);
      if (slotConfig?.allowedTypes.includes(item.listType)) {
        updateAttribute("equipados", {...equipped, [activeSlot]: item});
        setActiveSlot(null);
      }
    } else {
      // Auto-equipar: Procura o primeiro slot válido vazio (ou substitui o primeiro válido)
      const validSlots = SLOTS.filter((s) =>
        s.allowedTypes.includes(item.listType),
      );
      if (validSlots.length > 0) {
        const emptySlot = validSlots.find((s) => !equipped[s.id]);
        const target = emptySlot ? emptySlot.id : validSlots[0].id;
        updateAttribute("equipados", {...equipped, [target]: item});
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

  const renderSlot = (slot) => {
    const item = equipped[slot.id];
    const Icon = slot.icon;
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
        <Box sx={{textAlign: isLeft ? "right" : "left", flex: 1}}>
          <Typography
            variant="caption"
            sx={{
              color: isActive ? "#fbbf24" : "#94a3b8",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {slot.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color: item ? "#f8fafc" : "#475569",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: {xs: 80, sm: 120},
            }}
          >
            {item ? item.name : "Vazio"}
          </Typography>
          {item && (
            <Typography
              variant="caption"
              sx={{
                color: "#ef4444",
                cursor: "pointer",
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
          elevation={isActive ? 6 : item ? 3 : 0}
          sx={{
            width: 56,
            height: 56,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: isFieldLocked("equipados") ? "not-allowed" : "pointer",
            borderRadius: 2,
            bgcolor: isActive
              ? "rgba(251, 191, 36, 0.15)"
              : item
                ? "rgba(30, 41, 59, 0.9)"
                : "rgba(15, 23, 42, 0.6)",
            border: isActive
              ? "2px solid #fbbf24"
              : item
                ? "2px solid #475569"
                : "2px dashed #334155",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: isActive ? "#f59e0b" : "#64748b",
              bgcolor: isActive
                ? "rgba(251, 191, 36, 0.25)"
                : item
                  ? "rgba(51, 65, 85, 0.9)"
                  : "rgba(30, 41, 59, 0.8)",
            },
          }}
        >
          <Icon
            sx={{
              color: isActive ? "#fbbf24" : item ? "#cbd5e1" : "#334155",
              fontSize: 28,
            }}
          />
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        p: {xs: 2, md: 4},
        borderRadius: 3,
        bgcolor: "#0f172a",
        color: "#f8fafc",
        boxShadow:
          "inset 0 0 100px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)",
        position: "relative",
        minHeight: 600,
      }}
    >
      <Grid container spacing={4}>
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
                width: {xs: 160, md: 240},
                height: {xs: 320, md: 440},
                borderRadius: 3,
                border: "2px solid #334155",
                bgcolor: "#1e293b",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <PersonIcon
                sx={{fontSize: 140, color: "#334155", opacity: 0.5}}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top, rgba(15,23,42,1) 0%, transparent 100%)",
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
                p: 2.5,
                bgcolor: "rgba(30, 41, 59, 0.7)",
                border: "1px solid #334155",
                borderRadius: 2,
                color: "#f8fafc",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#94a3b8",
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
                    sx={{color: "#ef4444", fontWeight: "bold"}}
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
                    sx={{color: "#f87171", fontWeight: "bold"}}
                  >
                    🗡️ MÃO SECUNDÁRIA
                  </Typography>
                  <Typography variant="h6" sx={{fontWeight: 900}}>
                    {offDamage}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{borderColor: "#334155", my: 0.5}} />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{color: "#60a5fa", fontWeight: "bold"}}
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
                    sx={{color: "#93c5fd", fontWeight: "bold"}}
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
                p: 2.5,
                bgcolor: "rgba(30, 41, 59, 0.7)",
                border: "1px solid #334155",
                borderRadius: 2,
                color: "#f8fafc",
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
                    color: "#94a3b8",
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
                      color: "#fbbf24",
                      fontWeight: "bold",
                      bgcolor: "rgba(251, 191, 36, 0.1)",
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                  gap: 1.5,
                }}
              >
                {availableItems.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#475569",
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      py: 4,
                    }}
                  >
                    Sua mochila está vazia.
                  </Typography>
                )}
                {availableItems.map((item, idx) => {
                  const isAllowed =
                    !activeSlot ||
                    SLOTS.find(
                      (s) => s.id === activeSlot,
                    )?.allowedTypes.includes(item.listType);

                  return (
                    <Tooltip
                      key={`${item.name}-${idx}`}
                      title={
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{color: "#fbbf24"}}
                          >
                            {item.name}
                          </Typography>
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
                        elevation={isAllowed ? 4 : 0}
                        sx={{
                          aspectRatio: "1/1",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 1,
                          bgcolor: isAllowed
                            ? "#1e293b"
                            : "rgba(15, 23, 42, 0.4)",
                          border: "1px solid",
                          borderColor: isAllowed ? "#475569" : "#1e293b",
                          cursor:
                            isAllowed && !isFieldLocked("equipados")
                              ? "pointer"
                              : "not-allowed",
                          opacity: isAllowed ? 1 : 0.3,
                          transition: "all 0.2s",
                          "&:hover":
                            isAllowed && !isFieldLocked("equipados")
                              ? {
                                  borderColor: "#fbbf24",
                                  bgcolor: "#334155",
                                  transform: "scale(1.05)",
                                }
                              : {},
                        }}
                      >
                        {item.listType === "arma" ? (
                          <WeaponIcon sx={{color: "#fca5a5"}} />
                        ) : item.listType === "armadura" ? (
                          <ShieldIcon sx={{color: "#93c5fd"}} />
                        ) : item.listType === "espolio" ? (
                          <NecklaceIcon sx={{color: "#fde047"}} />
                        ) : (
                          <CapeIcon sx={{color: "#d8b4fe"}} />
                        )}
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "0.65rem",
                            color: "#e2e8f0",
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
