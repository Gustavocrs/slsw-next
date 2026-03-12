"use client";

import React, {useState, useEffect} from "react";
import {styled} from "@mui/material/styles";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import {useAuth} from "@/hooks";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import APIService from "@/lib/api";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Save as SaveIcon,
  MenuBook as BookIcon,
  Google as GoogleIcon,
  Menu as MenuIcon,
  SportsEsports as GameIcon,
} from "@mui/icons-material";
import UserMenu from "../UserMenu";
import CreateTableModal from "../Table/CreateTableModal";
import TableListModal from "../Table/TableListModal";
import TableDetailsModal from "../Table/TableDetailsModal";
import GameModal from "../Table/GameModal";
import InspectSheetModal from "../Table/InspectSheetModal";
import {db} from "@/lib/firebase";
import MessagesDashboard from "../Messages/MessagesDashboard";

// Função auxiliar para escurecer cor para o gradiente (simples)
const adjustColor = (color, amount) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
};

const StyledAppBar = styled(AppBar)(({theme, customcolors, footerstyle}) => {
  const baseColor = customcolors?.bg || "#667eea";
  let bg = baseColor;
  let borderTop = "none";

  if (footerstyle === "solid") {
    bg = baseColor;
  } else if (footerstyle === "gradient") {
    // Cria um gradiente baseado na cor escolhida
    bg = `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(baseColor, -40)} 100%)`;
  } else if (footerstyle === "dual") {
    // Estilo Dual (borda superior colorida, fundo mais escuro)
    bg = "#0f172a";
    borderTop = `3px solid ${baseColor}`;
  }

  return {
    position: "fixed",
    bottom: 0,
    top: "auto",
    background: bg,
    borderTop: borderTop,
    color: customcolors?.text || "#fff",
    boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1200,
    "@media print": {
      display: "none",
    },
  };
});

const HeaderContent = styled(Toolbar)(({theme}) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 16px",
  minHeight: "64px",
}));

const UserSection = styled(Box)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
}));

const ControlsSection = styled(Box)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  height: "30px",
}));

const HeaderButton = styled(Button)(({theme, customcolors}) => ({
  color: customcolors?.text || "white",
  textTransform: "none",
  fontWeight: 600,
  background: customcolors?.btnBg || "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(4px)",
  borderRadius: "8px",
  padding: "6px 16px",
  minWidth: "auto",

  "&:hover": {
    background: customcolors?.btnHover || "rgba(255, 255, 255, 0.2)",
  },

  "&.Mui-disabled": {
    color: "rgba(255, 255, 255, 0.5)",
  },

  [theme.breakpoints.down("sm")]: {
    minWidth: "auto",
    padding: "8px",
    borderRadius: "50%",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
}));

function Header({onToggleSidebar, currentView, onViewChange, onSave, onLoad}) {
  const {user, loading, loginWithGoogle} = useAuth();
  const {
    viewMode,
    toggleView,
    setViewMode,
    toggleTableListModal,
    notification,
    hideNotification,
    selectedTable,
    toggleTableDetailsModal,
    toggleGameModal,
    setSelectedTable,
  } = useUIStore();
  const setNotifications = useUIStore((state) => state.setNotifications);

  // Ler cores da ficha atual para personalizar o Header
  const character = useCharacterStore((state) => state.character);
  const headerColors = {
    bg: character?.sheetColors?.footerBackground,
    text: character?.sheetColors?.footerText,
    btnBg: character?.sheetColors?.footerButtonBg,
    btnHover: character?.sheetColors?.footerHover,
  };
  const footerStyle = character?.sheetPreferences?.footerStyle || "gradient";

  const [isSaving, setIsSaving] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sincronização Prop -> Store: Quando a página muda a view, atualiza o store
  useEffect(() => {
    if (currentView && currentView !== viewMode) {
      setViewMode(currentView);
    }
  }, [currentView, viewMode, setViewMode]);

  // Auto-selecionar mesa ao logar (GM ou Jogador)
  useEffect(() => {
    const autoSelectTable = async () => {
      if (user && !selectedTable) {
        try {
          const tables = await APIService.getTables(user.email, user.uid);
          // Prioriza mesa onde é GM, senão pega a primeira disponível
          const tableToSelect =
            tables.find((t) => t.gmId === user.uid) || tables[0];
          if (tableToSelect) {
            setSelectedTable(tableToSelect);
          }
        } catch (error) {
          console.error("Erro ao carregar mesas:", error);
        }
      }
    };
    autoSelectTable();
  }, [user, selectedTable, setSelectedTable]);

  useEffect(() => {
    if (!user?.uid || !selectedTable?._id) return;

    const unsubscribe = onSnapshot(
      doc(db, "tables", selectedTable._id),
      (docSnap) => {
        if (!docSnap.exists()) {
          setSelectedTable(null);
          return;
        }

        const data = {_id: docSnap.id, ...docSnap.data()};
        const userEmail = user.email?.toLowerCase();
        const isUserGM = data.gmId === user.uid;
        const isUserPlayer = data.playerIds?.includes(user.uid);
        const isUserInvited = data.invites?.some(
          (invite) => invite.toLowerCase() === userEmail,
        );

        if (!isUserGM && !isUserPlayer && !isUserInvited) {
          setSelectedTable(null);
          return;
        }

        setSelectedTable(data);
      },
      (error) => {
        console.error("Erro ao sincronizar mesa selecionada:", error);
      },
    );

    return () => unsubscribe();
  }, [selectedTable?._id, setSelectedTable, user?.email, user?.uid]);

  // Listener de notificações de mensagens não lidas
  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      return;
    }

    const q = query(collection(db, "users", user.uid, "notifications"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user?.uid, setNotifications]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login falhou", error);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleView = async () => {
    const next = (currentView || viewMode) === "book" ? "sheet" : "book";

    // ATENÇÃO: Removemos a chamada automática de onLoad aqui para evitar conflitos
    // O carregamento deve ser feito apenas na inicialização ou manualmente se necessário

    if (onViewChange) {
      onViewChange(next);
    } else {
      toggleView();
    }
  };

  return (
    <>
      <StyledAppBar
        position="fixed"
        color="primary"
        customcolors={headerColors}
        footerstyle={footerStyle}
      >
        <HeaderContent>
          <UserSection>
            <UserMenu />
          </UserSection>

          <ControlsSection>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : !user ? (
              <HeaderButton
                startIcon={<GoogleIcon />}
                onClick={handleLogin}
                customcolors={headerColors}
              >
                {isMobile ? "" : "Login"}
              </HeaderButton>
            ) : (
              <>
                {selectedTable && selectedTable._id && (
                  <HeaderButton
                    customcolors={headerColors}
                    startIcon={<GameIcon />}
                    onClick={toggleGameModal}
                    sx={{mr: 1}}
                  >
                    {isMobile ? "" : "Jogo"}
                  </HeaderButton>
                )}

                <HeaderButton
                  customcolors={headerColors}
                  startIcon={
                    (currentView || viewMode) === "book" ? (
                      <AssignmentIcon />
                    ) : (
                      <BookIcon />
                    )
                  }
                  onClick={handleToggleView}
                >
                  {isMobile
                    ? ""
                    : (currentView || viewMode) === "book"
                      ? "Ficha"
                      : "Livro"}
                </HeaderButton>

                {(currentView || viewMode) === "sheet" && (
                  <>
                    <HeaderButton
                      customcolors={headerColors}
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{
                        // Força a cor personalizada no botão de salvar também
                        color: headerColors.text,
                        background:
                          headerColors.btnBg || "rgba(255, 255, 255, 0.2)",
                        border: `1px solid ${headerColors.text}40`,
                        // O hover já é tratado pelo styled component via customcolors,
                        // mas se precisarmos forçar algo específico para o botão Salvar, mantemos aqui ou removemos para consistência.
                      }}
                    >
                      {isMobile ? "" : isSaving ? "..." : "Salvar"}
                    </HeaderButton>
                  </>
                )}
              </>
            )}
          </ControlsSection>
        </HeaderContent>
      </StyledAppBar>

      {/* Modais Globais */}
      <CreateTableModal />
      <TableListModal />
      <TableDetailsModal />
      <GameModal />
      <InspectSheetModal />
      <MessagesDashboard />

      {/* Notificações Globais */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          sx={{width: "100%"}}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Header;
