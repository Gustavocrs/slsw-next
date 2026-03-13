/**
 * SheetView Component
 * Visualização da ficha do personagem - Tabs com Identificação e Visualizar tipo SWADE
 */

"use client";

import {
  Add as AddIcon,
  AutoAwesome as AiIcon,
  AutoFixHigh as AwakeningIcon,
  VolunteerActivism as BlessingIcon,
  Person as CharacterIcon,
  CheckCircle,
  CloudUpload,
  ContentCopy as CopyIcon,
  LocalFireDepartment as BurnIcon,
  Security as DefenseIcon,
  Error as ErrorIcon,
  AcUnit as FrozenIcon,
  BatteryAlert as FatigueIcon,
  BadgeOutlined as IdentityIcon,
  Inventory2 as InventoryIcon,
  Notes as NotesIcon,
  Help as OtherStatusIcon,
  PanTool as ParalyzedIcon,
  ExpandMore as ExpandMoreIcon,
  Science as PoisonIcon,
  EmojiEvents as RankIcon,
  Refresh as RefreshIcon,
  Remove as RemoveIcon,
  Settings as SettingsIcon,
  FlashOn as ShockIcon,
  Psychology as SkillIcon,
  MenuBook as SpellbookIcon,
  Science as StatusIcon,
  Stars as TraitIcon,
  VisibilityOutlined as ViewIcon,
  AccountBalanceWallet as WalletIcon,
  Gavel as WeaponIcon,
  FormatColorText as FontIcon,
  Palette as PaletteIcon,
  ColorLens as ColorIcon,
  Brush as StyleIcon,
  Widgets as WidgetsIcon,
  Web as FooterIcon,
  LocalHospital as WoundIcon,
  RestartAlt as ResetIcon,
  DashboardCustomize as DashboardCustomizeIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Slider,
} from "@mui/material";
import {alpha, styled} from "@mui/material/styles";
import {doc, onSnapshot} from "firebase/firestore";
import React, {useMemo, useState} from "react";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";
import {
  getCharacterStatusEffects,
  toggleCharacterStatusEffect,
} from "@/lib/characterStatus";
import {db} from "@/lib/firebase";
import {
  calculateMaxMana,
  calculateTotalEdgePoints,
  calculateTotalHindrancePoints,
  calculateTotalSkillPoints,
  DICE,
  EDGES,
  filterEdgesByRank,
  filterPowersByRank,
  getSkillAttribute,
  HINDRANCES,
  POWERS,
  RANKS,
  SKILLS,
} from "@/lib/rpgEngine";
import {getTableGameSession} from "@/lib/sheetLocks";
import {useCharacterStore, useUIStore} from "@/stores/characterStore";
import ArmorList from "./ArmorList";
import AwakeningSection from "./AwakeningSection";
import {CombatList} from "./CombatList";
import ComplicacoesList from "./ComplicacoesList";
import EspoliosList from "./EspoliosList";
import ItemsList from "./ItemsList";
import MagiasList from "./MagiasList";
import SkillsList from "./SkillsList";
import VantagesList from "./VantagesList";
import WeaponsList from "./WeaponsList";

const TabsPaper = styled(Paper)(({theme}) => ({
  marginBottom: "12px",
  borderRadius: "10px",
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
  borderRadius: "10px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  background: "#f0f0f0",
  color: "#333",
  marginLeft: "8px",
}));

const SHEET_TABS = {
  VISUALIZAR: 0,
  IDENTIFICACAO: 1,
  DESPERTAR: 2,
  COMBATE: 3,
  HABILIDADES: 4,
  EQUIPAMENTOS: 5,
  MAGIAS: 6,
  NOTAS: 7,
  CONFIG: 8,
};

const DEFAULT_COLORS = {
  portrait: "#b88941",
  mainInfo: "#4f46e5",
  attributes: "#2563eb",
  combat: "#b91c1c",
  skills: "#0f766e",
  resources: "#6d28d9",
  spells: "#6d28d9",
  weapons: "#7c2d12",
  armor: "#166534",
  edges: "#166534",
  hindrances: "#b45309",
  items: "#475569",
  loot: "#0f766e",
  notes: "#0f172a",
  widgetBackground: "#ffffff",
  widgetTitle: "#64748b",
  widgetText: "#0f172a",
  widgetAux: "#94a3b8",
  widgetIcon: "#667eea",
  footerBackground: "#667eea",
  footerText: "#ffffff",
  footerIcon: "#ffffff",
};

const DEFAULT_FONT_COLORS = {
  fontName: "#0f172a",
  fontAux: "#94a3b8",
  fontTitle: "#0f172a",
  fontText: "#334155",
};

const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      alpha +
      ")"
    );
  }
  return hex;
};

const ConfigCard = ({title, icon, children}) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      overflow: "hidden",
      height: "fit-content", // Garante que o card não estique
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {icon && React.cloneElement(icon, {sx: {fontSize: 20, color: "#64748b"}})}
      <Typography variant="subtitle2" sx={{fontWeight: 700, color: "#334155"}}>
        {title}
      </Typography>
    </Box>
    <Box sx={{p: 2, flex: 1}}>{children}</Box>
  </Paper>
);

const ColorPickerItem = ({label, colorKey, value, onChange, onReset}) => (
  <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 1.5}}>
    <Box sx={{position: "relative", width: 32, height: 32, flexShrink: 0}}>
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          cursor: "pointer",
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          bgcolor: value || "transparent",
          border: "1px solid #cbd5e1",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          background: !value
            ? "conic-gradient(#eee 0% 25%, #fff 25% 50%, #eee 50% 75%, #fff 75% 100%)"
            : undefined,
        }}
      />
    </Box>
    <Box sx={{minWidth: 0, flex: 1}}>
      <Typography
        variant="body2"
        sx={{fontWeight: 600, color: "#334155", lineHeight: 1.2}}
      >
        {label}
      </Typography>
      {onReset && (
        <Typography
          variant="caption"
          sx={{
            cursor: "pointer",
            color: "#94a3b8",
            "&:hover": {color: "#ef4444"},
          }}
          onClick={onReset}
        >
          Restaurar
        </Typography>
      )}
    </Box>
  </Box>
);

const CONFIG_LABELS = {
  portrait: "Retrato",
  mainInfo: "Cabeçalho & Status",
  attributes: "Atributos",
  combat: "Combate",
  skills: "Perícias",
  resources: "Recursos do Despertar",
  spells: "Magias",
  weapons: "Armas",
  armor: "Armaduras",
  edges: "Vantagens",
  hindrances: "Complicações",
  items: "Itens",
  loot: "Espólios",
  notes: "Notas",
};

const EDGE_DESCRIPTION_MAP = Object.fromEntries(
  EDGES.map((edge) => [edge.name, edge.description]),
);

const HINDRANCE_DESCRIPTION_MAP = Object.fromEntries(
  HINDRANCES.map((hindrance) => [hindrance.name, hindrance.description]),
);

const OverviewPanel = ({
  title,
  subtitle,
  icon,
  accent = "#667eea",
  children,
  onIconClick,
  iconTooltip,
  sx = {},
  titleColor,
  subtitleColor,
  iconStyle = {},
  compact = false,
  cardOpacity = 0.9,
}) => (
  <Box
    sx={{
      p: compact ? 0.75 : {xs: 1.25, md: 1.5},
      borderRadius: "8px",
      border: `1px solid ${alpha(accent, 0.18)}`,
      background: `linear-gradient(180deg, ${alpha(accent, 0.12)} 0%, rgba(255,255,255,${cardOpacity}) 100%)`,
      boxShadow: `0 10px 22px ${alpha("#0f172a", 0.06)}`,
      backdropFilter: "blur(8px)",
      overflow: "hidden",
      ...sx,
    }}
  >
    {(title || icon) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: compact ? 0.5 : 1,
          mb: compact ? 0.5 : 1.1,
        }}
      >
        {onIconClick ? (
          <Tooltip title={iconTooltip || "Abrir aba correspondente"} arrow>
            <IconButton
              size="small"
              onClick={onIconClick}
              aria-label={`Abrir ${title}`}
              sx={{
                width: (compact ? 24 : 34) * (iconStyle.scale || 1),
                height: (compact ? 24 : 34) * (iconStyle.scale || 1),
                borderRadius: "7px",
                color: iconStyle.color || accent,
                bgcolor: alpha(accent, 0.14),
                border: iconStyle.borderColor
                  ? `1px solid ${iconStyle.borderColor}`
                  : "none",
                boxShadow: iconStyle.shadowColor
                  ? `0 2px 8px ${alpha(iconStyle.shadowColor, 0.5)}`
                  : `inset 0 0 0 1px ${alpha(accent, 0.2)}`,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: alpha(accent, 0.22),
                },
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ) : (
          <Box
            sx={{
              width: (compact ? 24 : 34) * (iconStyle.scale || 1),
              height: (compact ? 24 : 34) * (iconStyle.scale || 1),
              borderRadius: "7px",
              display: "grid",
              placeItems: "center",
              color: iconStyle.color || accent,
              bgcolor: alpha(accent, 0.14),
              border: iconStyle.borderColor
                ? `1px solid ${iconStyle.borderColor}`
                : "none",
              boxShadow: iconStyle.shadowColor
                ? `0 2px 8px ${alpha(iconStyle.shadowColor, 0.5)}`
                : `inset 0 0 0 1px ${alpha(accent, 0.2)}`,
              "& svg": {
                fontSize: `${1.5 * (iconStyle.scale || 1)}rem`,
              },
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{minWidth: 0}}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: compact ? 700 : 800,
              color: titleColor || "#0f172a",
              lineHeight: 1.1,
              fontSize: compact ? "0.85rem" : "1rem",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: subtitleColor || "#64748b",
                display: "block",
                mt: 0.25,
                fontSize: compact ? "0.65rem" : "0.75rem",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    )}
    {children}
  </Box>
);

const SectionRow = ({label, value, helper, labelColor, valueColor}) => (
  <Box
    sx={{
      py: 0.95,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 1.15,
      borderTop: "1px solid rgba(148, 163, 184, 0.16)",
      "&:first-of-type": {
        pt: 0,
        borderTop: "none",
      },
    }}
  >
    <Box sx={{minWidth: 0}}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: labelColor || "#64748b",
          fontWeight: 700,
          letterSpacing: 0.35,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      {helper && (
        <Typography
          variant="caption"
          sx={{display: "block", color: "#94a3b8", mt: 0.3}}
        >
          {helper}
        </Typography>
      )}
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: valueColor || "#0f172a",
        fontWeight: 700,
        textAlign: "right",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const EmptyState = ({children}) => (
  <Typography variant="body2" sx={{color: "#64748b"}}>
    {children}
  </Typography>
);

const TabLabel = ({icon, label}) => (
  <Box sx={{display: "inline-flex", alignItems: "center", gap: 0.9}}>
    {React.cloneElement(icon, {sx: {fontSize: 18}})}
    <Box component="span" sx={{display: {xs: "none", sm: "inline"}}}>
      {label}
    </Box>
  </Box>
);

const MetricCard = ({
  title,
  value,
  helper,
  icon,
  accent = "#667eea",
  progress,
  children,
  onIconClick,
  iconTooltip,
  sx = {},
  titleColor,
  valueColor,
  iconStyle = {},
  compact = false,
  customBackground,
  customTitleColor,
  customTextColor,
  customAuxColor,
  customIconColor,
  widgetOpacity = 0.82,
}) => (
  <Box
    sx={{
      minHeight: compact ? 60 : 90,
      p: compact ? 0.5 : 1,
      borderRadius: "8px",
      border: `1px solid ${alpha(accent, 0.18)}`,
      background:
        customBackground && customBackground.startsWith("#")
          ? hexToRgba(customBackground, widgetOpacity)
          : customBackground || `rgba(255,255,255,${widgetOpacity})`,
      boxShadow: `0 10px 20px ${alpha("#0f172a", 0.06)}`,
      backdropFilter: "blur(10px)",
      ...sx,
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: compact ? 0.5 : 1.5,
      }}
    >
      <Box sx={{minWidth: 0}}>
        <Typography
          variant="caption"
          sx={{
            color: customTitleColor || "#64748b",
            textTransform: "uppercase",
            letterSpacing: compact ? 0 : 0.65,
            fontWeight: 700,
            fontSize: compact ? "0.65rem" : "0.75rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            color: customTextColor || "#0f172a",
            mt: compact ? 0 : 0.35,
            fontSize: compact ? "1rem" : {xs: "1.24rem", md: "1.35rem"},
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        {helper && !compact && (
          <Typography
            variant="caption"
            sx={{color: customAuxColor || "#475569", display: "block", mt: 0.5}}
          >
            {helper}
          </Typography>
        )}
      </Box>
      {onIconClick ? (
        <Tooltip title={iconTooltip || "Abrir aba correspondente"} arrow>
          <IconButton
            size="small"
            onClick={onIconClick}
            aria-label={`Abrir ${title}`}
            sx={{
              width: (compact ? 28 : 36) * (iconStyle.scale || 1),
              height: (compact ? 28 : 36) * (iconStyle.scale || 1),
              borderRadius: "7px",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              color: customIconColor || iconStyle.color || accent,
              bgcolor: iconStyle.fill || alpha(accent, 0.14),
              border: iconStyle.borderColor
                ? `1px solid ${iconStyle.borderColor}`
                : "none",
              boxShadow: iconStyle.shadowColor
                ? `0 2px 8px ${alpha(iconStyle.shadowColor, 0.5)}`
                : `inset 0 0 0 1px ${alpha(accent, 0.2)}`,
              "&:hover": {
                bgcolor: alpha(accent, 0.22),
              },
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ) : (
        <Box
          sx={{
            width: (compact ? 28 : 36) * (iconStyle.scale || 1),
            height: (compact ? 28 : 36) * (iconStyle.scale || 1),
            borderRadius: "7px",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: customIconColor || iconStyle.color || accent,
            bgcolor: iconStyle.fill || alpha(accent, 0.14),
            border: iconStyle.borderColor
              ? `1px solid ${iconStyle.borderColor}`
              : "none",
            boxShadow: iconStyle.shadowColor
              ? `0 2px 8px ${alpha(iconStyle.shadowColor, 0.5)}`
              : `inset 0 0 0 1px ${alpha(accent, 0.2)}`,
            "& svg": {
              fontSize: `${(compact ? 1.2 : 1.5) * (iconStyle.scale || 1)}rem`,
            },
          }}
        >
          {icon}
        </Box>
      )}
    </Box>

    {typeof progress === "number" && (
      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min(progress, 100))}
        sx={{
          mt: compact ? 0.5 : 1.15,
          height: compact ? 4 : 6,
          borderRadius: "7px",
          bgcolor: alpha(accent, 0.12),
          "& .MuiLinearProgress-bar": {
            borderRadius: "7px",
            bgcolor: accent,
          },
        }}
      />
    )}

    {children}
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
  const navigateToTab = React.useCallback(
    (newValue) =>
      isInspection ? setLocalTab(newValue) : setSheetTab(newValue),
    [isInspection, setSheetTab],
  );
  const handleTabChange = (e, newValue) => navigateToTab(newValue);

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

  const getColor = (key) =>
    (character.sheetColors && character.sheetColors[key]) ||
    DEFAULT_COLORS[key] ||
    DEFAULT_FONT_COLORS[key];

  // Icon Styles
  const getIconStyle = () => ({
    color: character.sheetColors?.iconColor,
    fill: character.sheetColors?.iconFill,
    borderColor: character.sheetColors?.iconBorder,
    scale: parseFloat(character.sheetColors?.iconSize || 1),
  });

  // Opacity Helpers
  const getCardOpacity = () => {
    return character.sheetColors?.cardOpacity !== undefined
      ? parseFloat(character.sheetColors.cardOpacity)
      : 0.9;
  };
  const getWidgetOpacity = () => {
    return character.sheetColors?.widgetOpacity !== undefined
      ? parseFloat(character.sheetColors.widgetOpacity)
      : 0.82;
  };

  // Preferences Helpers
  const getPreferences = () => character.sheetPreferences || {};

  const isCardVisible = (key) => {
    const prefs = getPreferences();
    return !prefs.hiddenCards?.includes(key);
  };

  const toggleCardVisibility = (key) => {
    const prefs = getPreferences();
    const currentHidden = prefs.hiddenCards || [];
    const newHidden = currentHidden.includes(key)
      ? currentHidden.filter((k) => k !== key)
      : [...currentHidden, key];
    updateAttribute("sheetPreferences", {...prefs, hiddenCards: newHidden});
  };

  const {user} = useAuth();

  const gameSession = useMemo(
    () => getTableGameSession(selectedTable),
    [selectedTable],
  );
  const isGM = selectedTable?.gmId === user?.uid;
  const isTableSession = !!selectedTable;
  const isGameSessionLocked =
    !isInspection && isTableSession && !isGM && gameSession.isActive;
  const lockedFieldSet = useMemo(
    () => new Set(gameSession.lockedFields || []),
    [gameSession.lockedFields],
  );
  const hasLockedFieldsNotice =
    isGameSessionLocked && gameSession.lockedFields.length > 0;

  // Compact Mode
  const isCompactMode = !!character.sheetPreferences?.compactMode;
  const panelSx = isCompactMode ? {p: 0.5} : {};

  // Background Logic for Tab 0
  const customBackground = character.sheetColors?.background;
  const defaultBackground = `
    radial-gradient(circle at top left, rgba(191, 145, 61, 0.14), transparent 24%),
    radial-gradient(circle at top right, rgba(79, 70, 229, 0.12), transparent 28%),
    linear-gradient(180deg, #f8f3e6 0%, #f3ecdc 55%, #efe6d4 100%)
  `;

  // Reorganization Logic
  const visibleLeft = ["skills", "resources", "spells", "notes"].some(
    isCardVisible,
  );
  const visibleRight = [
    "weapons",
    "armor",
    "edges",
    "hindrances",
    "items",
    "loot",
  ].some(isCardVisible);

  // Default to balanced if both are visible or both hidden (fallback)
  const leftColWidth = !visibleRight ? 12 : 6;
  const rightColWidth = !visibleLeft ? 12 : 6;

  const isFieldLocked = React.useCallback(
    (fieldKey) => isGameSessionLocked && lockedFieldSet.has(fieldKey),
    [isGameSessionLocked, lockedFieldSet],
  );

  const updateAttributeIfAllowed = React.useCallback(
    (fieldKey, value) => {
      if (isFieldLocked(fieldKey)) return false;
      updateAttribute(fieldKey, value);
      return true;
    },
    [isFieldLocked, updateAttribute],
  );

  const addItemToListIfAllowed = React.useCallback(
    (fieldKey, listName, item) => {
      if (isFieldLocked(fieldKey)) return false;
      addItemToList(listName, item);
      return true;
    },
    [addItemToList, isFieldLocked],
  );

  const removeItemFromListIfAllowed = React.useCallback(
    (fieldKey, listName, index) => {
      if (isFieldLocked(fieldKey)) return false;
      removeItemFromList(listName, index);
      return true;
    },
    [isFieldLocked, removeItemFromList],
  );

  const updateListItemIfAllowed = React.useCallback(
    (fieldKey, listName, index, item) => {
      if (isFieldLocked(fieldKey)) return false;
      updateListItem(listName, index, item);
      return true;
    },
    [isFieldLocked, updateListItem],
  );

  const isRemoteUpdate = React.useRef(false);
  const [autoSaveStatus, setAutoSaveStatus] = React.useState("idle"); // idle, saving, saved, error

  // Lógica de Auto-Save
  React.useEffect(() => {
    // Não salva se estiver inspecionando (propCharacter existe) ou se não tiver ID/User
    if (propCharacter || !character._id || !user) return;

    // Se a atualização veio do banco (GM/Listener), não salva de volta para evitar loop/reversão
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

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

  // Listener para sincronização em tempo real (ex: GM altera mana/vida)
  React.useEffect(() => {
    // Só ativa se não estiver inspecionando (propCharacter) e tiver um ID válido
    if (propCharacter || !character?._id) return;

    const unsubscribe = onSnapshot(
      doc(db, "characters", character._id),
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          const currentCharacter = useCharacterStore.getState().character;

          // Comparação simples para evitar updates desnecessários e loops
          // Removemos updatedAt da comparação pois ele muda a cada save
          const {updatedAt: rUp, ...rRest} = remoteData;
          const {updatedAt: cUp, ...cRest} = currentCharacter;

          if (JSON.stringify(rRest) !== JSON.stringify(cRest)) {
            isRemoteUpdate.current = true; // Marca como atualização remota
            storeUpdateCharacter({
              _id: currentCharacter._id || character._id,
              ...remoteData,
            });
          }
        }
      },
    );

    return () => unsubscribe();
  }, [character?._id, propCharacter, storeUpdateCharacter]);

  const [imgLoading, setImgLoading] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptData, setPromptData] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isFieldLocked("imagem_url")) return;

    setImgLoading(true);
    try {
      const url = await APIService.uploadFile(file);
      updateAttributeIfAllowed("imagem_url", url);
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
  const statusEffects = useMemo(
    () => getCharacterStatusEffects(character),
    [character],
  );

  // Helper para renderizar ícones de status no Widget
  const renderStatusIcons = () => {
    if (statusEffects.length === 0) return "Sem efeitos";

    return (
      <Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap"}}>
        {statusEffects.map((effect) => {
          let Icon = OtherStatusIcon;
          let color = "#a16207";

          if (effect === "Envenenado") {
            Icon = PoisonIcon;
            color = "#4caf50"; // Verde
          } else if (effect === "Paralisado") {
            Icon = ParalyzedIcon;
            color = "#ffb74d"; // Laranja/Amarelo
          } else if (effect === "Congelado") {
            Icon = FrozenIcon;
            color = "#29b6f6"; // Azul Claro
          } else if (effect === "Queimado") {
            Icon = BurnIcon;
            color = "#d32f2f"; // Vermelho
          }

          return (
            <Tooltip key={effect} title={effect} arrow>
              <Icon sx={{color, fontSize: 24}} />
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  const handleUpdateMana = (newValue) => {
    updateAttributeIfAllowed("mana_atual", Math.min(newValue, maxMana));
  };

  const handleCastSpell = (spell) => {
    if (isFieldLocked("mana_atual")) return;
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
      updateAttributeIfAllowed("mana_atual", newValue);
      showNotification(`Magia usada! -${cost} Mana`, "info");
    }
  };

  const handleUseAwakeningResource = (resource) => {
    if (isFieldLocked("mana_atual")) return;
    const cost = parseInt(resource.custo || resource.pp, 10) || 0;
    if (cost > 0) {
      if (currentMana < cost) {
        showNotification(
          `Mana insuficiente! Necessário: ${cost} PP`,
          "warning",
        );
        return;
      }
      const newValue = currentMana - cost;
      updateAttributeIfAllowed("mana_atual", newValue);
      showNotification(`Recurso usado! -${cost} Mana`, "info");
    }
  };

  // Lógica de Uso de Itens (Consumíveis)
  const handleUseItem = (listName, index, item) => {
    if (isFieldLocked(listName)) return;

    const name = (item.name || "").toLowerCase();
    let consumed = false;
    let message = "";

    if (name.includes("poção de cura") || name.includes("healing potion")) {
      // Cura 1 Ferimento e remove Abalado
      const currentWounds = character.ferimentos || 0;
      if (currentWounds > 0 || character.abalado) {
        updateAttributeIfAllowed("ferimentos", Math.max(0, currentWounds - 1));
        updateAttributeIfAllowed("abalado", false);
        message = "Poção de Cura usada! Recuperou 1 ferimento.";
        consumed = true;
      } else {
        showNotification("Saúde plena. Item não gasto.", "info");
        return;
      }
    } else if (name.includes("poção de mana") || name.includes("mana potion")) {
      // Recupera 10 Mana (valor padrão aproximado)
      if (currentMana < maxMana) {
        const recovery = 10;
        updateAttributeIfAllowed(
          "mana_atual",
          Math.min(maxMana, currentMana + recovery),
        );
        message = `Poção de Mana usada! +${recovery} PM.`;
        consumed = true;
      } else {
        showNotification("Mana cheia. Item não gasto.", "info");
        return;
      }
    } else if (name.includes("antídoto") || name.includes("antidote")) {
      // Remove Envenenado e 1 Fadiga
      const cleanStatus = (character.status_efeitos || []).filter(
        (s) => s !== "Envenenado",
      );
      const wasPoisoned =
        (character.status_efeitos || []).includes("Envenenado") ||
        character.envenenado;

      if (wasPoisoned) {
        updateAttributeIfAllowed("status_efeitos", cleanStatus);
        updateAttributeIfAllowed("envenenado", false); // legado
        updateAttributeIfAllowed(
          "fadiga",
          Math.max(0, (character.fadiga || 0) - 1),
        );
        message = "Antídoto usado! Veneno curado.";
        consumed = true;
      } else {
        showNotification("Não está envenenado.", "info");
        return;
      }
    } else {
      // Item genérico - Apenas consome com aviso
      message = `Item "${item.name}" consumido.`;
      consumed = true;
    }

    if (consumed) {
      const currentQty = parseInt(item.quantity || 1, 10);
      if (currentQty > 1) {
        updateListItemIfAllowed(listName, listName, index, {
          ...item,
          quantity: (currentQty - 1).toString(),
        });
      } else {
        removeItemFromListIfAllowed(listName, listName, index);
      }
      showNotification(message, "success");
    }
  };

  // Lógica para consumo via Visualizar (Double Click)
  const [useItemAnchor, setUseItemAnchor] = useState(null);
  const [chipItemToUse, setChipItemToUse] = useState(null);

  const handleChipDoubleClick = (event, listName, index, item) => {
    if (isFieldLocked(listName)) return;
    setUseItemAnchor(event.currentTarget);
    setChipItemToUse({listName, index, item});
  };

  const handleConfirmChipUse = () => {
    if (chipItemToUse) {
      handleUseItem(
        chipItemToUse.listName,
        chipItemToUse.index,
        chipItemToUse.item,
      );
    }
    setUseItemAnchor(null);
    setChipItemToUse(null);
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
  const woundCount = character.ferimentos || 0;
  const fatigueCount = character.fadiga || 0;
  const injuryPenalty = woundCount + fatigueCount;
  const blessingCount = character.bencaos ?? 3;
  const totalParry =
    parryBase + (character.aparar_bonus || 0) + armorParryBonus;
  const totalToughness =
    toughnessBase + (character.armadura_bonus || 0) + armorDefenseBonus;
  const manaProgress = maxMana > 0 ? (currentMana / maxMana) * 100 : 0;
  const woundProgress = Math.min((woundCount / 3) * 100, 100);
  const fatigueProgress = Math.min((fatigueCount / 2) * 100, 100);
  const hunterIdentityLine = [
    character.rank || "Novato",
    character.arquetipo
      ? `${character.arquetipo}${character.conceito ? ` (${character.conceito})` : ""}`
      : character.conceito || "Arquétipo indefinido",
    character.guilda || null,
  ].filter(Boolean);
  const autoSaveMeta =
    autoSaveStatus === "saving"
      ? {
          icon: <CloudUpload sx={{fontSize: 16}} />,
          text: "Salvando",
          color: "#475569",
          bg: alpha("#cbd5e1", 0.42),
        }
      : autoSaveStatus === "saved"
        ? {
            icon: <CheckCircle sx={{fontSize: 16}} />,
            text: "Salvo",
            color: "#166534",
            bg: alpha("#86efac", 0.25),
          }
        : autoSaveStatus === "error"
          ? {
              icon: <ErrorIcon sx={{fontSize: 16}} />,
              text: "Erro ao salvar",
              color: "#b91c1c",
              bg: alpha("#fca5a5", 0.25),
            }
          : null;

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
            label={<TabLabel icon={<ViewIcon />} label="Visualizar" />}
          />
          <TabStyled
            label={<TabLabel icon={<IdentityIcon />} label="Identificação" />}
          />
          <TabStyled
            label={<TabLabel icon={<AwakeningIcon />} label="Despertar" />}
          />
          <TabStyled
            label={<TabLabel icon={<DefenseIcon />} label="Combate" />}
          />
          <TabStyled
            label={<TabLabel icon={<SkillIcon />} label="Habilidades" />}
          />
          <TabStyled
            label={<TabLabel icon={<InventoryIcon />} label="Equipamentos" />}
          />
          <TabStyled
            label={<TabLabel icon={<SpellbookIcon />} label="Magias" />}
          />
          <TabStyled label={<TabLabel icon={<NotesIcon />} label="Notas" />} />
          <TabStyled
            label={<TabLabel icon={<SettingsIcon />} label="Config" />}
          />
        </Tabs>
      </TabsPaper>

      {hasLockedFieldsNotice && (
        <Alert severity="warning" sx={{mb: 2}}>
          Jogo em andamento. O GM bloqueou parte da ficha durante esta sessão.
        </Alert>
      )}

      {/* TAB 0: VISUALIZAR */}
      {tabValue === 0 && (
        <Box
          sx={{
            p: {xs: 1, md: 1.5},
            pb: {xs: 12, md: 14},
            borderRadius: "8px",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            background: customBackground || defaultBackground,
            minHeight: "80vh", // Garante altura mínima para o bg aparecer bem
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)",
            "& .MuiChip-root": {
              borderRadius: "8px",
            },
            "& .MuiButton-root": {
              borderRadius: "8px",
            },
          }}
        >
          <Grid container spacing={1.5}>
            {isCardVisible("portrait") && (
              <Grid item xs={12} md={3} sx={{display: "flex"}}>
                <OverviewPanel
                  title="Retrato"
                  icon={<CharacterIcon />}
                  accent={getColor("portrait")}
                  titleColor={getColor("fontTitle")}
                  subtitleColor={getColor("fontText")}
                  iconStyle={getIconStyle()}
                  cardOpacity={getCardOpacity()}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: `linear-gradient(180deg, ${alpha(getColor("portrait"), 0.16)} 0%, rgba(255,255,255,0.88) 100%)`,
                    ...panelSx,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      minHeight: {xs: 200, md: 248},
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid rgba(148, 163, 184, 0.22)",
                      bgcolor: "#111827",
                      boxShadow: "0 18px 30px rgba(15, 23, 42, 0.16)",
                    }}
                  >
                    {character.imagem_url ? (
                      <Box
                        component="img"
                        src={character.imagem_url}
                        referrerPolicy="no-referrer"
                        alt={character.nome || "Personagem"}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                          background:
                            "radial-gradient(circle at top, rgba(191,145,61,0.28), transparent 38%), linear-gradient(180deg, #111827 0%, #1f2937 100%)",
                          color: alpha("#f8fafc", 0.7),
                        }}
                      >
                        <Box sx={{textAlign: "center"}}>
                          <CharacterIcon sx={{fontSize: 56, mb: 1}} />
                          <Typography
                            variant="body2"
                            sx={{fontWeight: 700, letterSpacing: 0.4}}
                          >
                            Sem retrato
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </OverviewPanel>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              md={isCardVisible("portrait") ? 9 : 12}
              sx={{display: "flex"}}
            >
              <OverviewPanel
                title={null} // Título removido conforme solicitado
                icon={null}
                accent={getColor("mainInfo")}
                titleColor={getColor("fontTitle")}
                subtitleColor={getColor("fontText")}
                cardOpacity={getCardOpacity()}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: `linear-gradient(180deg, ${alpha(getColor("mainInfo"), 0.14)} 0%, rgba(255,255,255,0.92) 100%)`,
                  gap: 1.5,
                  p: 1.5,
                  ...panelSx,
                }}
              >
                {/* Linha Superior: Nome/Identidade + XP/Riqueza/Bênçãos */}
                <Grid container spacing={2} alignItems="center">
                  {/* Coluna 1: Nome e Identidade */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{minWidth: 0}}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          color: getColor("fontName"),
                          letterSpacing: -0.5,
                          fontSize: {xs: "1.7rem", md: "2rem"},
                        }}
                      >
                        {character.nome || "Sem Nome"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 0.55,
                          color:
                            getColor("fontIdentity") || getColor("fontAux"),
                          fontWeight: 700,
                        }}
                      >
                        {hunterIdentityLine.length > 0
                          ? hunterIdentityLine.join(" • ")
                          : "Sem afiliação definida"}
                      </Typography>
                    </Box>
                    {!propCharacter && autoSaveMeta && (
                      <Box sx={{mt: 1}}>
                        <Chip
                          size="small"
                          icon={autoSaveMeta.icon}
                          label={autoSaveMeta.text}
                          sx={{
                            bgcolor: autoSaveMeta.bg,
                            color: autoSaveMeta.color,
                            fontWeight: 700,
                            border: "1px solid rgba(15, 23, 42, 0.06)",
                          }}
                        />
                      </Box>
                    )}
                  </Grid>

                  {/* Coluna 2: XP, Riqueza, Bênçãos */}
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={1}>
                      {[
                        {
                          label: "XP",
                          value: character.xp || 0,
                          accent: "#4f46e5",
                        },
                        {
                          label: "Riqueza",
                          value: `$${character.riqueza || 0}`,
                          accent: "#047857",
                        },
                        {
                          label: "Bênçãos",
                          value: blessingCount,
                          accent: "#b45309",
                        },
                        {
                          label: "Corrupção",
                          value: character.corrupcao || 0,
                          accent: "#7b1fa2",
                        },
                      ].map((item) => (
                        <Grid item xs={3} key={item.label}>
                          <Box
                            sx={{
                              p: 0.75,
                              height: "100%",
                              borderRadius: "8px",
                              bgcolor: getColor("widgetBackground").startsWith(
                                "#",
                              )
                                ? hexToRgba(
                                    getColor("widgetBackground"),
                                    getWidgetOpacity(),
                                  )
                                : getColor("widgetBackground"),
                              border: `1px solid ${alpha(item.accent, 0.15)}`,
                              boxShadow: `inset 0 0 0 1px ${alpha("#fff", 0.6)}`,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: getColor("widgetTitle"),
                                textTransform: "uppercase",
                                letterSpacing: 0.45,
                                fontWeight: 700,
                                display: "block",
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                mt: 0.3,
                                fontWeight: 900,
                                color: getColor("widgetText"),
                                lineHeight: 1,
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                <Divider sx={{my: 0.5}} />

                {/* Linha Inferior: Atributos e Combate integrados */}
                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={6}>
                    <OverviewPanel
                      title="Atributos"
                      subtitle="Base de dados, dano e resistência"
                      icon={<CharacterIcon />}
                      accent={getColor("attributes")}
                      titleColor={getColor("fontTitle")}
                      subtitleColor={getColor("fontText")}
                      iconStyle={getIconStyle()}
                      sx={{height: "100%"}}
                      compact={isCompactMode}
                      cardOpacity={getCardOpacity()}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                          gap: 1,
                        }}
                      >
                        {[
                          {label: "AGI", value: character.agilidade || "d4"},
                          {label: "INT", value: character.intelecto || "d4"},
                          {label: "ESP", value: character.espirito || "d4"},
                          {label: "FOR", value: character.forca || "d4"},
                          {label: "VIG", value: character.vigor || "d4"},
                        ].map((attribute) => (
                          <Box
                            key={attribute.label}
                            sx={{
                              p: 1,
                              borderRadius: "8px",
                              textAlign: "center",
                              bgcolor: getColor("widgetBackground").startsWith(
                                "#",
                              )
                                ? hexToRgba(
                                    getColor("widgetBackground"),
                                    getWidgetOpacity(),
                                  )
                                : getColor("widgetBackground"),
                              border: "1px solid rgba(37, 99, 235, 0.12)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                color: getColor("widgetTitle"),
                                fontWeight: 800,
                                letterSpacing: 0.45,
                              }}
                            >
                              {attribute.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                mt: 0.35,
                                fontWeight: 900,
                                color: getColor("widgetText"),
                              }}
                            >
                              {attribute.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </OverviewPanel>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <OverviewPanel
                      title="Combate"
                      subtitle="Defesas e pressão de cena"
                      icon={<DefenseIcon />}
                      accent={getColor("combat")}
                      titleColor={getColor("fontTitle")}
                      subtitleColor={getColor("fontText")}
                      iconStyle={getIconStyle()}
                      sx={{height: "100%"}}
                      compact={isCompactMode}
                      cardOpacity={getCardOpacity()}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: 1,
                        }}
                      >
                        {[
                          {
                            label: "Aparar",
                            value: totalParry,
                            accent: "#b91c1c",
                          },
                          {
                            label: "Resistência",
                            value: totalToughness,
                            accent: "#991b1b",
                          },
                          {
                            label: "Movimento",
                            value: character.movimento || 6,
                            accent: "#1d4ed8",
                          },
                          {
                            label: "Penalidade",
                            value: `-${injuryPenalty}`,
                            accent: "#d97706",
                          },
                        ].map((stat) => (
                          <Box
                            key={stat.label}
                            sx={{
                              p: 1,
                              borderRadius: "8px",
                              textAlign: "center",
                              bgcolor: getColor("widgetBackground").startsWith(
                                "#",
                              )
                                ? hexToRgba(
                                    getColor("widgetBackground"),
                                    getWidgetOpacity(),
                                  )
                                : getColor("widgetBackground"),
                              border: `1px solid ${alpha(stat.accent, 0.14)}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: getColor("widgetTitle"),
                                textTransform: "uppercase",
                                letterSpacing: 0.45,
                                fontWeight: 700,
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                mt: 0.3,
                                color: getColor("widgetText"),
                                fontWeight: 900,
                              }}
                            >
                              {stat.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </OverviewPanel>
                  </Grid>
                </Grid>

                <Divider sx={{my: 0.5}} />

                {/* Linha Inferior 2: Widgets de Status */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                      lg: "repeat(5, minmax(0, 1fr))",
                    },
                    gap: 1.25,
                  }}
                >
                  {" "}
                  <MetricCard
                    title="Abalado"
                    value={character.abalado ? "Sim" : "Não"}
                    helper={
                      character.abalado ? "Precisa reagir" : "Mantém postura"
                    }
                    icon={<ShockIcon />}
                    accent={character.abalado ? "#d97706" : "#475569"}
                    titleColor={getColor("fontText")}
                    valueColor={getColor("fontTitle")}
                    iconStyle={getIconStyle()}
                    compact={isCompactMode}
                    customBackground={getColor("widgetBackground")}
                    customTitleColor={getColor("widgetTitle")}
                    customTextColor={getColor("widgetText")}
                    customAuxColor={getColor("widgetAux")}
                    customIconColor={getColor("widgetIcon")}
                    widgetOpacity={getWidgetOpacity()}
                  />
                  <MetricCard
                    title="Ferimentos"
                    value={`${woundCount}/3`}
                    helper={
                      woundCount >= 3
                        ? "Estado crítico"
                        : "Atenção à resistência"
                    }
                    icon={<WoundIcon />}
                    accent="#b91c1c"
                    progress={woundProgress}
                    titleColor={getColor("fontText")}
                    valueColor={getColor("fontTitle")}
                    iconStyle={getIconStyle()}
                    compact={isCompactMode}
                    customBackground={getColor("widgetBackground")}
                    customTitleColor={getColor("widgetTitle")}
                    customTextColor={getColor("widgetText")}
                    customAuxColor={getColor("widgetAux")}
                    customIconColor={getColor("widgetIcon")}
                    widgetOpacity={getWidgetOpacity()}
                  />
                  <MetricCard
                    title="Fadiga"
                    value={`${fatigueCount}/2`}
                    helper={fatigueCount >= 2 ? "Exausto" : "Fôlego atual"}
                    icon={<FatigueIcon />}
                    accent="#c2410c"
                    progress={fatigueProgress}
                    titleColor={getColor("fontText")}
                    valueColor={getColor("fontTitle")}
                    iconStyle={getIconStyle()}
                    compact={isCompactMode}
                    customBackground={getColor("widgetBackground")}
                    customTitleColor={getColor("widgetTitle")}
                    customTextColor={getColor("widgetText")}
                    customAuxColor={getColor("widgetAux")}
                    customIconColor={getColor("widgetIcon")}
                    widgetOpacity={getWidgetOpacity()}
                  />
                  <MetricCard
                    title="Mana"
                    value={`${currentMana}/${maxMana}`}
                    helper="Reserva arcana"
                    icon={
                      <span style={{fontSize: "1.35rem", lineHeight: 1}}>
                        🌀
                      </span>
                    }
                    accent="#2563eb"
                    progress={manaProgress}
                    titleColor={getColor("fontText")}
                    valueColor={getColor("fontTitle")}
                    iconStyle={getIconStyle()}
                    compact={isCompactMode}
                    customBackground={getColor("widgetBackground")}
                    customTitleColor={getColor("widgetTitle")}
                    customTextColor={getColor("widgetText")}
                    customAuxColor={getColor("widgetAux")}
                    customIconColor={getColor("widgetIcon")}
                    widgetOpacity={getWidgetOpacity()}
                  />
                  <MetricCard
                    title="Status"
                    value={renderStatusIcons()}
                    helper="Efeitos situacionais"
                    icon={<StatusIcon />}
                    accent="#a16207"
                    titleColor={getColor("fontText")}
                    valueColor={getColor("fontTitle")}
                    iconStyle={getIconStyle()}
                    compact={isCompactMode}
                    customBackground={getColor("widgetBackground")}
                    customTitleColor={getColor("widgetTitle")}
                    customTextColor={getColor("widgetAux")}
                    customAuxColor={getColor("widgetAux")}
                    customIconColor={getColor("widgetIcon")}
                    widgetOpacity={getWidgetOpacity()}
                  />
                </Box>
              </OverviewPanel>
            </Grid>
          </Grid>

          <Box sx={{mt: 1.5}}>
            <Grid container spacing={1.25} alignItems="flex-start">
              {/* COLUNA ESQUERDA: Perícias, Recursos, Magias, Notas */}
              {visibleLeft && (
                <Grid item xs={12} md={leftColWidth}>
                  <Stack spacing={1.25}>
                    {isCardVisible("skills") && (
                      <OverviewPanel
                        title="Perícias"
                        subtitle="Principais capacidades em jogo"
                        icon={<SkillIcon />}
                        accent={getColor("skills")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.85,
                          }}
                        >
                          {(character.pericias || []).length > 0 ? (
                            character.pericias.map((skill, index) => (
                              <Box
                                key={`${skill.name}-${index}`}
                                sx={{
                                  p: 1,
                                  px: 1.5,
                                  borderRadius: "8px",
                                  bgcolor: "rgba(255,255,255,0.76)",
                                  border: "1px solid rgba(15, 118, 110, 0.12)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      color: getColor("fontTitle"),
                                    }}
                                  >
                                    {skill.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{color: "#64748b", fontWeight: 700}}
                                  >
                                    (
                                    {(getSkillAttribute(skill.name) || "")
                                      .substring(0, 3)
                                      .toUpperCase() || "—"}
                                    )
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{fontWeight: 800, color: "#0f766e"}}
                                >
                                  {skill.die || "d4"}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <EmptyState>Nenhuma perícia cadastrada.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("resources") && (
                      <OverviewPanel
                        title="Recursos do Despertar"
                        subtitle="Poderes especiais em uso"
                        icon={<BlessingIcon />}
                        accent={getColor("resources")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "grid", gap: 0.85}}>
                          {(character.recursos_despertar || []).length > 0 ? (
                            character.recursos_despertar.map(
                              (resource, index) => (
                                <Box
                                  key={`${resource.name}-${index}`}
                                  sx={{
                                    p: 1.05,
                                    borderRadius: "8px",
                                    bgcolor: "rgba(255,255,255,0.76)",
                                    border:
                                      "1px solid rgba(124, 58, 237, 0.12)",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                      gap: 1,
                                    }}
                                  >
                                    <Box sx={{minWidth: 0}}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: isCompactMode ? 700 : 800,
                                          color: getColor("fontText"),
                                        }}
                                      >
                                        {resource.name || "Recurso sem nome"}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: getColor("fontAux"),
                                          fontWeight: 700,
                                          display: "block",
                                          mt: 0.25,
                                        }}
                                      >
                                        Nv {resource.nivel || "—"} • Custo{" "}
                                        {resource.custo || resource.pp || "—"}
                                      </Typography>
                                      {resource.descricao && (
                                        <Typography
                                          variant="body2"
                                          sx={{mt: 0.5, color: "#475569"}}
                                        >
                                          {resource.descricao}
                                        </Typography>
                                      )}
                                      {resource.limitacao && (
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            display: "block",
                                            mt: 0.65,
                                            color: "#92400e",
                                          }}
                                        >
                                          Limitação: {resource.limitacao}
                                        </Typography>
                                      )}
                                    </Box>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color={
                                        currentMana >=
                                        (parseInt(
                                          resource.custo || resource.pp,
                                          10,
                                        ) || 0)
                                          ? "primary"
                                          : "error"
                                      }
                                      disabled={
                                        isFieldLocked("mana_atual") ||
                                        currentMana <
                                          (parseInt(
                                            resource.custo || resource.pp,
                                            10,
                                          ) || 0)
                                      }
                                      sx={{
                                        borderRadius: "8px",
                                        minWidth: 68,
                                        fontWeight: 700,
                                      }}
                                      onClick={() =>
                                        handleUseAwakeningResource(resource)
                                      }
                                    >
                                      Usar
                                    </Button>
                                  </Box>
                                </Box>
                              ),
                            )
                          ) : (
                            <EmptyState>
                              Nenhum recurso do despertar cadastrado.
                            </EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("spells") && (
                      <OverviewPanel
                        title="Magias"
                        subtitle="Lista rápida para conjuração em cena"
                        icon={<SpellbookIcon />}
                        accent={getColor("spells")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "grid", gap: 0.85}}>
                          {(character.magias || []).length > 0 ? (
                            character.magias.map((spell, index) => (
                              <Box
                                key={`${spell.name}-${index}`}
                                sx={{
                                  p: 1.05,
                                  borderRadius: "8px",
                                  bgcolor: "rgba(255,255,255,0.76)",
                                  border: "1px solid rgba(109, 40, 217, 0.12)",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 1,
                                  }}
                                >
                                  <Box sx={{minWidth: 0}}>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: isCompactMode ? 700 : 800,
                                        color: getColor("fontText"),
                                      }}
                                    >
                                      {spell.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        mt: 0.45,
                                        color: getColor("fontAux"),
                                      }}
                                    >
                                      {spell.pp || 0} PP
                                      {spell.range ? ` • ${spell.range}` : ""}
                                      {spell.duration
                                        ? ` • ${spell.duration}`
                                        : ""}
                                    </Typography>
                                  </Box>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color={
                                      currentMana >=
                                      (parseInt(spell.pp, 10) || 0)
                                        ? "primary"
                                        : "error"
                                    }
                                    disabled={
                                      isFieldLocked("mana_atual") ||
                                      currentMana <
                                        (parseInt(spell.pp, 10) || 0)
                                    }
                                    sx={{
                                      borderRadius: "8px",
                                      minWidth: 68,
                                      fontWeight: 700,
                                    }}
                                    onClick={() => handleCastSpell(spell)}
                                  >
                                    Usar
                                  </Button>
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <EmptyState>Nenhuma magia aprendida.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("notes") && (
                      <OverviewPanel
                        title="Notas de Campanha"
                        subtitle="Observações rápidas, pistas e lembretes"
                        icon={<NotesIcon />}
                        accent={getColor("notes")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <StyledTextField
                          fullWidth
                          multiline
                          minRows={4}
                          disabled={isFieldLocked("notas")}
                          value={character.notas || ""}
                          onChange={(e) =>
                            updateAttributeIfAllowed("notas", e.target.value)
                          }
                          placeholder="Escreva suas anotações..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "rgba(255,255,255,0.72)",
                              alignItems: "flex-start",
                            },
                            "& textarea": {
                              fontFamily:
                                '"IBM Plex Sans", system-ui, sans-serif',
                            },
                          }}
                        />
                      </OverviewPanel>
                    )}
                  </Stack>
                </Grid>
              )}

              {/* COLUNA DIREITA: Armas, Armaduras, Vantagens, Complicações, Itens, Espólios */}
              {visibleRight && (
                <Grid item xs={12} md={rightColWidth}>
                  <Stack spacing={1.25}>
                    {isCardVisible("weapons") && (
                      <OverviewPanel
                        title="Armas"
                        subtitle="Golpes prontos para a cena"
                        icon={<WeaponIcon />}
                        accent={getColor("weapons")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "grid", gap: 0.85}}>
                          {(character.armas || []).length > 0 ? (
                            character.armas.map((weapon, index) => (
                              <Box
                                key={`${weapon.name}-${index}`}
                                sx={{
                                  p: 1.05,
                                  borderRadius: "8px",
                                  bgcolor: "rgba(255,255,255,0.76)",
                                  border: "1px solid rgba(124, 45, 18, 0.12)",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 800,
                                      color: getColor("fontTitle"),
                                    }}
                                  >
                                    {weapon.name}
                                  </Typography>
                                  <Box
                                    sx={{
                                      typography: "h6",
                                      fontWeight: 900,
                                      color: "#7c2d12",
                                    }}
                                  >
                                    {weapon.damage || "—"}
                                  </Box>
                                </Box>
                                {weapon.range && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "block",
                                      mt: 0.45,
                                      color: getColor("fontText"),
                                    }}
                                  >
                                    Alcance: {weapon.range}
                                  </Typography>
                                )}
                              </Box>
                            ))
                          ) : (
                            <EmptyState>Nenhuma arma equipada.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("armor") && (
                      <OverviewPanel
                        title="Armaduras"
                        subtitle="Proteção equipada"
                        icon={<DefenseIcon />}
                        accent={getColor("armor")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "grid", gap: 0.85}}>
                          {(character.armaduras || []).length > 0 ? (
                            character.armaduras.map((armor, index) => (
                              <Box
                                key={`${armor.name}-${index}`}
                                sx={{
                                  p: 1.05,
                                  borderRadius: "8px",
                                  bgcolor: "rgba(255,255,255,0.76)",
                                  border: "1px solid rgba(34, 197, 94, 0.12)",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 800,
                                      color: getColor("fontTitle"),
                                    }}
                                  >
                                    {armor.name}
                                  </Typography>
                                  <Box sx={{textAlign: "right"}}>
                                    {(parseInt(
                                      armor.defense || armor.def,
                                      10,
                                    ) || 0) > 0 && (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 900,
                                          color: "#166534",
                                          fontSize: "1rem",
                                        }}
                                      >
                                        Def +{armor.defense || armor.def}
                                      </Typography>
                                    )}
                                    {(parseInt(armor.parry || armor.ap, 10) ||
                                      0) > 0 && (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 900,
                                          color: "#15803d",
                                          fontSize: "1rem",
                                        }}
                                      >
                                        Aparar +{armor.parry || armor.ap}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <EmptyState>Nenhuma armadura equipada.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("edges") && (
                      <OverviewPanel
                        title="Vantagens"
                        subtitle="Benefícios permanentes ativos"
                        icon={<TraitIcon />}
                        accent={getColor("edges")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.7}}>
                          {(character.vantagens || []).length > 0 ? (
                            character.vantagens.map((item, index) => (
                              <Tooltip
                                key={`${item.name}-${index}`}
                                title={
                                  item.description ||
                                  EDGE_DESCRIPTION_MAP[item.name] ||
                                  "Sem descrição disponível."
                                }
                                arrow
                              >
                                <Chip
                                  label={item.name}
                                  sx={{
                                    bgcolor: alpha("#22c55e", 0.12),
                                    color: "#166534",
                                    fontWeight: 700,
                                  }}
                                />
                              </Tooltip>
                            ))
                          ) : (
                            <EmptyState>Nenhuma vantagem.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("hindrances") && (
                      <OverviewPanel
                        title="Complicações"
                        subtitle="Fraquezas e gatilhos da ficha"
                        icon={<TraitIcon />}
                        accent={getColor("hindrances")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.7}}>
                          {(character.complicacoes || []).length > 0 ? (
                            character.complicacoes.map((item, index) => (
                              <Tooltip
                                key={`${item.name}-${index}`}
                                title={
                                  item.description ||
                                  HINDRANCE_DESCRIPTION_MAP[item.name] ||
                                  "Sem descrição disponível."
                                }
                                arrow
                              >
                                <Chip
                                  label={item.name}
                                  sx={{
                                    bgcolor: alpha("#f59e0b", 0.12),
                                    color: "#92400e",
                                    fontWeight: 700,
                                  }}
                                />
                              </Tooltip>
                            ))
                          ) : (
                            <EmptyState>Nenhuma complicação.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("items") && (
                      <OverviewPanel
                        title="Itens"
                        subtitle="Consumíveis e utilidades"
                        icon={<InventoryIcon />}
                        accent={getColor("items")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.7}}>
                          {(character.itens || []).length > 0 ? (
                            character.itens.map((item, index) => (
                              <Chip
                                key={`${item.name}-${index}`}
                                label={item.name}
                                onDoubleClick={(e) =>
                                  handleChipDoubleClick(e, "itens", index, item)
                                }
                                title="Clique duas vezes para usar/consumir"
                                sx={{
                                  bgcolor: alpha("#64748b", 0.12),
                                  color: "#334155",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  userSelect: "none",
                                }}
                              />
                            ))
                          ) : (
                            <EmptyState>Nenhum item cadastrado.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}

                    {isCardVisible("loot") && (
                      <OverviewPanel
                        title="Espólios"
                        subtitle="Saques e recompensas"
                        icon={<WalletIcon />}
                        accent={getColor("loot")}
                        titleColor={getColor("fontTitle")}
                        subtitleColor={getColor("fontText")}
                        iconStyle={getIconStyle()}
                        compact={isCompactMode}
                        cardOpacity={getCardOpacity()}
                      >
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.7}}>
                          {(character.espolios || []).length > 0 ? (
                            character.espolios.map((item, index) => (
                              <Chip
                                key={`${item.name}-${index}`}
                                label={item.name}
                                onDoubleClick={(e) =>
                                  handleChipDoubleClick(
                                    e,
                                    "espolios",
                                    index,
                                    item,
                                  )
                                }
                                title="Clique duas vezes para usar/consumir"
                                sx={{
                                  bgcolor: alpha("#14b8a6", 0.12),
                                  color: "#0f766e",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  userSelect: "none",
                                }}
                              />
                            ))
                          ) : (
                            <EmptyState>Nenhum espólio registrado.</EmptyState>
                          )}
                        </Box>
                      </OverviewPanel>
                    )}
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Popover de Confirmação de Uso (Aba Visualizar) */}
          <Popover
            open={Boolean(useItemAnchor)}
            anchorEl={useItemAnchor}
            onClose={() => setUseItemAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{p: 2}}>
              <Typography sx={{mb: 2, fontWeight: 600}}>
                Usar {chipItemToUse?.item?.name}?
              </Typography>
              <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
                <Button size="small" onClick={() => setUseItemAnchor(null)}>
                  Não
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleConfirmChipUse}
                >
                  Sim
                </Button>
              </Box>
            </Box>
          </Popover>
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
                    disabled={isFieldLocked("nome")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("nome", e.target.value)
                    }
                    placeholder="Ex: Sung Jinwoo"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Jogador"
                    value={character.jogador || ""}
                    disabled={isFieldLocked("jogador")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("jogador", e.target.value)
                    }
                    placeholder="Nome do jogador"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    fullWidth
                    label="Conceito"
                    value={character.conceito || ""}
                    disabled={isFieldLocked("conceito")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("conceito", e.target.value)
                    }
                    placeholder="Ex: Guerreiro prudente"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Arquétipo</InputLabel>
                    <StyledSelect
                      disabled={isFieldLocked("arquetipo")}
                      value={character.arquetipo || ""}
                      label="Arquétipo"
                      onChange={(e) =>
                        updateAttributeIfAllowed("arquetipo", e.target.value)
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
                    disabled={isFieldLocked("guilda")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("guilda", e.target.value)
                    }
                    placeholder="Ex: Hunter's Association"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Rank</InputLabel>
                    <StyledSelect
                      disabled={isFieldLocked("rank")}
                      value={character.rank || "Novato"}
                      label="Rank"
                      onChange={(e) =>
                        updateAttributeIfAllowed("rank", e.target.value)
                      }
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
                    disabled={isFieldLocked("xp")}
                    onChange={(e) =>
                      updateAttributeIfAllowed(
                        "xp",
                        parseInt(e.target.value) || 0,
                      )
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
                    disabled={isFieldLocked("riqueza")}
                    onChange={(e) =>
                      updateAttributeIfAllowed(
                        "riqueza",
                        parseInt(e.target.value) || 0,
                      )
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
                    disabled={isFieldLocked("idade")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("idade", e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Altura"
                    value={character.altura || ""}
                    disabled={isFieldLocked("altura")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("altura", e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Peso"
                    value={character.peso || ""}
                    disabled={isFieldLocked("peso")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("peso", e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Cabelos"
                    value={character.cabelos || ""}
                    disabled={isFieldLocked("cabelos")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("cabelos", e.target.value)
                    }
                    size="small"
                    placeholder="Curto / Castanho"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Olhos"
                    value={character.olhos || ""}
                    disabled={isFieldLocked("olhos")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("olhos", e.target.value)
                    }
                    size="small"
                    placeholder="Brilhantes"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <StyledTextField
                    fullWidth
                    label="Pele"
                    value={character.pele || ""}
                    disabled={isFieldLocked("pele")}
                    onChange={(e) =>
                      updateAttributeIfAllowed("pele", e.target.value)
                    }
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
                          disabled={isFieldLocked(attr.key)}
                          value={character[attr.key] || "d4"}
                          label={attr.label}
                          onChange={(e) =>
                            updateAttributeIfAllowed(attr.key, e.target.value)
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
                      disabled={isFieldLocked("descricao")}
                      onChange={(e) =>
                        updateAttributeIfAllowed("descricao", e.target.value)
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
                      disabled={imgLoading || isFieldLocked("imagem_url")}
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
      {tabValue === 2 && (
        <AwakeningSection
          character={character}
          updateAttribute={updateAttributeIfAllowed}
          addItemToList={(listName, item) =>
            addItemToListIfAllowed("recursos_despertar", listName, item)
          }
          updateListItem={(listName, index, item) =>
            updateListItemIfAllowed("recursos_despertar", listName, index, item)
          }
          isFieldLocked={isFieldLocked}
        />
      )}

      {/* TAB 3: COMBATE */}
      {tabValue === 3 && (
        <CombatList
          character={character}
          updateAttribute={updateAttributeIfAllowed}
          isFieldLocked={isFieldLocked}
        />
      )}

      {/* TAB 4: HABILIDADES (PERÍCIAS + VANTAGENS + COMPLICAÇÕES) */}
      {tabValue === 4 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
          <Grid container spacing={2}>
            {/* COLUNA 1: PERÍCIAS */}
            <Grid item xs={12} md={4}>
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
                  <h3 style={{margin: "0", fontSize: "1.1rem"}}>🎯 Perícias</h3>
                  <Tooltip title="Custo: 1 ponto por dado até o atributo chave. 2 pontos por dado acima.">
                    <PointsBadge>{skillPointsSpent}/12 pts</PointsBadge>
                  </Tooltip>
                </Box>

                <Alert
                  severity="info"
                  sx={{mb: 2, py: 0, px: 2, fontSize: "0.8rem"}}
                >
                  Acima do atributo custa 2 pts.
                </Alert>

                <SkillsList
                  disabled={isFieldLocked("pericias")}
                  items={character?.pericias?.map((p) => {
                    const attrKey = getSkillAttribute(p.name);
                    const attrDie = character[attrKey] || "d4";
                    const pVal = parseInt((p.die || "d4").replace("d", ""), 10);
                    const aVal = parseInt(attrDie.replace("d", ""), 10);
                    const isHigher = pVal > aVal;
                    return {
                      ...p,
                      style: isHigher
                        ? {backgroundColor: "#fff3e0"}
                        : undefined,
                      dieColor: isHigher ? "#d32f2f" : "#667eea",
                      attributeShort: attrKey
                        ? attrKey.substring(0, 3).toUpperCase()
                        : "",
                    };
                  })}
                  onAdd={(item) => {
                    if (isFieldLocked("pericias")) return;
                    const idx = (character.pericias || []).findIndex(
                      (p) => p.name === item.name,
                    );
                    if (idx >= 0) {
                      removeItemFromListIfAllowed("pericias", "pericias", idx);
                    }
                    addItemToListIfAllowed("pericias", "pericias", item);
                  }}
                  onRemove={(idx) =>
                    removeItemFromListIfAllowed("pericias", "pericias", idx)
                  }
                  addButtonLabel="+ "
                />
              </Box>
            </Grid>

            {/* COLUNA 2: VANTAGENS */}
            <Grid item xs={12} md={4}>
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
                  disabled={isFieldLocked("vantagens")}
                  items={(character.vantagens || []).map((v) => {
                    const edge = EDGES.find((e) => e.name === v.name);
                    return edge ? {...edge, ...v} : v;
                  })}
                  availableOptions={availableEdges}
                  onAdd={(item) =>
                    addItemToListIfAllowed("vantagens", "vantagens", item)
                  }
                  onRemove={(idx) =>
                    removeItemFromListIfAllowed("vantagens", "vantagens", idx)
                  }
                  onUpdate={(idx, item) =>
                    updateListItemIfAllowed("vantagens", "vantagens", idx, item)
                  }
                />
              </Box>
            </Grid>

            {/* COLUNA 3: COMPLICAÇÕES */}
            <Grid item xs={12} md={4}>
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
                  disabled={isFieldLocked("complicacoes")}
                  items={(character.complicacoes || []).map((c) => {
                    const hind = HINDRANCES.find((h) => h.name === c.name);
                    return hind ? {...hind, ...c} : c;
                  })}
                  onAdd={(item) =>
                    addItemToListIfAllowed("complicacoes", "complicacoes", item)
                  }
                  onRemove={(idx) =>
                    removeItemFromListIfAllowed(
                      "complicacoes",
                      "complicacoes",
                      idx,
                    )
                  }
                  onUpdate={(idx, item) =>
                    updateListItemIfAllowed(
                      "complicacoes",
                      "complicacoes",
                      idx,
                      item,
                    )
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 6: EQUIPAMENTOS (2x2 Grid) */}
      {tabValue === 5 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
          <Grid container spacing={2}>
            {/* ARMAS - Superior esquerdo */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                ⚔️ Armas
              </h3>
              <WeaponsList
                disabled={isFieldLocked("armas")}
                items={character.armas || []}
                onAdd={(item) => addItemToListIfAllowed("armas", "armas", item)}
                onRemove={(idx) =>
                  removeItemFromListIfAllowed("armas", "armas", idx)
                }
                onUpdate={(idx, item) =>
                  updateListItemIfAllowed("armas", "armas", idx, item)
                }
              />
            </Grid>

            {/* ITENS - Superior direito */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                🎒 Itens
              </h3>
              <ItemsList
                disabled={isFieldLocked("itens")}
                items={character.itens || []}
                onAdd={(item) => addItemToListIfAllowed("itens", "itens", item)}
                onRemove={(idx) =>
                  removeItemFromListIfAllowed("itens", "itens", idx)
                }
                onUpdate={(idx, item) =>
                  updateListItemIfAllowed("itens", "itens", idx, item)
                }
                onUse={(idx, item) => handleUseItem("itens", idx, item)}
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
                disabled={isFieldLocked("armaduras")}
                items={character.armaduras || []}
                onAdd={(item) =>
                  addItemToListIfAllowed("armaduras", "armaduras", item)
                }
                onRemove={(idx) =>
                  removeItemFromListIfAllowed("armaduras", "armaduras", idx)
                }
                onUpdate={(idx, item) =>
                  updateListItemIfAllowed("armaduras", "armaduras", idx, item)
                }
                addButtonLabel="+ "
              />
            </Grid>

            {/* ESPÓLIOS - Inferior direito */}
            <Grid item xs={12} md={6}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                💎 Espólios
              </h3>
              <EspoliosList
                disabled={isFieldLocked("espolios")}
                items={character.espolios || []}
                onAdd={(item) =>
                  addItemToListIfAllowed("espolios", "espolios", item)
                }
                onRemove={(idx) =>
                  removeItemFromListIfAllowed("espolios", "espolios", idx)
                }
                onUpdate={(idx, item) =>
                  updateListItemIfAllowed("espolios", "espolios", idx, item)
                }
                onUse={(idx, item) => handleUseItem("espolios", idx, item)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 7: PODERES (Magias) */}
      {tabValue === 6 && (
        <Box sx={{background: "#fff", borderRadius: 2, p: 2, pb: 10}}>
          <Grid container spacing={2}>
            {/* MAGIAS - Coluna esquerda */}
            <Grid item xs={12}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "1.1rem"}}>
                🔮 Magias
              </h3>
              <MagiasList
                disabled={isFieldLocked("magias")}
                items={character.magias || []}
                onAdd={(item) =>
                  addItemToListIfAllowed("magias", "magias", item)
                }
                availableOptions={availablePowers}
                onRemove={(idx) =>
                  removeItemFromListIfAllowed("magias", "magias", idx)
                }
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 8: NOTAS */}
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
            disabled={isFieldLocked("notas")}
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
            onChange={(e) => updateAttributeIfAllowed("notas", e.target.value)}
            placeholder="Adicione suas anotações aqui..."
          />
        </Box>
      )}

      {/* TAB 8: CONFIG (CORES) */}
      {tabValue === 8 && (
        <Box
          sx={{
            background: "#fff",
            borderRadius: 2,
            p: 2,
            pb: 20, // Aumentado bastante para evitar overlap com footer fixo
            minHeight: "80vh",
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                🎨 Personalização da Ficha
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Escolha as cores de destaque para os cards da aba Visualizar.
              </Typography>
            </Box>
            <Button
              startIcon={<ResetIcon />}
              color="error"
              variant="outlined"
              size="small"
              onClick={() => {
                if (
                  confirm(
                    "Deseja restaurar todas as cores para o padrão original?",
                  )
                ) {
                  const allDefaults = {
                    ...DEFAULT_COLORS,
                    ...DEFAULT_FONT_COLORS,
                  };
                  updateAttribute("sheetColors", allDefaults);
                }
              }}
            >
              Restaurar Padrões
            </Button>
          </Box>

          <Grid
            container
            spacing={2}
            alignItems="flex-start" // Evita que os cards estiquem para preencher a altura da linha
          >
            {/* Coluna 1: Aparência Geral */}
            <Grid item xs={12} md={6}>
              <ConfigCard
                title="Layout & Visibilidade"
                icon={<DashboardCustomizeIcon />}
              >
                <Grid container spacing={2}>
                  {/* Visibilidade de Cards */}
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#94a3b8",
                        display: "block",
                      }}
                    >
                      Exibir/Ocultar Cards
                    </Typography>
                    <FormGroup row sx={{gap: 1}}>
                      {[
                        {key: "portrait", label: "Retrato"},
                        {key: "skills", label: "Perícias"},
                        {key: "resources", label: "Recursos"},
                        {key: "spells", label: "Magias"},
                        {key: "weapons", label: "Armas"},
                        {key: "armor", label: "Armaduras"},
                        {key: "edges", label: "Vantagens"},
                        {key: "hindrances", label: "Complicações"},
                        {key: "items", label: "Itens"},
                        {key: "loot", label: "Espólios"},
                        {key: "notes", label: "Notas"},
                      ].map((item) => (
                        <FormControlLabel
                          key={item.key}
                          control={
                            <Switch
                              size="small"
                              checked={isCardVisible(item.key)}
                              onChange={() => toggleCardVisibility(item.key)}
                            />
                          }
                          label={
                            <Typography variant="caption">
                              {item.label}
                            </Typography>
                          }
                          sx={{width: "48%", mr: 0, ml: 0}}
                        />
                      ))}
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{my: 1}} />
                  </Grid>

                  {/* Outras Configurações Úteis */}
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#94a3b8",
                        display: "block",
                      }}
                    >
                      Preferências de Layout
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isCompactMode}
                            onChange={() =>
                              updateAttribute("sheetPreferences", {
                                ...character.sheetPreferences,
                                compactMode: !isCompactMode,
                              })
                            }
                          />
                        }
                        label="Modo Compacto (Reduz espaçamentos)"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{my: 1}} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#94a3b8",
                        display: "block",
                      }}
                    >
                      Fundo da Tela
                    </Typography>
                    <ColorPickerItem
                      label="Cor de Fundo Principal"
                      value={customBackground || "#f3ecdc"}
                      onChange={(val) =>
                        updateAttribute("sheetColors", {
                          ...character.sheetColors,
                          background: val,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </ConfigCard>
            </Grid>

            {/* Coluna 2: Cores dos Cards e Fontes */}
            <Grid item xs={12} md={6}>
              <ConfigCard
                title="Cores dos Cards & Textos"
                icon={<PaletteIcon />}
              >
                <Grid container spacing={1}>
                  {/* Controle Mestre */}
                  <Grid item xs={12}>
                    <ColorPickerItem
                      label="Definir todos os cards"
                      value=""
                      onChange={(color) => {
                        const newColors = {...(character.sheetColors || {})};
                        Object.keys(DEFAULT_COLORS).forEach((key) => {
                          if (
                            ![
                              "widgetBackground",
                              "widgetTitle",
                              "widgetText",
                              "widgetAux",
                              "widgetIcon",
                              "footerBackground",
                              "footerText",
                              "footerIcon",
                              "footerButtonBg",
                            ].includes(key)
                          ) {
                            newColors[key] = color;
                          }
                        });
                        updateAttribute("sheetColors", newColors);
                      }}
                    />
                    <Divider sx={{mb: 2}} />
                  </Grid>

                  {/* Fontes Específicas */}
                  <Grid item xs={12} sm={6}>
                    <ColorPickerItem
                      label="Nome do Personagem"
                      value={getColor("fontName")}
                      onChange={(val) =>
                        updateAttribute("sheetColors", {
                          ...character.sheetColors,
                          fontName: val,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerItem
                      label="Título do Card"
                      value={getColor("fontTitle")}
                      onChange={(val) =>
                        updateAttribute("sheetColors", {
                          ...character.sheetColors,
                          fontTitle: val,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ColorPickerItem
                      label="Título do Personagem (Novato • Classe...)"
                      value={getColor("fontIdentity")}
                      onChange={(val) =>
                        updateAttribute("sheetColors", {
                          ...character.sheetColors,
                          fontIdentity: val,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      sx={{fontWeight: 600, display: "block", mb: 0.5}}
                    >
                      Opacidade dos Cards
                    </Typography>
                    <Slider
                      size="small"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={getCardOpacity()}
                      onChange={(_, val) =>
                        updateAttribute("sheetColors", {
                          ...character.sheetColors,
                          cardOpacity: val,
                        })
                      }
                      valueLabelDisplay="auto"
                      sx={{width: "95%", mx: 1}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{my: 1, borderStyle: "dashed"}}>
                      <Typography variant="caption">Temas dos Cards</Typography>
                    </Divider>
                  </Grid>

                  {/* Individual Card Colors */}
                  {Object.entries(DEFAULT_COLORS).map(([key, defaultColor]) => {
                    if (
                      [
                        "widgetBackground",
                        "widgetTitle",
                        "widgetText",
                        "widgetAux",
                        "widgetIcon",
                        "footerBackground",
                        "footerText",
                        "footerIcon",
                        "footerButtonBg",
                      ].includes(key)
                    )
                      return null;

                    return (
                      <Grid item xs={4} sm={3} key={key}>
                        <ColorPickerItem
                          label={CONFIG_LABELS[key] || key}
                          value={getColor(key)}
                          onChange={(val) =>
                            updateAttribute("sheetColors", {
                              ...character.sheetColors,
                              [key]: val,
                            })
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </ConfigCard>
            </Grid>

            {/* Coluna 3: Widgets & Texto Auxiliar */}
            <Grid item xs={12} md={6}>
              <ConfigCard
                title="Widgets (Status Pequenos)"
                icon={<WidgetsIcon />}
              >
                <Grid container spacing={1}>
                  {[
                    {key: "widgetBackground", label: "Fundo"},
                    {key: "widgetTitle", label: "Título"},
                    {key: "widgetText", label: "Texto"},
                    {key: "widgetAux", label: "Texto Auxiliar"},
                    {key: "widgetIcon", label: "Ícone"},
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.key}>
                      <ColorPickerItem
                        label={item.label}
                        value={getColor(item.key)}
                        onChange={(val) =>
                          updateAttribute("sheetColors", {
                            ...character.sheetColors,
                            [item.key]: val,
                          })
                        }
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Divider sx={{my: 1.5}} />
                    <Typography
                      variant="subtitle2"
                      sx={{mb: 1, fontWeight: 700, color: "#334155"}}
                    >
                      Transparência
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      sx={{fontWeight: 600, display: "block", mb: 0.5}}
                    >
                      Opacidade dos Widgets
                    </Typography>
                    <Slider
                      size="small"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={getWidgetOpacity()}
                      onChange={(_, val) =>
                        updateAttribute("sheetColors", {
                          ...character.sheetColors,
                          widgetOpacity: val,
                        })
                      }
                      valueLabelDisplay="auto"
                      sx={{width: "95%", mx: 1}}
                    />
                  </Grid>
                </Grid>
              </ConfigCard>
            </Grid>

            {/* Coluna 4: Barra Fixa (Footer/Header) */}
            <Grid item xs={12} md={6}>
              <ConfigCard
                title="Barra de Navegação Inferior"
                icon={<FooterIcon />}
              >
                <Typography variant="caption" color="text.secondary" paragraph>
                  Configurações para a barra de navegação fixa inferior.
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Estilo</InputLabel>
                      <Select
                        value={
                          character.sheetPreferences?.footerStyle || "solid"
                        }
                        label="Estilo"
                        onChange={(e) =>
                          updateAttribute("sheetPreferences", {
                            ...character.sheetPreferences,
                            footerStyle: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="solid">Sólido</MenuItem>
                        <MenuItem value="dual">Duas Cores</MenuItem>
                        <MenuItem value="gradient">Gradiente</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {(() => {
                    const footerStyle =
                      character.sheetPreferences?.footerStyle || "solid";
                    const isDual =
                      footerStyle === "dual" || footerStyle === "gradient";

                    const inputList = [
                      {
                        key: "footerBackground",
                        label: isDual ? "Fundo 1" : "Fundo",
                      },
                      ...(isDual
                        ? [{key: "footerBackground2", label: "Fundo 2"}]
                        : []),
                      {key: "footerButtonBg", label: "Fundo Botões"},
                      {key: "footerText", label: "Texto/Ícones"},
                      {key: "footerHover", label: "Hover/Botões"},
                    ];

                    return inputList.map((item) => (
                      <Grid item xs={12} sm={6} key={item.key}>
                        <ColorPickerItem
                          label={item.label}
                          value={getColor(item.key)}
                          onChange={(val) =>
                            updateAttribute("sheetColors", {
                              ...character.sheetColors,
                              [item.key]: val,
                            })
                          }
                        />
                      </Grid>
                    ));
                  })()}
                </Grid>
              </ConfigCard>
            </Grid>

            {/* Coluna 6: Ícones */}
            <Grid item xs={12} md={6}>
              <ConfigCard title="Estilo dos Ícones" icon={<StyleIcon />}>
                <Grid container spacing={1} alignItems="center">
                  {/* Tamanho */}
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      sx={{mb: 1, display: "block"}}
                    >
                      Tamanho (Escala)
                    </Typography>
                    <Box sx={{px: 1}}>
                      <Slider
                        size="small"
                        min={0.8}
                        max={1.5}
                        step={0.1}
                        value={parseFloat(character.sheetColors?.iconSize || 1)}
                        onChange={(_, val) =>
                          updateAttribute("sheetColors", {
                            ...(character.sheetColors || {}),
                            iconSize: val,
                          })
                        }
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Grid>

                  {/* Cores Específicas */}
                  {[
                    {key: "iconColor", label: "Cor do Ícone"},
                    {key: "iconBorder", label: "Cor da Borda"},
                    {key: "iconFill", label: "Preenchimento"},
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.key}>
                      <ColorPickerItem
                        label={item.label}
                        value={getColor(item.key)}
                        onChange={(val) =>
                          updateAttribute("sheetColors", {
                            ...character.sheetColors,
                            [item.key]: val,
                          })
                        }
                        onReset={() => {
                          const newColors = {...character.sheetColors};
                          delete newColors[item.key];
                          updateAttribute("sheetColors", newColors);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </ConfigCard>
            </Grid>
          </Grid>
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
