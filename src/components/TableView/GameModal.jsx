/**
 * GameModal Component
 * Painel de Jogo (Dashboard da Sessão)
 */

"use client";

import {
  PersonAdd as AddNpcIcon,
  Medication as AntidoteIcon,
  Pets as BestiaryIcon,
  LocalFireDepartment as BurnIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Dangerous as CorruptionIcon,
  LocalHospital as DamageIcon,
  ExpandMore as ExpandMoreIcon,
  BatteryAlert as FatigueIcon,
  AttachFile as FileIcon,
  AcUnit as FrozenIcon,
  Security as GmIcon,
  Group as GroupIcon,
  Healing as HealIcon,
  LocalPharmacy as HealthPotionIcon,
  HelpOutline as HelpOutlineIcon,
  Info as InfoIcon,
  LocalDrink as ManaPotionIcon,
  MenuBook as MenuBookIcon,
  Message as MessageIcon,
  Help as OtherStatusIcon,
  PanTool as ParalyzedIcon,
  PersonRemove as PersonRemoveIcon,
  PlayArrow as PlayIcon,
  Science as PoisonIcon,
  Spa as PurifyIcon,
  EmojiEvents as QuestIcon,
  AutoFixHigh as RecalculateIcon,
  Bed as RestIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
  Description as SheetIcon,
  Hotel as SleepIcon,
  Star as StarIcon,
  Stop as StopIcon,
  FlashOn as StunIcon,
  SwapHoriz as SwitchTableIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import BestiaryView from "@/components/BestiaryView";
import MonsterCard from "@/components/BestiaryView/MonsterCard";
import BookView from "@/components/BookView";
import GameFileManager from "@/components/GameFileManager";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks";
import APIService from "@/lib/api";
import {
  getCharacterStatusEffects,
  toggleCharacterStatusEffect,
} from "@/lib/characterStatus";
import { db } from "@/lib/firebase";
import { calculateMaxMana } from "@/lib/rpgEngine";
import * as ScenarioService from "@/lib/scenarioService.js";
import {
  getTableGameSession,
  SHEET_LOCK_GROUPS,
  SHEET_LOCK_KEYS,
} from "@/lib/sheetLocks";
import { useCharacterStore, useUIStore } from "@/stores/characterStore";
import ChatModal from "../Messages/ChatModal";
import InspectSheetModal from "./InspectSheetModal";
import QuestBoard from "./QuestBoard";

const TRACKED_STATUSES = [
  { label: "Envenenado", icon: PoisonIcon, color: "#4caf50" },
  { label: "Paralisado", icon: ParalyzedIcon, color: "#ffb74d" },
  { label: "Congelado", icon: FrozenIcon, color: "#29b6f6" },
  { label: "Queimado", icon: BurnIcon, color: "#d32f2f" },
];

// Helper para determinar o ícone de presença no Avatar
const getPresenceBadgeIcon = (status) => {
  if (status === "confirmed") {
    return (
      <CheckCircleIcon
        sx={{
          width: 16,
          height: 16,
          color: "#4caf50",
          bgcolor: "white",
          borderRadius: "50%",
        }}
      />
    );
  }
  if (status === "declined") {
    return (
      <CancelIcon
        sx={{
          width: 16,
          height: 16,
          color: "#f44336",
          bgcolor: "white",
          borderRadius: "50%",
        }}
      />
    );
  }
  return null;
};

// Sub-componente para item da lista de jogadores com listener em tempo real
const PlayerListItem = ({ player, isGMView, presenceStatus, onClick }) => {
  const [charData, setCharData] = useState(null);

  useEffect(() => {
    let unsub;

    // Caso 1: ID da ficha já está vinculado na mesa (Prioridade)
    if (player.characterId) {
      unsub = onSnapshot(
        doc(db, "characters", player.characterId),
        (docSnap) => {
          if (docSnap.exists()) {
            setCharData(docSnap.data());
          }
        },
        (error) => console.error("Erro ao ler ficha:", error),
      );
    }
    // Caso 2: Tenta buscar pelo UID do jogador (Fallback para quem não vinculou manualmente)
    else if (player.uid && !player.isNpc) {
      const q = query(
        collection(db, "characters"),
        where("userId", "==", player.uid),
        limit(1),
      );
      unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            setCharData(snapshot.docs[0].data());
          } else {
            setCharData(null);
          }
        },
        (error) => console.error("Erro ao buscar ficha por UID:", error),
      );
    }

    return () => unsub?.();
  }, [player.characterId, player.uid, player.isNpc]);

  const avatarSrc =
    charData?.imagem_url ||
    (player.photoURL?.includes("googleusercontent.com")
      ? player.photoURL.replace("=s96-c", "=s100-c")
      : player.photoURL);

  // Formatar nome: Apenas os dois primeiros nomes
  const displayName = player.name
    ? player.name.split(" ").slice(0, 2).join(" ")
    : "Sem Nome";

  const maxMana = charData ? calculateMaxMana(charData) : 0;
  const currentMana =
    charData?.mana_atual !== undefined ? charData.mana_atual : maxMana;
  const wounds = charData?.ferimentos || 0;
  const fatigue = charData?.fadiga || 0;
  const corruption = charData?.corrupcao || 0;
  const isShaken = charData?.abalado || false;
  const statusEffects = getCharacterStatusEffects(charData || {});

  // Limites SWADE: 3 Ferimentos (4 = Incap), 2 Fadiga (3 = Incap)
  const isDead = wounds > 3; // Ajustado para ser considerado "Morto/Incap" visualmente acima de 3

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        minHeight: 60,
        display: "flex",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "#f5f7fa",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        },
        border: "1px solid #e0e0e0",
      }}
      onClick={(e) =>
        onClick(e, player, { isShaken, wounds, fatigue, corruption })
      }
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={getPresenceBadgeIcon(presenceStatus)}
        sx={{ "& .MuiBadge-badge": { p: 0, minWidth: "auto", height: "auto" } }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            player.isGM ? (
              <GmIcon
                sx={{
                  width: 14,
                  height: 14,
                  color: "#f57c00",
                  bgcolor: "white",
                  borderRadius: "50%",
                }}
              />
            ) : null
          }
        >
          <Avatar
            src={avatarSrc}
            alt={player.name}
            sx={{ width: 40, height: 40 }}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
        </Badge>
      </Badge>

      <Grid container alignItems="center">
        <Grid item xs={player.isGM ? 12 : 3}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {player.isGM ? displayName : charData?.nome || "Sem Personagem"}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {player.isGM ? "Game Master" : displayName}
          </Typography>
        </Grid>
        {!player.isGM && (
          <Grid
            item
            xs={9}
            sx={{ textAlign: "right", fontSize: "0.7rem", lineHeight: 1.3 }}
          >
            {isDead ? (
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "900",
                  bgcolor: "#212121",
                  p: 0.5,
                  borderRadius: 1,
                  textAlign: "center",
                  fontSize: "0.7rem",
                }}
              >
                MORTO 💀
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                {/* Abalado */}
                <Box
                  title="Abalado"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: isShaken ? "#d97706" : "#e0e0e0",
                  }}
                >
                  <StunIcon sx={{ fontSize: 30 }} />
                </Box>

                {/* Ferimentos */}
                <Box
                  title="Ferimentos"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    color: wounds > 0 ? "#d32f2f" : "#bdbdbd",
                    fontWeight: "700",
                  }}
                >
                  {wounds} <DamageIcon sx={{ fontSize: 30 }} />
                </Box>

                {/* Fadiga */}
                <Box
                  title="Fadiga"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    color: fatigue > 0 ? "#ed6c02" : "#bdbdbd",
                    fontWeight: "700",
                  }}
                >
                  {fatigue} <FatigueIcon sx={{ fontSize: 30 }} />
                </Box>

                {/* Corrupção */}
                <Box
                  title="Corrupção"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    color: corruption > 0 ? "#7b1fa2" : "#bdbdbd",
                    fontWeight: "700",
                  }}
                >
                  {corruption} <CorruptionIcon sx={{ fontSize: 30 }} />
                </Box>

                {/* Mana */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#1976d2",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                  }}
                >
                  {currentMana}/{maxMana}{" "}
                  <span style={{ fontSize: "1.5em", lineHeight: 1 }}>🌀</span>
                </Box>

                {/* Divisor */}
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 0.5, bgcolor: "rgba(0,0,0,0.12)", height: "auto" }}
                />

                {/* Status Fixos (Cinza se inativo, Colorido se ativo) */}
                {TRACKED_STATUSES.map(({ label, icon: Icon, color }) => {
                  const isActive = statusEffects.includes(label);
                  return (
                    <Box
                      key={label}
                      title={label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: isActive ? color : "#e0e0e0",
                      }}
                    >
                      <Icon sx={{ fontSize: 30 }} />
                    </Box>
                  );
                })}

                {/* Status Extras (Customizados) */}
                {statusEffects
                  .filter(
                    (eff) => !TRACKED_STATUSES.some((t) => t.label === eff),
                  )
                  .map((effect) => (
                    <Box
                      key={effect}
                      title={effect}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9c27b0",
                      }}
                    >
                      <OtherStatusIcon sx={{ fontSize: 30 }} />
                    </Box>
                  ))}
              </Box>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

function GameModal() {
  const {
    selectedTable,
    showNotification,
    toggleTableDetailsModal,
    setSelectedTable,
    inspectModalOpen,
    toggleInspectModal,
    chatOpen,
    toggleChat,
    openChatWith,
    activeScenarioId,
  } = useUIStore();
  const { setInspectedCharacter } = useCharacterStore();
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerStatus, setSelectedPlayerStatus] = useState({});
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuType, setSubmenuType] = useState(null);
  const [tertiaryAnchorEl, setTertiaryAnchorEl] = useState(null);
  const [tertiaryType, setTertiaryType] = useState(null);
  const [customEffectModalOpen, setCustomEffectModalOpen] = useState(false);
  const [customEffectText, setCustomEffectText] = useState("");
  const [activeQuests, setActiveQuests] = useState([]);

  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [loadingFriend, setLoadingFriend] = useState(false);

  const [monsterModalOpen, setMonsterModalOpen] = useState(false);
  const [selectedMonsterData, setSelectedMonsterData] = useState(null);
  const [loadingMonster, setLoadingMonster] = useState(false);

  // Estados para NPC e Troca de Mesa
  const [npcModalOpen, setNpcModalOpen] = useState(false);
  const [myCharacters, setMyCharacters] = useState([]);
  const [loadingNpcs, setLoadingNpcs] = useState(false);
  const [tablesMenuAnchor, setTablesMenuAnchor] = useState(null);
  const [myTables, setMyTables] = useState([]);
  const [mobileTab, setMobileTab] = useState(0);
  const [panelTab, setPanelTab] = useState(0);
  const [gameSettingsOpen, setGameSettingsOpen] = useState(false);
  const [selectedGameLocks, setSelectedGameLocks] = useState([]);
  const [savingGameSettings, setSavingGameSettings] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(true);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [scenarioLoreSections, setScenarioLoreSections] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isGM = Boolean(
    selectedTable?.gmId && user?.uid && selectedTable.gmId === user.uid,
  );
  const gameSession = selectedTable
    ? getTableGameSession(selectedTable)
    : { isActive: false, lockedFields: [] };
  const lockedFieldsCount = gameSession.lockedFields?.length || 0;

  // Efeito para exclusividade: Livro
  useEffect(() => {
    if (isBookOpen) {
      if (inspectModalOpen) toggleInspectModal();
      if (chatOpen) toggleChat();
      if (isBestiaryOpen) setIsBestiaryOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBookOpen]);

  // Efeito para exclusividade: Bestiário
  useEffect(() => {
    if (isBestiaryOpen) {
      if (inspectModalOpen) toggleInspectModal();
      if (chatOpen) toggleChat();
      if (isBookOpen) setIsBookOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBestiaryOpen]);

  // Efeito para exclusividade: Ficha
  useEffect(() => {
    if (inspectModalOpen) {
      if (isBookOpen) setIsBookOpen(false);
      if (isBestiaryOpen) setIsBestiaryOpen(false);
      if (chatOpen) toggleChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectModalOpen]);

  // Efeito para exclusividade: Chat
  useEffect(() => {
    if (chatOpen) {
      if (isBookOpen) setIsBookOpen(false);
      if (isBestiaryOpen) setIsBestiaryOpen(false);
      if (inspectModalOpen) toggleInspectModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen]);

  // Efeito para fechar o livro ou a ficha ao pressionar Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isBookOpen) setIsBookOpen(false);
        else if (isBestiaryOpen) setIsBestiaryOpen(false);
        else if (inspectModalOpen) toggleInspectModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBookOpen, isBestiaryOpen, inspectModalOpen, toggleInspectModal]);

  // Efeito para sincronização em tempo real e verificação de segurança
  useEffect(() => {
    if (!selectedTable?._id || !user) return;

    const tableRef = doc(db, "tables", selectedTable._id);

    const unsubscribe = onSnapshot(
      tableRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setSelectedTable(null);
          return;
        }

        const data = { _id: docSnap.id, ...docSnap.data() };

        // VERIFICAÇÃO: O usuário ainda tem permissão para ver a mesa?
        const isUserGM = data.gmId === user.uid;
        const isUserPlayer = data.playerIds?.includes(user.uid);

        if (!isUserGM && !isUserPlayer) {
          setSelectedTable(null);
          return;
        }

        // Atualiza os dados da mesa em tempo real (jogadores, arquivos, etc)
        setSelectedTable(data);
      },
      (error) => {
        console.error("Erro ao sincronizar mesa:", error);
        if (error.code === "permission-denied") {
          setSelectedTable(null);
        }
      },
    );

    return () => unsubscribe();
  }, [selectedTable?._id, user, setSelectedTable, showNotification]);

  // Efeito para sincronizar Quests Ativas em tempo real
  useEffect(() => {
    if (!selectedTable?._id) return;

    const q = query(
      collection(db, "tables", selectedTable._id, "quests"),
      where("isActive", "==", true),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const quests = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        // Ordena pela data de criação decrescente (a mais nova fica no índice 0)
        quests.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
        setActiveQuests(quests);
      },
      (error) => console.error("Erro ao buscar quests ativas:", error),
    );

    return () => unsubscribe();
  }, [selectedTable?._id]);

  // Efeito para carregar loreSections do cenário da mesa
  useEffect(() => {
    async function loadScenarioLore() {
      const scenarioId = selectedTable?.scenarioId || activeScenarioId;
      console.log(
        "Carregando lore para scenarioId:",
        scenarioId,
        "activeScenarioId:",
        activeScenarioId,
      );

      if (!scenarioId) {
        setScenarioLoreSections([]);
        return;
      }

      try {
        const scenarioData = await ScenarioService.getScenarioById(scenarioId);
        console.log(
          "Scenario data carregado:",
          scenarioData?.id,
          scenarioData?.loreSections?.length,
        );
        if (scenarioData?.loreSections) {
          setScenarioLoreSections(scenarioData.loreSections);
        } else {
          setScenarioLoreSections([]);
        }
      } catch (error) {
        console.error("Erro ao carregar lore do cenário:", error);
        setScenarioLoreSections([]);
      }
    }

    loadScenarioLore();
  }, [selectedTable?.scenarioId, activeScenarioId]);

  // --- Lógica de Presença na Próxima Sessão ---
  const handleTogglePresence = async () => {
    if (!selectedTable?._id || !user) return;

    let currentPresence = "pending";
    if (isGM) {
      currentPresence = selectedTable.gmPresence || "pending";
    } else {
      const me = selectedTable.players?.find((p) => p.uid === user.uid);
      if (me) currentPresence = me.presence || "pending";
    }

    // Ciclo: pending -> confirmed -> declined -> pending
    let nextPresence = "confirmed";
    if (currentPresence === "confirmed") nextPresence = "declined";
    if (currentPresence === "declined") nextPresence = "pending";

    try {
      if (isGM) {
        await APIService.updateTable(selectedTable._id, {
          gmPresence: nextPresence,
        });
      } else {
        const updatedPlayers = (selectedTable.players || []).map((p) =>
          p.uid === user.uid ? { ...p, presence: nextPresence } : p,
        );
        await APIService.updateTable(selectedTable._id, {
          players: updatedPlayers,
        });
      }
    } catch (error) {
      showNotification("Erro ao atualizar presença.", "error");
    }
  };

  const handlePlayerClick = (event, player, status = {}) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlayer(player);
    setSelectedPlayerStatus(status);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
    setSubmenuType(null);
    setTertiaryAnchorEl(null);
    setTertiaryType(null);
    setSelectedPlayer(null);
    setSelectedPlayerStatus({});
  };

  const handleOpenSubmenu = (type, event) => {
    setSubmenuAnchorEl(event.currentTarget);
    setSubmenuType(type);
  };

  const handleCloseSubmenu = () => {
    setSubmenuAnchorEl(null);
    setSubmenuType(null);
    setTertiaryAnchorEl(null);
    setTertiaryType(null);
  };

  const handleOpenTertiary = (type, event) => {
    setTertiaryAnchorEl(event.currentTarget);
    setTertiaryType(type);
  };

  const handleCloseTertiary = () => {
    setTertiaryAnchorEl(null);
    setTertiaryType(null);
  };

  const handleViewFriend = async () => {
    handleCloseMenu();
    if (!selectedPlayer) return;

    setLoadingFriend(true);
    setFriendModalOpen(true);
    try {
      showNotification("Buscando dados...", "info");
      let charData = null;

      if (selectedPlayer.characterId) {
        charData = await APIService.getCharacterById(
          selectedPlayer.characterId,
        );
      } else if (selectedPlayer.uid) {
        charData = await APIService.getCharacter(selectedPlayer.uid);
      }

      if (charData) {
        setFriendData(charData);
      } else {
        showNotification("Jogador sem ficha vinculada.", "warning");
        setFriendModalOpen(false);
      }
    } catch (error) {
      console.error("Erro ao visualizar amigo:", error);
      showNotification("Erro ao carregar dados.", "error");
      setFriendModalOpen(false);
    } finally {
      setLoadingFriend(false);
    }
  };

  const handleOpenMonsterModal = async (monsterId) => {
    setMonsterModalOpen(true);
    setLoadingMonster(true);
    setSelectedMonsterData(null);
    try {
      const docSnap = await getDocFromServer(doc(db, "monsters", monsterId));
      if (docSnap.exists()) {
        setSelectedMonsterData({ id: docSnap.id, ...docSnap.data() });
      } else {
        showNotification("Monstro não encontrado no bestiário.", "error");
        setMonsterModalOpen(false);
      }
    } catch (error) {
      console.error("Erro ao buscar monstro:", error);
      showNotification("Erro ao carregar monstro.", "error");
    } finally {
      setLoadingMonster(false);
    }
  };

  const handleViewSheet = async () => {
    handleCloseMenu();
    if (!selectedPlayer) return;

    try {
      showNotification("Buscando ficha do jogador...", "info");
      let charData = null;

      // 1. Prioridade: Buscar pelo ID da ficha vinculada à mesa
      if (selectedPlayer.characterId) {
        console.log(
          `[GameModal] Buscando ficha vinculada (ID: ${selectedPlayer.characterId})`,
        );
        charData = await APIService.getCharacterById(
          selectedPlayer.characterId,
        );
      }
      // 2. Fallback: Apenas se não houver vínculo, busca a ficha principal do usuário
      else if (selectedPlayer.uid) {
        console.log(
          `[GameModal] Jogador sem vínculo. Buscando ficha principal (UID: ${selectedPlayer.uid})`,
        );
        charData = await APIService.getCharacter(selectedPlayer.uid);
      }

      if (charData) {
        setInspectedCharacter(charData);
        if (!inspectModalOpen) toggleInspectModal();
        showNotification(
          `Visualizando ficha de ${selectedPlayer.name}`,
          "success",
        );
      } else {
        showNotification("Jogador sem ficha vinculada.", "warning");
      }
    } catch (error) {
      console.error("Erro ao visualizar ficha:", error);
      showNotification("Erro ao carregar ficha.", "error");
    }
  };

  const handleViewMySheet = async () => {
    try {
      showNotification("Buscando sua ficha...", "info");
      let charData = null;

      const myPlayerInfo = selectedTable?.players?.find(
        (p) => p.uid === user?.uid,
      );

      if (myPlayerInfo?.characterId) {
        charData = await APIService.getCharacterById(myPlayerInfo.characterId);
      } else if (user?.uid) {
        charData = await APIService.getCharacter(user.uid);
      }

      if (charData) {
        setInspectedCharacter(charData);
        if (!inspectModalOpen) toggleInspectModal();
      } else {
        showNotification("Nenhuma ficha vinculada encontrada.", "warning");
      }
    } catch (error) {
      console.error("Erro ao visualizar própria ficha:", error);
      showNotification("Erro ao carregar ficha.", "error");
    }
  };

  const handleSendMessage = () => {
    // Abre o chat definindo o destinatário (Sussurro)
    openChatWith(selectedPlayer);
    handleCloseMenu();
  };

  const handleRequestFile = () => {
    showNotification(
      `Solicitar arquivo de ${selectedPlayer?.name || "Jogador"} (Em breve)`,
      "info",
    );
    handleCloseMenu();
  };

  const handleRemovePlayer = async () => {
    if (!selectedPlayer || !selectedTable) return;

    // Case: GM's Linked Character (NPC do Mestre)
    if (selectedPlayer.isNpc && selectedPlayer.uid === selectedTable.gmId) {
      if (!confirm(`Remover o personagem do mestre da mesa?`)) {
        handleCloseMenu();
        return;
      }
      try {
        await APIService.updateTable(selectedTable._id, {
          gmCharacterId: null,
        });
        setSelectedTable({ ...selectedTable, gmCharacterId: null });
        showNotification("Personagem do mestre removido.", "info");
      } catch (error) {
        showNotification("Erro ao remover personagem.", "error");
      }
      handleCloseMenu();
      return;
    }

    if (
      !confirm(`Tem certeza que deseja remover ${selectedPlayer.name} da mesa?`)
    ) {
      handleCloseMenu();
      return;
    }

    try {
      await APIService.removePlayer(selectedTable._id, selectedPlayer.uid);

      // Atualizar estado local removendo o jogador da lista
      const updatedPlayers = selectedTable.players.filter(
        (p) => p.uid !== selectedPlayer.uid,
      );
      setSelectedTable({ ...selectedTable, players: updatedPlayers });
      showNotification(`${selectedPlayer.name} removido da mesa.`, "info");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao remover jogador.", "error");
    }
    handleCloseMenu();
  };

  // --- Ações em Massa (GM Powers) ---
  const handleMassAction = async (type) => {
    if (!selectedTable || !isGM) return;
    const confirmMsg =
      type === "mana"
        ? "Restaurar a Mana de todos os jogadores da mesa?"
        : type === "wounds"
          ? "Curar todos os ferimentos de todos os jogadores?"
          : "Remover o estado Abalado de todos os jogadores?";

    if (!confirm(confirmMsg)) return;

    setSavingGameSettings(true);
    try {
      const promises = selectedTable.players.map(async (player) => {
        if (player.isNpc) return;

        const charData = player.characterId
          ? await APIService.getCharacterById(player.characterId)
          : await APIService.getCharacter(player.uid);

        if (charData) {
          const updates = {};
          if (type === "mana") updates.mana_atual = calculateMaxMana(charData);
          if (type === "wounds") updates.ferimentos = 0;
          if (type === "shaken") updates.abalado = false;

          await APIService.saveCharacter(charData.userId, {
            ...charData,
            ...updates,
          });
        }
      });

      await Promise.all(promises);
      showNotification("Ação em massa aplicada com sucesso!", "success");
    } catch (error) {
      console.error("Erro na ação em massa:", error);
      showNotification("Erro ao processar atualização em massa.", "error");
    } finally {
      setSavingGameSettings(false);
    }
  };

  // --- Ações do GM (Refletem na Ficha) ---
  const handleGMAction = async (actionType, payload = {}) => {
    const targetPlayer = selectedPlayer;
    if (!targetPlayer) return;
    handleCloseMenu();

    // Identificar ID da ficha
    const charId = targetPlayer.characterId;
    const userId = targetPlayer.uid;

    if (!charId && !userId) {
      showNotification("Jogador sem ficha vinculada.", "warning");
      return;
    }

    try {
      showNotification("Aplicando ação...", "info");
      // Buscar ficha atualizada
      const charData = charId
        ? await APIService.getCharacterById(charId)
        : await APIService.getCharacter(userId);

      if (!charData) throw new Error("Ficha não encontrada.");

      const updates = {};
      const maxMana = calculateMaxMana(charData);
      const currentMana =
        charData.mana_atual !== undefined ? charData.mana_atual : maxMana;
      const healingTier = Math.max(1, Math.ceil((payload.amount || 5) / 5));

      switch (actionType) {
        case "short_rest": {
          // Recupera METADE da Mana, 1 Fadiga, 1 Ferimento e remove Abalado
          const manaRecovery = Math.floor(maxMana / 2);
          updates.mana_atual = Math.min(currentMana + manaRecovery, maxMana);
          updates.fadiga = Math.max((charData.fadiga || 0) - 1, 0);
          updates.ferimentos = Math.max((charData.ferimentos || 0) - 1, 0);
          updates.abalado = false;
          showNotification(
            `Descanso Curto aplicado em ${targetPlayer.name}.`,
            "success",
          );
          break;
        }
        case "long_rest": // Recupera tudo
          updates.mana_atual = maxMana;
          updates.fadiga = 0;
          updates.ferimentos = 0;
          updates.abalado = false;
          updates.status_efeitos = [];
          updates.envenenado = false;
          updates.paralisado = false;
          updates.congelado = false;
          showNotification(
            `Descanso Longo aplicado em ${targetPlayer.name}.`,
            "success",
          );
          break;
        case "stun": // Atordoar (Abalado)
          updates.abalado = true;
          showNotification(`${targetPlayer.name} está Abalado.`, "warning");
          break;
        case "remove_stun":
          updates.abalado = false;
          showNotification(
            `${targetPlayer.name} não está mais Abalado.`,
            "success",
          );
          break;
        case "damage": {
          // Causar Dano
          const currentWounds = charData.ferimentos || 0;

          if (currentWounds > 3) {
            showNotification(`${targetPlayer.name} já está morto.`, "error");
            return;
          }

          const newWounds = currentWounds + 1;
          updates.ferimentos = newWounds;
          updates.abalado = true; // Dano sempre abala

          if (newWounds > 3) {
            showNotification(`${targetPlayer.name} MORREU!`, "error");
          } else if (newWounds === 3) {
            showNotification(
              `${targetPlayer.name} desmaiou por ferimentos!`,
              "warning",
            );
          } else {
            showNotification(`Dano aplicado em ${targetPlayer.name}.`, "error");
          }
          break;
        }
        case "heal_damage": // Curar Dano
          if ((charData.ferimentos || 0) > 3) {
            showNotification(
              `${targetPlayer.name} está morto. Apenas ressurreição funciona.`,
              "error",
            );
            return;
          }
          updates.ferimentos = Math.max((charData.ferimentos || 0) - 1, 0);
          showNotification(
            `Curado 1 ferimento de ${targetPlayer.name}.`,
            "success",
          );
          break;
        case "fatigue": {
          // Fatigar (Max 3 = Desmaio)
          const currentFatigue = charData.fadiga || 0;
          if (currentFatigue >= 2) {
            showNotification(
              `${targetPlayer.name} já está desmaiado de exaustão.`,
              "warning",
            );
            return;
          }

          const newFatigue = currentFatigue + 1;
          updates.fadiga = newFatigue;

          if (newFatigue >= 2) {
            showNotification(
              `${targetPlayer.name} desmaiou de exaustão!`,
              "warning",
            );
            updates.abalado = true;
          } else {
            showNotification(`${targetPlayer.name} sofreu Fadiga.`, "warning");
          }
          break;
        }
        case "corruption_add":
          updates.corrupcao = (charData.corrupcao || 0) + 1;
          showNotification(
            `${targetPlayer.name} recebeu +1 Corrupção.`,
            "warning",
          );
          break;
        case "corruption_remove":
          updates.corrupcao = Math.max((charData.corrupcao || 0) - 1, 0);
          showNotification(
            `${targetPlayer.name} removeu -1 Corrupção.`,
            "success",
          );
          break;
        case "potion_heal":
          updates.abalado = false;
          updates.ferimentos = Math.max(
            (charData.ferimentos || 0) - healingTier,
            0,
          );
          showNotification(
            `${targetPlayer.name} usou Poção de Cura e recuperou ${healingTier} ferimento${healingTier > 1 ? "s" : ""}. Abalado removido.`,
            "success",
          );
          break;
        case "potion_mana":
          if (payload.amount === "total") {
            updates.mana_atual = maxMana;
          } else {
            updates.mana_atual = Math.min(
              currentMana + (payload.amount || 10),
              maxMana,
            );
          }
          showNotification(
            `${targetPlayer.name} usou Poção de Mana (+${payload.amount || 10}).`,
            "success",
          );
          break;
        case "antidote":
          // Antídoto remove 1 nível de Fadiga (geralmente causada por veneno)
          updates.fadiga = Math.max((charData.fadiga || 0) - 1, 0);
          Object.assign(
            updates,
            toggleCharacterStatusEffect(charData, "Envenenado").updates,
          );
          if (
            !(
              charData.envenenado ||
              getCharacterStatusEffects(charData).includes("Envenenado")
            )
          ) {
            updates.status_efeitos = getCharacterStatusEffects(charData);
            updates.envenenado = false;
          }
          showNotification(`${targetPlayer.name} usou Antídoto.`, "success");
          break;
        case "toggle_effect": {
          const effectLabel = payload.effectLabel;
          if (!effectLabel) return;
          const effectState = toggleCharacterStatusEffect(
            charData,
            effectLabel,
          );
          Object.assign(updates, effectState.updates);

          // Lógica de Efeitos Mecânicos ao ATIVAR/DESATIVAR
          if (effectState.isActive) {
            if (effectLabel === "Congelado") {
              // Causa fadiga imediata (até 2)
              const currentFatigue = charData.fadiga || 0;
              if (currentFatigue < 2) {
                updates.fadiga = currentFatigue + 1;
              }
            } else if (effectLabel === "Paralisado") {
              updates.movimento = 0;
            } else if (effectLabel === "Envenenado") {
              // Primeiro abala
              if (!charData.abalado) updates.abalado = true;
            }
            // Queimado e progressão de Veneno são aplicados por turno/manualmente
          } else {
            if (effectLabel === "Paralisado") {
              // Restaura movimento padrão (6) se estiver zerado
              if ((charData.movimento || 0) === 0) {
                updates.movimento = 6;
              }
            }
          }

          showNotification(
            `${targetPlayer.name} ${effectState.isActive ? `recebeu ${effectLabel}` : `não está mais com ${effectLabel}`}.`,
            effectState.isActive ? "warning" : "info",
          );
          break;
        }
        case "custom_effect": {
          const customEffect = payload.effectLabel?.trim();

          if (!customEffect) return;

          const effectState = toggleCharacterStatusEffect(
            charData,
            customEffect,
          );
          Object.assign(updates, effectState.updates);

          // Mesma lógica para status personalizados digitados manualmente
          if (effectState.isActive) {
            if (customEffect === "Congelado") {
              const currentFatigue = charData.fadiga || 0;
              if (currentFatigue < 2) updates.fadiga = currentFatigue + 1;
            } else if (customEffect === "Paralisado") {
              updates.movimento = 0;
            } else if (customEffect === "Envenenado") {
              if (!charData.abalado) updates.abalado = true;
            }
          } else if (customEffect === "Paralisado") {
            if ((charData.movimento || 0) === 0) updates.movimento = 6;
          }

          showNotification(
            `${targetPlayer.name} ${effectState.isActive ? `recebeu ${customEffect}` : `não está mais com ${customEffect}`}.`,
            effectState.isActive ? "warning" : "info",
          );
          break;
        }
        case "give_xp": {
          const currentXp = parseInt(charData.xp || 0, 10);
          updates.xp = currentXp + (payload.amount || 0);
          showNotification(
            `${targetPlayer.name} recebeu +${payload.amount} XP.`,
            "success",
          );
          break;
        }
      }

      await APIService.saveCharacter(charData.userId, {
        ...charData,
        ...updates,
      });
    } catch (error) {
      console.error("Erro na ação do GM:", error);
      if (error.code === "permission-denied") {
        showNotification(
          "Sem permissão. Atualize as regras do Firestore.",
          "error",
        );
      } else {
        showNotification("Erro ao aplicar ação na ficha.", "error");
      }
    }
  };

  const handleConfirmCustomEffect = () => {
    if (customEffectText.trim()) {
      handleGMAction("custom_effect", { effectLabel: customEffectText });
      setCustomEffectText("");
      setCustomEffectModalOpen(false);
    } else {
      showNotification("Digite um nome para o status.", "warning");
    }
  };

  // --- Lógica de Convocar NPC ---
  const handleOpenNpcModal = async () => {
    handleCloseMenu();
    setNpcModalOpen(true);
    setLoadingNpcs(true);
    try {
      const chars = await APIService.getAllCharacters(user.uid);
      // Filtra personagens que já estão na mesa
      const existingCharIds =
        selectedTable?.players?.map((p) => p.characterId) || [];
      const available = chars.filter((c) => !existingCharIds.includes(c._id));
      setMyCharacters(available);
    } catch (error) {
      console.error("Erro ao carregar personagens para NPC:", error);
    } finally {
      setLoadingNpcs(false);
    }
  };

  const handleAddNpc = async (character) => {
    try {
      await APIService.addNpcToTable(selectedTable._id, character);
      setNpcModalOpen(false);
      showNotification("NPC convocado com sucesso!", "success");
    } catch (error) {
      showNotification(`Erro ao adicionar NPC: ${error.message}`, "error");
    }
  };

  // --- Lógica de Trocar Mesa ---
  const handleOpenTablesMenu = async (event) => {
    setTablesMenuAnchor(event.currentTarget);
    try {
      const tables = await APIService.getTables(user.email, user.uid);
      setMyTables(tables);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchTable = (table) => {
    setSelectedTable(table);
    setTablesMenuAnchor(null);
  };

  const handleOpenGameSettings = () => {
    if (isBookOpen) setIsBookOpen(false);
    if (inspectModalOpen) toggleInspectModal();
    if (chatOpen) toggleChat();

    const currentSession = getTableGameSession(selectedTable);
    setSelectedGameLocks(currentSession.lockedFields);
    setGameSettingsOpen(true);
  };

  const handleCloseGameSettings = () => {
    if (savingGameSettings) return;
    setGameSettingsOpen(false);
  };

  const handleToggleGameLock = (fieldKey) => {
    setSelectedGameLocks((current) =>
      current.includes(fieldKey)
        ? current.filter((key) => key !== fieldKey)
        : [...current, fieldKey],
    );
  };

  const persistGameSession = async (isActive, successMessage) => {
    if (!selectedTable?._id) return;

    setSavingGameSettings(true);
    try {
      const nextGameSession = {
        isActive,
        lockedFields: selectedGameLocks,
      };

      await APIService.updateTable(selectedTable._id, {
        gameSession: nextGameSession,
      });

      setSelectedTable({
        ...selectedTable,
        gameSession: nextGameSession,
      });
      showNotification(successMessage, "success");
      setGameSettingsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar controle do jogo:", error);
      showNotification("Erro ao salvar os bloqueios da ficha.", "error");
    } finally {
      setSavingGameSettings(false);
    }
  };

  const handleStartGame = () =>
    persistGameSession(true, "Jogo iniciado. Bloqueios aplicados.");

  const handleUpdateGameLocks = () =>
    persistGameSession(true, "Bloqueios da ficha atualizados.");

  const handleFinishGame = () =>
    persistGameSession(false, "Jogo finalizado. Ficha liberada.");

  const gmData = selectedTable
    ? {
        uid: selectedTable.gmId,
        name: selectedTable.gmName,
        isGM: true,
        photoURL: selectedTable.gmPhotoURL || (isGM ? user?.photoURL : null),
        characterId: selectedTable.gmCharacterId, // Adicionado para permitir visualização de status do GM se houver
      }
    : null;

  // Data for GM's character (NPC Principal)
  const gmCharacterData = selectedTable?.gmCharacterId
    ? {
        uid: selectedTable.gmId, // Same owner
        characterId: selectedTable.gmCharacterId,
        name: "Personagem do Mestre", // Will be overwritten by sheet name
        isNpc: true,
      }
    : null;

  // Separar Jogadores Reais de NPCs
  const allPlayers = selectedTable?.players || [];
  const npcList = allPlayers.filter((p) => p.isNpc);
  const realPlayerList = allPlayers.filter((p) => !p.isNpc);

  // Filtrar arquivos para exibir apenas materiais gerais ou de missões ativas
  const activeQuestIds = activeQuests.map((q) => q._id);
  const visibleFiles = (selectedTable?.files || []).filter(
    (file) => !file.questId || activeQuestIds.includes(file.questId),
  );

  // Computar presença atual do usuário para a TopBar
  let myPresence = "pending";
  if (isGM) {
    myPresence = selectedTable?.gmPresence || "pending";
  } else {
    const me = selectedTable?.players?.find((p) => p.uid === user?.uid);
    myPresence = me?.presence || "pending";
  }

  const getTopBarPresenceIcon = (status) => {
    if (status === "confirmed") return <CheckCircleIcon color="success" />;
    if (status === "declined") return <CancelIcon color="error" />;
    return <HelpOutlineIcon color="disabled" />;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: selectedTable ? (isGM ? "#faf5ff" : "#e3f2fd") : "#f5f7fa",
            borderBottom: "1px solid #e0e0e0",
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {selectedTable ? (
              isGM ? (
                <>
                  <GmIcon color="secondary" />
                  <Typography
                    variant="h6"
                    color="secondary"
                    fontWeight="bold"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    Área do Mestre
                  </Typography>
                </>
              ) : (
                <>
                  <InfoIcon color="primary" />
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    Mesa de Jogo
                  </Typography>
                </>
              )
            ) : (
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight="bold"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Hub do Caçador
              </Typography>
            )}
            {selectedTable && (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  |
                </Typography>
                <Typography variant="h6" component="span" fontWeight="bold">
                  {selectedTable.name}
                </Typography>
                {isGM ? (
                  <Chip label="GM" color="secondary" size="small" />
                ) : (
                  <Chip label="Jogador" color="primary" size="small" />
                )}
              </>
            )}
          </Box>

          {/* Próxima Sessão no Centro da Barra */}
          {selectedTable && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                Próxima Sessão
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {selectedTable.nextSession
                    ? new Date(selectedTable.nextSession).toLocaleString(
                        "pt-BR",
                      )
                    : "Não agendada"}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={handleTogglePresence}
                  title={
                    myPresence === "confirmed"
                      ? "Presença: Confirmada (Clique para alterar)"
                      : myPresence === "declined"
                        ? "Presença: Ausente (Clique para alterar)"
                        : "Presença: Pendente (Clique para alterar)"
                  }
                >
                  {getTopBarPresenceIcon(myPresence)}
                </IconButton>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {selectedTable && !isGM && (
              <IconButton
                onClick={() => {
                  if (inspectModalOpen) {
                    toggleInspectModal();
                  } else {
                    handleViewMySheet();
                  }
                }}
                title="Ver Minha Ficha"
                sx={{
                  color: inspectModalOpen ? "primary.main" : "action.active",
                }}
              >
                <SheetIcon />
              </IconButton>
            )}
            {selectedTable && isGM && (
              <IconButton
                onClick={handleOpenGameSettings}
                title={gameSession.isActive ? "Finalizar Jogo" : "Iniciar Jogo"}
                sx={{
                  color:
                    gameSession.isActive || gameSettingsOpen
                      ? "primary.main"
                      : "action.active",
                }}
              >
                {gameSession.isActive ? (
                  <StopIcon fontSize="large" />
                ) : (
                  <PlayIcon fontSize="large" />
                )}
              </IconButton>
            )}

            <IconButton
              onClick={() => setIsBestiaryOpen(!isBestiaryOpen)}
              title="Bestiário"
              sx={{ color: isBestiaryOpen ? "primary.main" : "action.active" }}
            >
              <BestiaryIcon />
            </IconButton>

            <IconButton
              onClick={() => setIsBookOpen(!isBookOpen)}
              title="Manual do Jogo"
              sx={{ color: isBookOpen ? "primary.main" : "action.active" }}
            >
              <MenuBookIcon />
            </IconButton>
            <IconButton
              onClick={handleOpenTablesMenu}
              title="Trocar de Mesa"
              sx={{
                color: tablesMenuAnchor ? "primary.main" : "action.active",
              }}
            >
              <SwitchTableIcon />
            </IconButton>
            {selectedTable && (
              <IconButton
                onClick={toggleChat}
                title="Abrir Chat"
                sx={{ color: chatOpen ? "primary.main" : "action.active" }}
              >
                <MessageIcon />
              </IconButton>
            )}
            <UserMenu />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: "#f5f7fa",
            p: 0,
            display: "flex",
            flexDirection: "column",
            overflowY: "hidden",
          }}
        >
          {isBookOpen ? (
            <Box
              sx={{
                height: "100%",
                overflow: "hidden",
                bgcolor: "#fff",
                p: 0,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <BookView
                  twoPageMode={true}
                  loreSections={scenarioLoreSections}
                />
              </Box>
            </Box>
          ) : isBestiaryOpen ? (
            <Box
              sx={{
                height: "100%",
                overflow: "hidden",
                bgcolor: "#fff",
                p: 0,
              }}
            >
              <BestiaryView />
            </Box>
          ) : inspectModalOpen ? (
            <Box
              sx={{
                height: "100%",
                overflow: "auto",
                bgcolor: "#fff",
                p: 0,
              }}
            >
              <InspectSheetModal isEmbedded={true} />
            </Box>
          ) : !selectedTable ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 3,
                bgcolor: "#f5f7fa",
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" color="text.secondary">
                Bem-vindo ao Hub do Caçador!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 500 }}
              >
                Você está na área de Mesas de Jogo, mas ainda não selecionou
                nenhuma. Escolha uma mesa, crie uma nova campanha ou retorne à
                tela principal para gerenciar seus personagens. Use os botões
                acima para acessar o Manual do Jogo ou trocar de mesa.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    window.dispatchEvent(new Event("open-sheet-manager"))
                  }
                  startIcon={<SheetIcon />}
                >
                  Ir para Minhas Fichas
                </Button>
                <Button
                  variant="contained"
                  onClick={() => useUIStore.getState().toggleTableListModal()}
                  startIcon={<SwitchTableIcon />}
                >
                  Minhas Mesas
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* Navegação Mobile */}
              {isMobile && (
                <Tabs
                  value={mobileTab}
                  onChange={(e, v) => setMobileTab(v)}
                  variant="fullWidth"
                  sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
                >
                  <Tab label={isGM ? "Mestre" : "Mesa"} />
                  <Tab label="Jogadores" />
                </Tabs>
              )}

              <Grid container sx={{ flexGrow: 1, overflow: "hidden" }}>
                {/* Coluna Esquerda: Área do Mestre / Informações */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    height: "100%",
                    overflowY: "auto",
                    p: { xs: 2, md: 3 },
                    display: {
                      xs: mobileTab === 0 ? "block" : "none",
                      md: "block",
                    },
                    ...(isGM
                      ? {
                          bgcolor: "#faf5ff",
                          borderRight: "2px solid #e1bee7",
                          "&::-webkit-scrollbar": { width: "8px" },
                          "&::-webkit-scrollbar-track": {
                            background: "transparent",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#e1bee7",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            background: "#ce93d8",
                          },
                        }
                      : {
                          bgcolor: "#e3f2fd",
                          borderRight: "2px solid #bbdefb",
                          "&::-webkit-scrollbar": { width: "8px" },
                          "&::-webkit-scrollbar-track": {
                            background: "transparent",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "rgba(144, 202, 249, 0.5)",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            background: "rgba(144, 202, 249, 0.8)",
                          },
                        }),
                  }}
                >
                  {/* Abas de Navegação do Painel */}
                  <Tabs
                    value={panelTab}
                    onChange={(e, v) => setPanelTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      mb: 3,
                      minHeight: 36,
                      "& .MuiTab-root": {
                        minHeight: 36,
                        textTransform: "none",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <Tab label="Missão atual" />
                    {isGM && <Tab label="Arquivos GM" />}
                    <Tab label="Pistas" />
                    {isGM && <Tab label="Banco de Missões" />}
                  </Tabs>

                  {/* Conteúdo das Abas */}
                  {panelTab === 0 && (
                    <Box
                      id="section-dados-campanha"
                      sx={{
                        mb: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Accordion
                        defaultExpanded
                        sx={{
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                          boxShadow: "none",
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <InfoIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Informações da Mesa
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          >
                            <GmIcon fontSize="small" />
                            <Typography variant="body2">
                              GM: <strong>{selectedTable?.gmName}</strong>
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {selectedTable?.description ||
                              "Sem descrição disponível."}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      {activeQuests.map((quest, index) => (
                        <Accordion
                          key={quest._id}
                          defaultExpanded={index === 0}
                          sx={{
                            borderRadius: "8px",
                            border: "1px solid #00e5ff",
                            bgcolor: "rgba(0, 229, 255, 0.05)",
                            boxShadow: "none",
                            "&:before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon color="primary" />}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                variant="overline"
                                color="#00b8d4"
                                sx={{
                                  fontWeight: "bold",
                                  lineHeight: 1,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                [ CONTRATO DE ASSOCIAÇÃO / CONVOCAÇÃO ]
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <QuestIcon color="primary" />
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  sx={{ textTransform: "uppercase" }}
                                >
                                  {quest.title}
                                </Typography>
                              </Box>
                              {quest.hunterRank && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  Rank da Fenda: {quest.hunterRank} | Rank
                                  SWADE: {quest.swadeRank} | Caçadores:{" "}
                                  {quest.players}
                                </Typography>
                              )}
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0 }}>
                            <Divider
                              sx={{
                                mb: 1.5,
                                borderColor: "rgba(0, 184, 212, 0.2)",
                              }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="#00b8d4"
                                  fontWeight="bold"
                                  display="block"
                                >
                                  ESTRUTURA ESTIMADA
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Tamanho: {quest.rooms} salas mapeadas.
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="#00b8d4"
                                  fontWeight="bold"
                                  display="block"
                                >
                                  SITUAÇÃO / RELATÓRIO
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {quest.hook}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="#00b8d4"
                                  fontWeight="bold"
                                  display="block"
                                >
                                  DIRETRIZ DE MISSÃO
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {quest.objective}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="#00b8d4"
                                  fontWeight="bold"
                                  display="block"
                                >
                                  PONTO DE INCURSÃO
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {quest.location}
                                </Typography>
                              </Box>

                              {isGM && (
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: 1.5,
                                    bgcolor: "rgba(0,0,0,0.03)",
                                    borderRadius: 1,
                                    borderLeft: "3px solid #9c27b0",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: "block",
                                      mb: 1,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    INFORMAÇÕES SIGILOSAS (Apenas GM)
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="warning.main"
                                    display="block"
                                  >
                                    <strong>Complicação:</strong>{" "}
                                    {quest.complication}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="secondary.main"
                                    display="block"
                                  >
                                    <strong>Twist:</strong> {quest.twist}
                                  </Typography>
                                  {quest.traps?.length > 0 && (
                                    <>
                                      <Typography
                                        variant="caption"
                                        color="info.main"
                                        display="block"
                                        sx={{ mt: 1 }}
                                      >
                                        <strong>Armadilhas:</strong>
                                      </Typography>
                                      {quest.traps.map((t, i) => (
                                        <Typography
                                          key={i}
                                          variant="caption"
                                          color="text.secondary"
                                          display="block"
                                        >
                                          • {t}
                                        </Typography>
                                      ))}
                                    </>
                                  )}
                                  <Box sx={{ mt: 1 }}>
                                    <Typography
                                      variant="caption"
                                      color="primary.main"
                                      display="block"
                                    >
                                      <strong>Encontros Esperados:</strong>
                                    </Typography>
                                    <Box sx={{ ml: 1, mt: 0.5 }}>
                                      <Typography
                                        variant="caption"
                                        color="error.main"
                                        display="block"
                                      >
                                        <strong>◆ Boss:</strong>
                                      </Typography>
                                      <Box sx={{ ml: 1, mb: 1 }}>
                                        {typeof quest.antagonist ===
                                        "string" ? (
                                          <Typography
                                            variant="caption"
                                            display="block"
                                          >
                                            {quest.antagonist}
                                          </Typography>
                                        ) : (
                                          <>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "space-between",
                                                gap: 1,
                                              }}
                                            >
                                              <Box>
                                                <Typography
                                                  variant="caption"
                                                  display="block"
                                                >
                                                  <strong>
                                                    {quest.antagonist?.name}
                                                  </strong>{" "}
                                                  —{" "}
                                                  {
                                                    quest.antagonist
                                                      ?.description
                                                  }
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  color="text.secondary"
                                                  display="block"
                                                >
                                                  Status:{" "}
                                                  {quest.antagonist?.stats}
                                                </Typography>
                                              </Box>
                                              {quest.antagonist?.id && (
                                                <Button
                                                  size="small"
                                                  variant="outlined"
                                                  color="error"
                                                  onClick={() =>
                                                    handleOpenMonsterModal(
                                                      quest.antagonist.id,
                                                    )
                                                  }
                                                  sx={{
                                                    minWidth: "auto",
                                                    p: "2px 6px",
                                                    fontSize: "0.6rem",
                                                  }}
                                                >
                                                  Ficha
                                                </Button>
                                              )}
                                            </Box>
                                          </>
                                        )}
                                      </Box>
                                      {quest.encounters?.length > 0 && (
                                        <>
                                          <Typography
                                            variant="caption"
                                            color="warning.main"
                                            display="block"
                                          >
                                            <strong>◆ Monstros:</strong>
                                          </Typography>
                                          {quest.encounters.map((enc, i) => (
                                            <Box
                                              key={i}
                                              sx={{
                                                ml: 1,
                                                mb: 1,
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "space-between",
                                                gap: 1,
                                              }}
                                            >
                                              <Box>
                                                <Typography
                                                  variant="caption"
                                                  display="block"
                                                >
                                                  <strong>{enc.name}</strong> (
                                                  {enc.type})
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  color="text.secondary"
                                                  display="block"
                                                >
                                                  {enc.stats}
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  color="success.main"
                                                  display="block"
                                                >
                                                  Loot: {enc.loot}
                                                </Typography>
                                              </Box>
                                              {enc.id && (
                                                <Button
                                                  size="small"
                                                  variant="outlined"
                                                  color="warning"
                                                  onClick={() =>
                                                    handleOpenMonsterModal(
                                                      enc.id,
                                                    )
                                                  }
                                                  sx={{
                                                    minWidth: "auto",
                                                    p: "2px 6px",
                                                    fontSize: "0.6rem",
                                                  }}
                                                >
                                                  Ficha
                                                </Button>
                                              )}
                                            </Box>
                                          ))}
                                        </>
                                      )}
                                    </Box>
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    color="success.main"
                                    display="block"
                                    sx={{ mt: 1 }}
                                  >
                                    <strong>Loot do Boss:</strong>{" "}
                                    {quest.bossLoot?.join(", ")}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="success.main"
                                    display="block"
                                  >
                                    <strong>Recompensa:</strong> {quest.reward}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  )}

                  {/* Mestre: Materiais Secretos */}
                  {isGM && panelTab === 1 && (
                    <Box id="section-materiais-secretos" sx={{ mb: 4 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 2 }}
                      >
                        Visível apenas para o Mestre. (Arquivos de missões
                        ocultas não aparecem aqui).
                      </Typography>
                      <GameFileManager
                        tableId={selectedTable?._id}
                        files={visibleFiles}
                        isGM={true}
                        hideList={false}
                        onlySecret={true}
                        forceSecretUpload={true}
                      />
                    </Box>
                  )}

                  {/* Materiais Públicos */}
                  {panelTab === (isGM ? 2 : 1) && (
                    <Box id="section-materiais-publicos" sx={{ mb: 4 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 2 }}
                      >
                        Visível para todos os jogadores.
                      </Typography>
                      <GameFileManager
                        tableId={selectedTable?._id}
                        files={visibleFiles}
                        isGM={isGM}
                        hideUpload={!isGM}
                        excludeSecret={true}
                      />
                    </Box>
                  )}

                  {/* Banco de Missões */}
                  {isGM && panelTab === 3 && (
                    <Box id="section-banco-missoes" sx={{ mb: 4 }}>
                      <QuestBoard tableId={selectedTable?._id} isGM={isGM} />
                    </Box>
                  )}
                </Grid>

                {/* Coluna Direita: Lista de Jogadores */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    height: "100%",
                    bgcolor: "#fff",
                    borderLeft: { md: "1px solid #e0e0e0" },
                    p: 2,
                    overflowY: "auto",
                    display: {
                      xs: mobileTab === 1 ? "block" : "none",
                      md: "block",
                    },
                    "&::-webkit-scrollbar": { width: "8px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(144, 202, 249, 0.5)",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "rgba(144, 202, 249, 0.8)",
                    },
                  }}
                >
                  {/* Seção do Game Master */}
                  <Divider
                    textAlign="left"
                    sx={{ mb: 2, mt: 1, borderColor: "rgba(0,0,0,0.08)" }}
                  >
                    <Chip label="Game Master" size="small" color="secondary" />
                  </Divider>

                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <PlayerListItem
                        player={gmData}
                        isGMView={isGM}
                        presenceStatus={selectedTable?.gmPresence || "pending"}
                        onClick={handlePlayerClick}
                      />
                    </Box>
                    {isGM && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1,
                          border: "1px solid #e0e0e0",
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          bgcolor: "#fafafa",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          align="center"
                          fontWeight="bold"
                        >
                          PODERES GM
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            title="Restaurar Mana da Mesa"
                            onClick={() => handleMassAction("mana")}
                          >
                            <ManaPotionIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            title="Curar Ferimentos da Mesa"
                            onClick={() => handleMassAction("wounds")}
                          >
                            <HealIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="warning"
                            title="Remover Abalado da Mesa"
                            onClick={() => handleMassAction("shaken")}
                          >
                            <StunIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    )}
                  </Box>

                  {gmCharacterData && (
                    <Box sx={{ mb: 3, pl: 2, borderLeft: "4px solid #9c27b0" }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        Personagem do Mestre
                      </Typography>
                      <PlayerListItem
                        player={gmCharacterData}
                        isGMView={isGM}
                        presenceStatus={null}
                        onClick={handlePlayerClick}
                      />
                    </Box>
                  )}

                  {/* Seção de NPCs (Abaixo do GM) */}
                  {npcList.length > 0 && (
                    <>
                      <Divider
                        textAlign="left"
                        sx={{ mb: 2, borderColor: "rgba(0,0,0,0.08)" }}
                      >
                        <Chip
                          label="NPCs & Invocados"
                          size="small"
                          sx={{
                            bgcolor: "#e1bee7",
                            color: "#4a148c",
                            fontWeight: "bold",
                          }}
                        />
                      </Divider>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        {npcList.map((player) => (
                          <PlayerListItem
                            key={player.uid}
                            player={player}
                            isGMView={isGM}
                            presenceStatus={null}
                            onClick={handlePlayerClick}
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  {/* Seção dos Jogadores */}
                  <Divider
                    textAlign="left"
                    sx={{ mb: 2, borderColor: "rgba(0,0,0,0.08)" }}
                  >
                    <Chip label="Jogadores" size="small" />
                  </Divider>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {realPlayerList.map((player) => {
                      return (
                        <PlayerListItem
                          key={player.uid}
                          player={player}
                          isGMView={isGM}
                          presenceStatus={player.presence || "pending"}
                          onClick={handlePlayerClick}
                        />
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {/* Menu de Opções do Jogador */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 240 },
            }}
          >
            {/* Opções para o próprio usuário (Self) */}
            {selectedPlayer?.uid === user?.uid && (
              <div>
                {!isGM && (
                  <>
                    <MenuItem onClick={handleViewSheet}>
                      <ListItemIcon>
                        <SheetIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Ver Minha Ficha</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        toggleTableDetailsModal();
                      }}
                    >
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Trocar Personagem</ListItemText>
                    </MenuItem>
                  </>
                )}
                {isGM && !selectedPlayer?.isNpc && (
                  <MenuItem onClick={handleOpenNpcModal}>
                    <ListItemIcon>
                      <AddNpcIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Convocar NPC</ListItemText>
                  </MenuItem>
                )}
                <Divider />
              </div>
            )}

            {/* Opções exclusivas para o GM (ao clicar em jogadores) */}
            {isGM &&
              (!selectedPlayer?.isGM ||
                (selectedPlayer.isNpc &&
                  selectedPlayer.uid === selectedTable?.gmId)) && [
                <MenuItem key="view-sheet" onClick={handleViewSheet}>
                  <ListItemIcon>
                    <SheetIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ver Personagem</ListItemText>
                </MenuItem>,

                // AÇÕES
                <MenuItem
                  key="menu-actions"
                  onClick={(e) => handleOpenSubmenu("actions", e)}
                >
                  <ListItemIcon>
                    <SendIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ações</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                // XP
                <MenuItem
                  key="menu-xp"
                  onClick={(e) => handleOpenSubmenu("xp", e)}
                >
                  <ListItemIcon>
                    <StarIcon fontSize="small" sx={{ color: "#d97706" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#d97706" }}>Dar XP</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                <Divider key="div-actions" />,

                // ABALAR / REMOVER ABALADO
                selectedPlayerStatus.isShaken ? (
                  <MenuItem
                    key="act-remove-stun"
                    onClick={() => handleGMAction("remove_stun")}
                  >
                    <ListItemIcon>
                      <HealIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText>Remover Abalado</ListItemText>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key="act-stun"
                    onClick={() => handleGMAction("stun")}
                  >
                    <ListItemIcon>
                      <StunIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Abalar</ListItemText>
                  </MenuItem>
                ),

                // DANO
                <MenuItem
                  key="menu-damage"
                  onClick={(e) => handleOpenSubmenu("damage", e)}
                >
                  <ListItemIcon>
                    <DamageIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "error.main" }}>Dano</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                // DESCANSO
                <MenuItem
                  key="menu-rest"
                  onClick={(e) => handleOpenSubmenu("rest", e)}
                >
                  <ListItemIcon>
                    <RestIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Descanso</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                <Divider key="div-sit" />,

                // CORRUPÇÃO
                <MenuItem
                  key="menu-corruption"
                  onClick={(e) => handleOpenSubmenu("corruption", e)}
                >
                  <ListItemIcon>
                    <CorruptionIcon
                      fontSize="small"
                      sx={{ color: "#7b1fa2" }}
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#7b1fa2" }}>
                    Corrupção
                  </ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                // POÇÕES
                <MenuItem
                  key="menu-potions"
                  onClick={(e) => handleOpenSubmenu("potions", e)}
                >
                  <ListItemIcon>
                    <HealthPotionIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Poções</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                // EFEITOS
                <MenuItem
                  key="act-effects"
                  onClick={(event) => handleOpenSubmenu("effects", event)}
                >
                  <ListItemIcon>
                    <PoisonIcon fontSize="small" sx={{ color: "#9c27b0" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#9c27b0" }}>Efeitos</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,

                <Divider key="divider-kick" />,
                <MenuItem key="remove-player" onClick={handleRemovePlayer}>
                  <ListItemIcon>
                    <PersonRemoveIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "error.main" }}>
                    Remover Jogador
                  </ListItemText>
                </MenuItem>,
              ]}

            {/* A opção de enviar mensagem só aparece se não for o próprio usuário */}
            {selectedPlayer?.uid !== user?.uid &&
              !(isGM && !selectedPlayer?.isGM) && (
                <>
                  <MenuItem onClick={handleViewFriend}>
                    <ListItemIcon>
                      <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver Perfil</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleSendMessage}>
                    <ListItemIcon>
                      <MessageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Enviar Msg</ListItemText>
                  </MenuItem>
                </>
              )}
          </Menu>

          {/* SUBMENU: Ações */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "actions"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={handleSendMessage}>
              <ListItemIcon>
                <MessageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Enviar Msg</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleRequestFile}>
              <ListItemIcon>
                <FileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Solicitar Arquivo</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: XP */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "xp"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("give_xp", { amount: 1 })}>
              <ListItemText>+1 XP (Avanço Menor)</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("give_xp", { amount: 2 })}>
              <ListItemText>+2 XP</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("give_xp", { amount: 3 })}>
              <ListItemText>+3 XP (Avanço Padrão)</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("give_xp", { amount: 5 })}>
              <ListItemText>+5 XP</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Dano */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "damage"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("damage")}>
              <ListItemIcon>
                <DamageIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText color="error">Causar Dano</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("heal_damage")}>
              <ListItemIcon>
                <HealIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText color="success">Curar Dano</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Descanso */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "rest"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("short_rest")}>
              <ListItemIcon>
                <RestIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Curto</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("long_rest")}>
              <ListItemIcon>
                <SleepIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Longo</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Corrupção */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "corruption"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("corruption_add")}>
              <ListItemIcon>
                <CorruptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Causar</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("corruption_remove")}>
              <ListItemIcon>
                <PurifyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Curar</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Poções */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "potions"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={(e) => handleOpenSubmenu("heal-potion", e)}>
              <ListItemIcon>
                <HealthPotionIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Cura</ListItemText>
              <ChevronRightIcon fontSize="small" />
            </MenuItem>
            <MenuItem onClick={(e) => handleOpenSubmenu("mana-potion", e)}>
              <ListItemIcon>
                <ManaPotionIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>Mana</ListItemText>
              <ChevronRightIcon fontSize="small" />
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("antidote")}>
              <ListItemIcon>
                <AntidoteIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Antídoto</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Ações */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "actions"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={handleSendMessage}>
              <ListItemIcon>
                <MessageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Enviar Msg</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleRequestFile}>
              <ListItemIcon>
                <FileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Solicitar Arquivo</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Dano */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "damage"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("damage")}>
              <ListItemIcon>
                <DamageIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText color="error">Causar Dano</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("heal_damage")}>
              <ListItemIcon>
                <HealIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText color="success">Curar Dano</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Descanso */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "rest"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("short_rest")}>
              <ListItemIcon>
                <RestIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Curto</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("long_rest")}>
              <ListItemIcon>
                <SleepIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Longo</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Corrupção */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "corruption"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={() => handleGMAction("corruption_add")}>
              <ListItemIcon>
                <CorruptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Causar</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("corruption_remove")}>
              <ListItemIcon>
                <PurifyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Curar</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Poções */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "potions"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem onClick={(e) => handleOpenTertiary("heal-potion", e)}>
              <ListItemIcon>
                <HealthPotionIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Cura</ListItemText>
              <ChevronRightIcon fontSize="small" />
            </MenuItem>
            <MenuItem onClick={(e) => handleOpenTertiary("mana-potion", e)}>
              <ListItemIcon>
                <ManaPotionIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>Mana</ListItemText>
              <ChevronRightIcon fontSize="small" />
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("antidote")}>
              <ListItemIcon>
                <AntidoteIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Antídoto</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Poção de Cura */}
          <Menu
            anchorEl={tertiaryAnchorEl}
            open={tertiaryType === "heal-potion"}
            onClose={handleCloseTertiary}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem
              onClick={() => handleGMAction("potion_heal", { amount: 5 })}
            >
              <ListItemText>+1 Ferimento</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleGMAction("potion_heal", { amount: 10 })}
            >
              <ListItemText>+2 Ferimentos</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleGMAction("potion_heal", { amount: 15 })}
            >
              <ListItemText>+3 Ferimentos</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Poção de Mana */}
          <Menu
            anchorEl={tertiaryAnchorEl}
            open={tertiaryType === "mana-potion"}
            onClose={handleCloseTertiary}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3 }}
          >
            <MenuItem
              onClick={() => handleGMAction("potion_mana", { amount: 3 })}
            >
              <ListItemText>+3 Mana</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleGMAction("potion_mana", { amount: 5 })}
            >
              <ListItemText>+5 Mana</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleGMAction("potion_mana", { amount: 10 })}
            >
              <ListItemText>+10 Mana</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleGMAction("potion_mana", { amount: "total" })}
            >
              <ListItemText>Total</ListItemText>
            </MenuItem>
          </Menu>

          {/* SUBMENU: Efeitos (Status) */}
          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "effects"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ elevation: 3, sx: { minWidth: 220 } }}
          >
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", { effectLabel: "Envenenado" })
              }
            >
              <ListItemText>Envenenar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", { effectLabel: "Paralisado" })
              }
            >
              <ListItemText>Paralisar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", { effectLabel: "Congelado" })
              }
            >
              <ListItemText>Congelar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", { effectLabel: "Queimado" })
              }
            >
              <ListItemText>Queimar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setSubmenuAnchorEl(null);
                setSubmenuType(null);
                setCustomEffectModalOpen(true);
              }}
            >
              <ListItemText>Outros status de RPG</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Menu de Troca de Mesa */}
      <Menu
        anchorEl={tablesMenuAnchor}
        open={Boolean(tablesMenuAnchor)}
        onClose={() => setTablesMenuAnchor(null)}
      >
        {myTables.length === 0 ? (
          <MenuItem disabled>Carregando mesas...</MenuItem>
        ) : (
          myTables.map((table) => (
            <MenuItem
              key={table._id}
              selected={selectedTable && table._id === selectedTable._id}
              onClick={() => handleSwitchTable(table)}
            >
              {table.name}
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Modal de Controle da Sessão */}
      <Dialog
        open={gameSettingsOpen}
        onClose={handleCloseGameSettings}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {gameSession.isActive ? "Finalizar Jogo" : "Iniciar Jogo"}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "#f5f7fa",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Selecione os pontos da ficha que ficarão bloqueados enquanto o
              jogo estiver em andamento.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              A lista abaixo cobre todos os pontos editáveis da Ficha de
              Personagem.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSelectedGameLocks(SHEET_LOCK_KEYS)}
              >
                Marcar Tudo
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => setSelectedGameLocks([])}
              >
                Limpar Seleção
              </Button>
              <Chip
                size="small"
                color={gameSession.isActive ? "secondary" : "default"}
                label={`${selectedGameLocks.length} bloqueio(s) selecionado(s)`}
              />
            </Box>
          </Box>

          <Grid container spacing={2}>
            {SHEET_LOCK_GROUPS.map((group) => (
              <Grid item xs={12} md={6} key={group.id}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, height: "100%", bgcolor: "#fff" }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="primary"
                    sx={{ mb: 1.5 }}
                  >
                    {group.title}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {group.items.map((item) => (
                      <FormControlLabel
                        key={item.key}
                        control={
                          <Checkbox
                            checked={selectedGameLocks.includes(item.key)}
                            onChange={() => handleToggleGameLock(item.key)}
                          />
                        }
                        label={item.label}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseGameSettings}
            disabled={savingGameSettings}
          >
            Fechar
          </Button>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {gameSession.isActive && (
              <Button
                color="error"
                variant="outlined"
                onClick={handleFinishGame}
                disabled={savingGameSettings}
              >
                Finalizar Jogo
              </Button>
            )}
            <Button
              variant="contained"
              onClick={
                gameSession.isActive ? handleUpdateGameLocks : handleStartGame
              }
              disabled={savingGameSettings}
            >
              {gameSession.isActive ? "Salvar Bloqueios" : "Iniciar Jogo"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Modal de Convocar NPC */}
      <Dialog
        open={npcModalOpen}
        onClose={() => setNpcModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Convocar NPC para o Grupo</DialogTitle>
        <DialogContent>
          {loadingNpcs ? (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              Carregando seus personagens...
            </Typography>
          ) : myCharacters.length === 0 ? (
            <Typography
              sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
            >
              Você não tem personagens disponíveis ou todos já estão nesta mesa.
            </Typography>
          ) : (
            <List>
              {myCharacters.map((char) => (
                <ListItem
                  key={char._id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddNpc(char)}
                    >
                      Adicionar
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={char.imagem_url} alt={char.nome}>
                      {char.nome?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={char.nome}
                    secondary={`${char.arquetipo || "Sem classe"} • Rank ${char.rank || "Novato"}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Componente de Chat */}
      <ChatModal />

      {/* Modal de Status Personalizado */}
      <Dialog
        open={customEffectModalOpen}
        onClose={() => {
          setCustomEffectModalOpen(false);
          handleCloseMenu();
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Status Personalizado</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Digite o nome do status. Se ele já existir na ficha, será removido.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Status"
            fullWidth
            variant="outlined"
            value={customEffectText}
            onChange={(e) => setCustomEffectText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleConfirmCustomEffect()}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCustomEffectModalOpen(false);
              handleCloseMenu();
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirmCustomEffect} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Perfil Resumido (Ver Amigo) */}
      <Dialog
        open={friendModalOpen}
        onClose={() => setFriendModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" fontWeight="bold">
            Licença de Caçador
          </Typography>
          <IconButton onClick={() => setFriendModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ bgcolor: "#f8fafc", p: { xs: 2, md: 4 } }}
        >
          {loadingFriend ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : friendData ? (
            <Grid container spacing={4}>
              {/* FOTO - Coluna Esquerda */}
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 1.5,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#fff",
                    borderRadius: 2,
                  }}
                >
                  {friendData.imagem_url ? (
                    <Box
                      component="img"
                      src={friendData.imagem_url}
                      alt={friendData.nome}
                      sx={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "3/4",
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <Avatar
                      src={selectedPlayer?.photoURL}
                      sx={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "3/4",
                        borderRadius: 1,
                      }}
                      variant="rounded"
                    />
                  )}
                  <Box
                    sx={{
                      width: "100%",
                      mt: 2,
                      textAlign: "center",
                      p: 1,
                      bgcolor: "#1e293b",
                      color: "#fff",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ letterSpacing: 2, textTransform: "uppercase" }}
                    >
                      RANK {friendData.rank || "Novato"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* DADOS - Coluna Direita */}
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: 3,
                  }}
                >
                  <Box sx={{ borderBottom: "2px solid #cbd5e1", pb: 2 }}>
                    <Typography
                      variant="h4"
                      fontWeight="900"
                      color="#0f172a"
                      sx={{ textTransform: "uppercase", lineHeight: 1.1 }}
                    >
                      {friendData.nome || "Caçador Sem Nome"}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight="bold"
                      sx={{ mt: 0.5 }}
                    >
                      {friendData.arquetipo || "Arquétipo Desconhecido"}{" "}
                      {friendData.conceito ? `• ${friendData.conceito}` : ""}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        GUILDA
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.guilda || "Independente"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        IDADE
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.idade || "Desconhecida"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        ALTURA
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.altura || "Não informada"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        PESO
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#334155"
                      >
                        {friendData.peso || "Não informado"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ mt: "auto", pt: 2, borderTop: "1px dashed #cbd5e1" }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.secondary"
                      gutterBottom
                    >
                      EQUIPAMENTO REGISTRADO
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {friendData.armas?.length > 0
                        ? friendData.armas.slice(0, 3).map((w, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                bgcolor: "#f1f5f9",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                ⚔️ {w.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Dano: {w.damage || "—"}
                              </Typography>
                            </Box>
                          ))
                        : null}
                      {friendData.armaduras?.length > 0
                        ? friendData.armaduras.slice(0, 2).map((a, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                bgcolor: "#f1f5f9",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                🛡️ {a.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Def: +{a.defense || a.def || 0}
                              </Typography>
                            </Box>
                          ))
                        : null}
                      {!friendData.armas?.length &&
                        !friendData.armaduras?.length && (
                          <Typography variant="body2" color="text.secondary">
                            Nenhum equipamento registrado.
                          </Typography>
                        )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography>Dados não encontrados.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Ficha de Monstro */}
      <Dialog
        open={monsterModalOpen}
        onClose={() => setMonsterModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" fontWeight="bold">
            Ficha do Bestiário
          </Typography>
          <IconButton onClick={() => setMonsterModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ p: 0, height: "70vh", bgcolor: "#f1f5f9" }}
        >
          {loadingMonster ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : selectedMonsterData ? (
            <Box sx={{ p: { xs: 2, md: 4 }, height: "100%" }}>
              <MonsterCard monster={selectedMonsterData} />
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              Monstro não encontrado.
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GameModal;
