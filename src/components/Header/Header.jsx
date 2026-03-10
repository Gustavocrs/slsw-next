"use client";

import React, {useState, useEffect} from "react";
import {styled} from "@mui/material/styles";
import {useAuth} from "@/hooks";
import {useUIStore} from "@/stores/characterStore";
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

const StyledAppBar = styled(AppBar)(({theme}) => ({
  position: "fixed",
  bottom: 0,
  top: "auto",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
  zIndex: 1200,
  "@media print": {
    display: "none",
  },
}));

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

const HeaderButton = styled(Button)(({theme}) => ({
  color: "white",
  textTransform: "none",
  fontWeight: 600,
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(4px)",
  borderRadius: "8px",
  padding: "6px 16px",
  minWidth: "auto",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
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
  const [isSaving, setIsSaving] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sincronização Prop -> Store: Quando a página muda a view, atualiza o store
  useEffect(() => {
    if (currentView && currentView !== viewMode) {
      setViewMode(currentView);
    }
  }, [currentView, viewMode, setViewMode]);

  // Auto-selecionar mesa se o usuário for GM ao logar
  useEffect(() => {
    const autoSelectTable = async () => {
      if (user && !selectedTable) {
        try {
          const tables = await APIService.getTables(user.email, user.uid);
          const gmTable = tables.find((t) => t.gmId === user.uid);
          if (gmTable) {
            setSelectedTable(gmTable);
          }
        } catch (error) {
          console.error("Erro ao carregar mesas do GM:", error);
        }
      }
    };
    autoSelectTable();
  }, [user, selectedTable, setSelectedTable]);

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
      <StyledAppBar position="fixed" color="primary">
        <HeaderContent>
          <UserSection>
            <UserMenu />
          </UserSection>

          <ControlsSection>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : !user ? (
              <HeaderButton startIcon={<GoogleIcon />} onClick={handleLogin}>
                {isMobile ? "" : "Login"}
              </HeaderButton>
            ) : (
              <>
                {selectedTable && selectedTable._id && (
                  <HeaderButton
                    startIcon={<GameIcon />}
                    onClick={toggleGameModal}
                    sx={{mr: 1}}
                  >
                    {isMobile ? "" : "Jogo"}
                  </HeaderButton>
                )}

                <HeaderButton
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
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                      color="secondary"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {background: "rgba(255, 255, 255, 0.3)"},
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
