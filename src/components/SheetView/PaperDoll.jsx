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
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Checkroom as ChestIcon,
  Gavel as WeaponIcon,
  Shield as ShieldIcon,
  Psychology as HeadIcon,
  Snowshoeing as FeetIcon,
  Person as PersonIcon,
  AddCircleOutline as AddIcon,
  AllInclusive as NecklaceIcon,
  Toll as RingIcon,
  Waves as CapeIcon,
  LineWeight as BeltIcon,
  DirectionsWalk as PantsIcon,
} from "@mui/icons-material";

const SLOTS = [
  // Lado Esquerdo (Focado no Corpo)
  {
    id: "head",
    label: "Cabeça",
    icon: HeadIcon,
    align: "left",
    allowedTypes: ["armadura", "item"],
  },
  {
    id: "necklace",
    label: "Colar",
    icon: NecklaceIcon,
    align: "left",
    allowedTypes: ["item", "espolio"],
  },
  {
    id: "chest",
    label: "Tronco",
    icon: ChestIcon,
    align: "left",
    allowedTypes: ["armadura"],
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
    id: "ring1",
    label: "Anel 1",
    icon: RingIcon,
    align: "left",
    allowedTypes: ["item", "espolio"],
  },

  // Lado Direito (Focado em Equipamentos de Mão e Extremidades)
  {
    id: "cape",
    label: "Capa",
    icon: CapeIcon,
    align: "right",
    allowedTypes: ["item"],
  },
  {
    id: "mainHand",
    label: "Mão Principal",
    icon: WeaponIcon,
    align: "right",
    allowedTypes: ["arma"],
  },
  {
    id: "offHand",
    label: "Mão Secundária",
    icon: ShieldIcon,
    align: "right",
    allowedTypes: ["armadura", "item", "arma"],
  },
  {
    id: "ring2",
    label: "Anel 2",
    icon: RingIcon,
    align: "right",
    allowedTypes: ["item", "espolio"],
  },
  {
    id: "feet",
    label: "Pés",
    icon: FeetIcon,
    align: "right",
    allowedTypes: ["armadura", "item"],
  },
];

function PaperDoll({character, updateAttribute, isFieldLocked}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);

  // Recupera os itens equipados atualmente (ou inicializa um objeto vazio)
  const equipped = character.equipados || {};

  const handleOpenMenu = (event, slotId) => {
    if (isFieldLocked("equipados")) return;
    setAnchorEl(event.currentTarget);
    setActiveSlot(slotId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveSlot(null);
  };

  const handleEquipItem = (item) => {
    if (activeSlot) {
      updateAttribute("equipados", {
        ...equipped,
        [activeSlot]: item,
      });
    }
    handleCloseMenu();
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

  const renderSlot = (slot) => {
    const item = equipped[slot.id];
    const Icon = slot.icon;
    const isLeft = slot.align === "left";

    return (
      <Box
        key={slot.id}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexDirection: isLeft ? "row" : "row-reverse",
          width: "100%",
        }}
      >
        {/* Textos do Slot */}
        <Box sx={{textAlign: isLeft ? "right" : "left", flex: 1}}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
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
              color: item ? "#0f172a" : "#94a3b8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 120,
            }}
          >
            {item ? item.name : "Vazio"}
          </Typography>
          {item && (
            <Typography
              variant="caption"
              sx={{
                color: "error.main",
                cursor: "pointer",
                "&:hover": {textDecoration: "underline"},
              }}
              onClick={(e) => handleUnequip(e, slot.id)}
            >
              Remover
            </Typography>
          )}
        </Box>

        {/* Caixa do Ícone (Clicável) */}
        <Paper
          onClick={(e) => handleOpenMenu(e, slot.id)}
          elevation={item ? 3 : 0}
          sx={{
            width: 64,
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: isFieldLocked("equipados") ? "not-allowed" : "pointer",
            borderRadius: 2,
            bgcolor: item ? "#e0f2fe" : "#f8fafc",
            border: item ? "2px solid #3b82f6" : "2px dashed #cbd5e1",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#667eea",
              bgcolor: item ? "#bae6fd" : "#f1f5f9",
            },
          }}
        >
          <Icon sx={{color: item ? "#2563eb" : "#94a3b8", fontSize: 32}} />
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{p: 2, pb: 6, position: "relative"}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: {xs: 2, md: 6},
          flexDirection: {xs: "column", sm: "row"},
        }}
      >
        {/* Coluna Esquerda */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {leftSlots.map(renderSlot)}
        </Box>

        {/* Centro: O Boneco / Retrato */}
        <Box
          sx={{
            width: {xs: 160, md: 260},
            height: {xs: 320, md: 460},
            borderRadius: 3,
            border: "4px solid #e2e8f0",
            bgcolor: "#f1f5f9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{fontSize: 120, color: "#cbd5e1"}} />

          {/* Overlay Escuro Inferior para Estilo */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            }}
          />
        </Box>

        {/* Coluna Direita */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {rightSlots.map(renderSlot)}
        </Box>
      </Box>

      {/* Menu de Seleção de Itens */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{sx: {width: 250, maxHeight: 300}}}
      >
        {(() => {
          const activeSlotConfig = SLOTS.find((s) => s.id === activeSlot);
          const filteredItems = activeSlotConfig
            ? availableItems.filter((item) =>
                activeSlotConfig.allowedTypes.includes(item.listType),
              )
            : [];
          return (
            <>
              <MenuItem disabled>
                Escolha para {activeSlotConfig?.label}:
              </MenuItem>
              {filteredItems.length === 0 && (
                <MenuItem disabled>Nenhum item compatível na mochila.</MenuItem>
              )}
              {filteredItems.map((item, idx) => (
                <MenuItem
                  key={`${item.name}-${idx}`}
                  onClick={() => handleEquipItem(item)}
                >
                  <ListItemIcon>
                    <AddIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      item.damage
                        ? `Dano: ${item.damage}`
                        : item.defense
                          ? `Def: +${item.defense}`
                          : `Mochila (${item.listType})`
                    }
                  />
                </MenuItem>
              ))}
            </>
          );
        })()}
      </Menu>
    </Box>
  );
}

export default PaperDoll;
