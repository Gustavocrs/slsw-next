/**
 * GameModal Component
 * Painel de Jogo (Dashboard da Sessão)
 */

"use client";

import {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Divider,
  Chip,
  Badge,
  useMediaQuery,
  useTheme,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  Description as SheetIcon,
  Message as MessageIcon,
  AttachFile as FileIcon,
  Security as GmIcon,
  PersonRemove as PersonRemoveIcon,
  Settings as SettingsIcon,
  PersonAdd as AddNpcIcon,
  SwapHoriz as SwitchTableIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  Bed as RestIcon,
  Hotel as SleepIcon,
  FlashOn as StunIcon,
  LocalHospital as DamageIcon,
  BatteryAlert as FatigueIcon,
  Dangerous as CorruptionIcon,
  Spa as PurifyIcon,
  LocalPharmacy as HealthPotionIcon,
  LocalDrink as ManaPotionIcon,
  Medication as AntidoteIcon,
  Healing as HealIcon,
  Science as PoisonIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  limit,
} from "firebase/firestore";
import {db} from "@/lib/firebase";
import GameFileManager from "@/components/GameFileManager";
import ChatModal from "./ChatModal";
import {calculateMaxMana} from "@/lib/rpgEngine";
import {
  getTableGameSession,
  SHEET_LOCK_GROUPS,
  SHEET_LOCK_KEYS,
} from "@/lib/sheetLocks";
import {
  getCharacterStatusEffects,
  toggleCharacterStatusEffect,
} from "@/lib/characterStatus";

// Sub-componente para item da lista de jogadores com listener em tempo real
const PlayerListItem = ({player, isGMView, onClick}) => {
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

  const safePhotoURL = player.photoURL?.includes("googleusercontent.com")
    ? player.photoURL.replace("=s96-c", "=s100-c")
    : player.photoURL;

  // Formatar nome: Apenas os dois primeiros nomes
  const displayName = player.name
    ? player.name.split(" ").slice(0, 2).join(" ")
    : "Sem Nome";

  const maxMana = charData ? calculateMaxMana(charData) : 0;
  const currentMana =
    charData?.mana_atual !== undefined ? charData.mana_atual : maxMana;
  const wounds = charData?.ferimentos || 0;
  const fatigue = charData?.fadiga || 0;

  const isDead = wounds >= 5;
  const isUnconscious = wounds === 4 || fatigue >= 3;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "#f5f7fa",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        },
        border: "1px solid #e0e0e0",
      }}
      onClick={(e) => onClick(e, player)}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
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
          src={safePhotoURL}
          alt={player.name}
          sx={{width: 40, height: 40}}
          imgProps={{referrerPolicy: "no-referrer"}}
        />
      </Badge>

      <Grid container alignItems="center">
        <Grid item xs={player.isGM ? 12 : 7}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {player.isGM ? "Game Master" : isGMView ? "Ver opções" : "Jogador"}
          </Typography>
        </Grid>
        {!player.isGM && (
          <Grid
            item
            xs={5}
            sx={{textAlign: "right", fontSize: "0.7rem", lineHeight: 1.3}}
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
                  fontSize: "0.75rem",
                }}
              >
                MORTO 💀
              </Typography>
            ) : isUnconscious ? (
              <Typography
                sx={{
                  color: "#d32f2f",
                  fontWeight: "800",
                  bgcolor: "#ffebee",
                  p: 0.5,
                  borderRadius: 1,
                  textAlign: "center",
                  fontSize: "0.75rem",
                }}
              >
                DESACORDADO 💤
              </Typography>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    color: "#d32f2f",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                  }}
                >
                  {wounds} <DamageIcon sx={{fontSize: 16, ml: 0.5}} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    color: "#ed6c02",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                  }}
                >
                  {fatigue} <FatigueIcon sx={{fontSize: 16, ml: 0.5}} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    color: "#1976d2",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                  }}
                >
                  {currentMana}/{maxMana}{" "}
                  <span
                    style={{
                      fontSize: "1.1em",
                      marginLeft: "4px",
                      lineHeight: 1,
                    }}
                  >
                    🌀
                  </span>
                </Box>
              </>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

function GameModal() {
  const {
    gameModalOpen,
    toggleGameModal,
    selectedTable,
    showNotification,
    toggleTableDetailsModal,
    setSelectedTable,
    toggleInspectModal,
    toggleChat,
    openChatWith,
  } = useUIStore();
  const {setInspectedCharacter} = useCharacterStore();
  const {user} = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuType, setSubmenuType] = useState(null);

  // Estados para NPC e Troca de Mesa
  const [npcModalOpen, setNpcModalOpen] = useState(false);
  const [myCharacters, setMyCharacters] = useState([]);
  const [loadingNpcs, setLoadingNpcs] = useState(false);
  const [tablesMenuAnchor, setTablesMenuAnchor] = useState(null);
  const [myTables, setMyTables] = useState([]);
  const [mobileTab, setMobileTab] = useState(0);
  const [gameSettingsOpen, setGameSettingsOpen] = useState(false);
  const [selectedGameLocks, setSelectedGameLocks] = useState([]);
  const [savingGameSettings, setSavingGameSettings] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isGM = selectedTable?.gmId === user?.uid;
  const gameSession = getTableGameSession(selectedTable);
  const lockedFieldsCount = gameSession.lockedFields.length;

  // Efeito para sincronização em tempo real e verificação de segurança
  useEffect(() => {
    if (!gameModalOpen || !selectedTable?._id || !user) return;

    const tableRef = doc(db, "tables", selectedTable._id);

    const unsubscribe = onSnapshot(
      tableRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setSelectedTable(null);
          return;
        }

        const data = {_id: docSnap.id, ...docSnap.data()};

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
  }, [
    gameModalOpen,
    selectedTable?._id,
    user,
    toggleGameModal,
    setSelectedTable,
    showNotification,
  ]);

  const handlePlayerClick = (event, player) => {
    // 1. Permitir clicar em si mesmo (para ver ficha ou configurar)
    if (player.uid === user?.uid) {
      setAnchorEl(event.currentTarget);
      setSelectedPlayer(player);
      return;
    }

    // 2. Lógica de Permissão para outros
    if (isGM) {
      // GM pode clicar em qualquer um
      setAnchorEl(event.currentTarget);
      setSelectedPlayer(player);
    } else {
      // Jogador só pode clicar no GM
      if (player.isGM) {
        setAnchorEl(event.currentTarget);
        setSelectedPlayer(player);
      }
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
    setSubmenuType(null);
    setSelectedPlayer(null);
  };

  const handleOpenSubmenu = (type, event) => {
    setSubmenuAnchorEl(event.currentTarget);
    setSubmenuType(type);
  };

  const handleCloseSubmenu = () => {
    setSubmenuAnchorEl(null);
    setSubmenuType(null);
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
        toggleInspectModal();
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
      setSelectedTable({...selectedTable, players: updatedPlayers});
      showNotification(`${selectedPlayer.name} removido da mesa.`, "info");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao remover jogador.", "error");
    }
    handleCloseMenu();
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
          updates.mana_atual = Math.min(
            currentMana + manaRecovery,
            maxMana,
          );
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

          if (currentWounds >= 5) {
            showNotification(`${targetPlayer.name} já está morto.`, "error");
            return;
          }

          const newWounds = currentWounds + 1;
          updates.ferimentos = newWounds;
          updates.abalado = true; // Dano sempre abala

          if (newWounds >= 5) {
            showNotification(`${targetPlayer.name} MORREU!`, "error");
          } else if (newWounds === 4) {
            showNotification(
              `${targetPlayer.name} desmaiou por ferimentos!`,
              "warning",
            );
          } else {
            showNotification(
              `Dano aplicado em ${targetPlayer.name}.`,
              "error",
            );
          }
          break;
        }
        case "heal_damage": // Curar Dano
          if ((charData.ferimentos || 0) >= 5) {
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
          if (currentFatigue >= 3) {
            showNotification(
              `${targetPlayer.name} já está desmaiado de exaustão.`,
              "warning",
            );
            return;
          }

          const newFatigue = currentFatigue + 1;
          updates.fadiga = newFatigue;

          if (newFatigue >= 3) {
            showNotification(
              `${targetPlayer.name} desmaiou de exaustão!`,
              "warning",
            );
            updates.abalado = true;
          } else {
            showNotification(
              `${targetPlayer.name} sofreu Fadiga.`,
              "warning",
            );
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
          updates.ferimentos = Math.max(
            (charData.ferimentos || 0) - healingTier,
            0,
          );
          showNotification(
            `${targetPlayer.name} usou Poção de Cura (+${payload.amount || 5}).`,
            "success",
          );
          break;
        case "potion_mana":
          updates.mana_atual = Math.min(
            currentMana + (payload.amount || 10),
            maxMana,
          );
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
          if (!(charData.envenenado || getCharacterStatusEffects(charData).includes("Envenenado"))) {
            updates.status_efeitos = getCharacterStatusEffects(charData);
            updates.envenenado = false;
          }
          showNotification(`${targetPlayer.name} usou Antídoto.`, "success");
          break;
        case "toggle_effect": {
          const effectLabel = payload.effectLabel;
          if (!effectLabel) return;
          const effectState = toggleCharacterStatusEffect(charData, effectLabel);
          Object.assign(updates, effectState.updates);
          showNotification(
            `${targetPlayer.name} ${effectState.isActive ? `recebeu ${effectLabel}` : `não está mais com ${effectLabel}`}.`,
            effectState.isActive ? "warning" : "info",
          );
          break;
        }
        case "custom_effect": {
          const customEffect = window
            .prompt(
              "Digite o status de RPG. Se ele já existir na ficha, será removido.",
            )
            ?.trim();

          if (!customEffect) return;

          const effectState = toggleCharacterStatusEffect(charData, customEffect);
          Object.assign(updates, effectState.updates);
          showNotification(
            `${targetPlayer.name} ${effectState.isActive ? `recebeu ${customEffect}` : `não está mais com ${customEffect}`}.`,
            effectState.isActive ? "warning" : "info",
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

  return (
    <>
      <Dialog
        open={gameModalOpen}
        onClose={toggleGameModal}
        fullScreen
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
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Typography variant="h6" component="span" fontWeight="bold">
              {selectedTable
                ? `🎮 Painel de Jogo: ${selectedTable.name}`
                : "🎮 Painel de Jogo"}
            </Typography>
            {selectedTable && (
              <>
                <IconButton
                  size="small"
                  onClick={() => toggleChat()}
                  title="Chat Global"
                >
                  <MessageIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleOpenTablesMenu}
                  title="Trocar Mesa"
                >
                  <SwitchTableIcon />
                </IconButton>
              </>
            )}
          </Box>
          <IconButton onClick={toggleGameModal} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: "#f5f7fa",
            p: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!selectedTable ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
                p: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6" align="center">
                Nenhuma mesa disponível ou selecionada.
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenTablesMenu}
                startIcon={<SwitchTableIcon />}
              >
                Selecionar Mesa
              </Button>
            </Box>
          ) : (
            <>
              {isMobile && (
                <Paper
                  square
                  elevation={1}
                  sx={{position: "sticky", top: 0, zIndex: 10}}
                >
                  <Tabs
                    value={mobileTab}
                    onChange={(_e, v) => setMobileTab(v)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab icon={<InfoIcon />} label="Mesa" />
                    <Tab icon={<GroupIcon />} label="Jogadores" />
                  </Tabs>
                </Paper>
              )}
              <Grid container sx={{minHeight: "100%"}}>
                {/* Coluna Esquerda: Configurações */}
                <Grid
                  item
                  xs={12}
                  md={8}
                  sx={{
                    p: {xs: 2, md: 3},
                    display: {
                      xs: mobileTab === 0 ? "block" : "none",
                      md: "block",
                    },
                  }}
                >
                  {/* Área do Mestre */}
                  {isGM && (
                    <Accordion
                      defaultExpanded
                      disableGutters
                      elevation={0}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        borderLeft: "4px solid #7b1fa2",
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box
                          sx={{display: "flex", alignItems: "center", gap: 1}}
                        >
                          <GmIcon fontSize="small" color="secondary" />
                          <Typography
                            variant="h6"
                            color="secondary"
                            fontWeight="bold"
                          >
                            Área do Mestre
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{bgcolor: "#fff", borderTop: "1px solid #f0f0f0"}}
                      >
                        <Box
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #d1c4e9",
                            bgcolor: gameSession.isActive
                              ? "#f3e5f5"
                              : "#faf5ff",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: {xs: "flex-start", sm: "center"},
                              gap: 2,
                              flexDirection: {xs: "column", sm: "row"},
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                Controle da Sessão
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{display: "block", mt: 0.5}}
                              >
                                {gameSession.isActive
                                  ? `Jogo em andamento. ${lockedFieldsCount} ponto(s) da ficha bloqueado(s).`
                                  : "Defina os pontos da ficha que os jogadores não poderão editar durante a sessão."}
                              </Typography>
                            </Box>
                            <Button
                              variant={
                                gameSession.isActive ? "contained" : "outlined"
                              }
                              color={
                                gameSession.isActive ? "secondary" : "primary"
                              }
                              onClick={handleOpenGameSettings}
                            >
                              {gameSession.isActive
                                ? "Finalizar Jogo"
                                : "Iniciar Jogo"}
                            </Button>
                          </Box>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{mb: 2, display: "block"}}
                        >
                          Gerenciamento de Materiais e Ações da Campanha.
                        </Typography>
                        <GameFileManager
                          tableId={selectedTable._id}
                          files={selectedTable.files || []}
                          isGM={true}
                          hideList={false} // Mostrar lista de secretos
                          onlySecret={true} // Apenas secretos
                          forceSecretUpload={true} // Uploads aqui viram secretos
                        />
                      </AccordionDetails>
                    </Accordion>
                  )}

                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{mb: 2, borderRadius: 2, border: "1px solid #e0e0e0"}}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{bgcolor: "#fff", borderRadius: 2}}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        Dados da Campanha
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{bgcolor: "#fff", borderTop: "1px solid #f0f0f0"}}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          color: "text.secondary",
                          mb: 2,
                        }}
                      >
                        <GmIcon fontSize="small" />
                        <Typography variant="subtitle1">
                          GM: <strong>{selectedTable.gmName}</strong>
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        paragraph
                        sx={{whiteSpace: "pre-wrap"}}
                      >
                        {selectedTable.description ||
                          "Sem descrição disponível."}
                      </Typography>

                      <Divider sx={{my: 2}} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">
                            Próxima Sessão
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {selectedTable.nextSession
                              ? new Date(
                                  selectedTable.nextSession,
                                ).toLocaleString()
                              : "Não agendada"}
                          </Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Link Externo
                    </Typography>
                    <Typography variant="body2">
                      {selectedTable.externalLink ? (
                        <a
                          href={selectedTable.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{color: "#667eea", textDecoration: "none"}}
                        >
                          Acessar Link 🔗
                        </a>
                      ) : (
                        "Nenhum link"
                      )}
                    </Typography>
                  </Grid> */}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* Seção de Materiais e Anexos */}
                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{borderRadius: 2, border: "1px solid #e0e0e0"}}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        Materiais & Anexos
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{bgcolor: "#fff", borderTop: "1px solid #f0f0f0"}}
                    >
                      <GameFileManager
                        tableId={selectedTable._id}
                        files={selectedTable.files || []}
                        isGM={isGM}
                        hideUpload={!isGM} // GM pode fazer upload público aqui
                        excludeSecret={true} // Não mostrar secretos aqui
                      />
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Coluna Direita: Lista de Jogadores */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    bgcolor: "#fff",
                    borderLeft: {md: "1px solid #e0e0e0"},
                    p: 2,
                    overflowY: "auto",
                    display: {
                      xs: mobileTab === 1 ? "block" : "none",
                      md: "block",
                    },
                  }}
                >
                  {/* Seção do Game Master */}
                  <Divider textAlign="left" sx={{mb: 2, mt: 1}}>
                    <Chip label="Game Master" size="small" color="secondary" />
                  </Divider>

                  <Box sx={{mb: 3}}>
                    <PlayerListItem
                      player={gmData}
                      isGMView={isGM}
                      onClick={handlePlayerClick}
                    />
                  </Box>

                  {/* Seção dos Jogadores */}
                  <Divider textAlign="left" sx={{mb: 2}}>
                    <Chip label="Jogadores" size="small" />
                  </Divider>

                  <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    {(selectedTable.players || []).map((player) => {
                      return (
                        <PlayerListItem
                          key={player.uid}
                          player={player}
                          isGMView={isGM}
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
              sx: {minWidth: 240},
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
                {isGM && (
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
              !selectedPlayer?.isGM && [
                <Typography
                  key="title-sheet"
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    color: "text.secondary",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Ficha
                </Typography>,
                <MenuItem key="view-sheet" onClick={handleViewSheet}>
                  <ListItemIcon>
                    <SheetIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ver Ficha</ListItemText>
                </MenuItem>,
                <Typography
                  key="title-character"
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    color: "text.secondary",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Personagem
                </Typography>,
                <MenuItem key="send-msg" onClick={handleSendMessage}>
                  <ListItemIcon>
                    <MessageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Enviar Msg</ListItemText>
                </MenuItem>,
                <MenuItem key="req-file" onClick={handleRequestFile}>
                  <ListItemIcon>
                    <FileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Solicitar Arquivo</ListItemText>
                </MenuItem>,
                <Divider key="div-actions" />,
                <Typography
                  key="title-combat"
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    color: "text.secondary",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Combate
                </Typography>,
                <MenuItem key="act-stun" onClick={() => handleGMAction("stun")}>
                  <ListItemIcon>
                    <StunIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Abalar</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-remove-stun"
                  onClick={() => handleGMAction("remove_stun")}
                >
                  <ListItemIcon>
                    <HealIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText>Remover Abalado</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-dmg"
                  onClick={() => handleGMAction("damage")}
                >
                  <ListItemIcon>
                    <DamageIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{color: "error.main"}}>
                    Causar Dano
                  </ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-heal-dmg"
                  onClick={() => handleGMAction("heal_damage")}
                >
                  <ListItemIcon>
                    <HealIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText sx={{color: "success.main"}}>
                    Curar Dano
                  </ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-fatigue"
                  onClick={() => handleGMAction("fatigue")}
                >
                  <ListItemIcon>
                    <FatigueIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText sx={{color: "warning.dark"}}>
                    Fatigar
                  </ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-effects"
                  onClick={(event) => handleOpenSubmenu("effects", event)}
                >
                  <ListItemIcon>
                    <PoisonIcon fontSize="small" sx={{color: "#9c27b0"}} />
                  </ListItemIcon>
                  <ListItemText sx={{color: "#9c27b0"}}>Efeito</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,
                <Divider key="div-sit" />,
                <Typography
                  key="title-sit"
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    color: "text.secondary",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Situacionais
                </Typography>,
                <MenuItem
                  key="act-short"
                  onClick={() => handleGMAction("short_rest")}
                >
                  <ListItemIcon>
                    <RestIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Descanso Curto</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-long"
                  onClick={() => handleGMAction("long_rest")}
                >
                  <ListItemIcon>
                    <SleepIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Descanso Longo</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-corr-add"
                  onClick={() => handleGMAction("corruption_add")}
                >
                  <ListItemIcon>
                    <CorruptionIcon fontSize="small" sx={{color: "#7b1fa2"}} />
                  </ListItemIcon>
                  <ListItemText>Causar Corrupção</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="act-corr-rem"
                  onClick={() => handleGMAction("corruption_remove")}
                >
                  <ListItemIcon>
                    <PurifyIcon fontSize="small" sx={{color: "#4caf50"}} />
                  </ListItemIcon>
                  <ListItemText>Curar Corrupção</ListItemText>
                </MenuItem>,
                <Divider key="div-items" />,
                <Typography
                  key="title-items"
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    color: "text.secondary",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Itens
                </Typography>,
                <MenuItem
                  key="act-pot-heal"
                  onClick={(event) =>
                    handleOpenSubmenu("heal-potion", event)
                  }
                >
                  <ListItemIcon>
                    <HealthPotionIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Usar Poção de Cura</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,
                <MenuItem
                  key="act-pot-mana"
                  onClick={(event) =>
                    handleOpenSubmenu("mana-potion", event)
                  }
                >
                  <ListItemIcon>
                    <ManaPotionIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Usar Poção de Mana</ListItemText>
                  <ChevronRightIcon fontSize="small" />
                </MenuItem>,
                <MenuItem
                  key="act-antidote"
                  onClick={() => handleGMAction("antidote")}
                >
                  <ListItemIcon>
                    <AntidoteIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText>Usar Antídoto</ListItemText>
                </MenuItem>,
                <Divider key="divider-kick" />,
                <Typography
                  key="title-table"
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    color: "text.secondary",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  Mesa
                </Typography>,
                <MenuItem key="remove-player" onClick={handleRemovePlayer}>
                  <ListItemIcon>
                    <PersonRemoveIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{color: "error.main"}}>
                    Remover Jogador
                  </ListItemText>
                </MenuItem>,
              ]}

            {/* A opção de enviar mensagem só aparece se não for o próprio usuário */}
            {selectedPlayer?.uid !== user?.uid &&
              !(isGM && !selectedPlayer?.isGM) && (
                <MenuItem onClick={handleSendMessage}>
                  <ListItemIcon>
                    <MessageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Enviar Msg</ListItemText>
                </MenuItem>
              )}
          </Menu>

          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "effects"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            transformOrigin={{vertical: "top", horizontal: "left"}}
            PaperProps={{elevation: 3, sx: {minWidth: 220}}}
          >
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", {effectLabel: "Envenenado"})
              }
            >
              <ListItemText>Envenenar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", {effectLabel: "Paralisado"})
              }
            >
              <ListItemText>Paralisar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleGMAction("toggle_effect", {effectLabel: "Congelado"})
              }
            >
              <ListItemText>Congelar</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleGMAction("custom_effect")}>
              <ListItemText>Outros status de RPG</ListItemText>
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "heal-potion"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            transformOrigin={{vertical: "top", horizontal: "left"}}
            PaperProps={{elevation: 3}}
          >
            {[5, 10, 15].map((amount) => (
              <MenuItem
                key={`heal-${amount}`}
                onClick={() => handleGMAction("potion_heal", {amount})}
              >
                <ListItemText>{`+${amount}`}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          <Menu
            anchorEl={submenuAnchorEl}
            open={submenuType === "mana-potion"}
            onClose={handleCloseSubmenu}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            transformOrigin={{vertical: "top", horizontal: "left"}}
            PaperProps={{elevation: 3}}
          >
            {[5, 10, 15].map((amount) => (
              <MenuItem
                key={`mana-${amount}`}
                onClick={() => handleGMAction("potion_mana", {amount})}
              >
                <ListItemText>{`+${amount}`}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </DialogContent>

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
                selected={table._id === selectedTable._id}
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
              <Typography variant="body2" sx={{mb: 1}}>
                Selecione os pontos da ficha que ficarão bloqueados enquanto o
                jogo estiver em andamento.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A lista abaixo cobre todos os pontos editáveis da Ficha de
                Personagem.
              </Typography>
              <Box sx={{display: "flex", gap: 1, mt: 2, flexWrap: "wrap"}}>
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
                    sx={{p: 2, height: "100%", bgcolor: "#fff"}}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="primary"
                      sx={{mb: 1.5}}
                    >
                      {group.title}
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
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
            <Button onClick={handleCloseGameSettings} disabled={savingGameSettings}>
              Fechar
            </Button>
            <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
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
              <Typography sx={{p: 2, textAlign: "center"}}>
                Carregando seus personagens...
              </Typography>
            ) : myCharacters.length === 0 ? (
              <Typography
                sx={{p: 2, textAlign: "center", color: "text.secondary"}}
              >
                Você não tem personagens disponíveis ou todos já estão nesta
                mesa.
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
      </Dialog>
    </>
  );
}

export default GameModal;
