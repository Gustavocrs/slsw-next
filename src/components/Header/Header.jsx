"use client";

import React, {useState} from "react";
import styled from "styled-components";
import {useAuth} from "@/hooks";
import {useUIStore} from "@/stores/characterStore";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Save as SaveIcon,
  MenuBook as BookIcon, // NOME CORRIGIDO para não dar conflito
  Google as GoogleIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import UserMenu from "../UserMenu";

const StyledAppBar = styled(AppBar)`
  && {
    position: fixed;
    bottom: 0;
    top: auto;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1200;
  }
`;

const HeaderContent = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  min-height: 64px;
`;

const UserSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ControlsSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderButton = styled(Button)`
  && {
    color: white;
    text-transform: none;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 6px 16px;
    min-width: auto;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &.Mui-disabled {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

function Header({onToggleSidebar, currentView, onViewChange, onSave, onLoad}) {
  const {user, loading, googleLogin} = useAuth();
  const {viewMode, toggleView} = useUIStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = async () => {
    try {
      await googleLogin();
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
    <StyledAppBar position="fixed" color="primary">
      <HeaderContent>
        <UserSection>
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton> */}

          <UserMenu />
        </UserSection>

        <ControlsSection>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : !user ? (
            <HeaderButton startIcon={<GoogleIcon />} onClick={handleLogin}>
              Login
            </HeaderButton>
          ) : (
            <>
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
                {(currentView || viewMode) === "book" ? "Ficha" : "Livro"}
              </HeaderButton>

              {(currentView || viewMode) === "sheet" && (
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
                  {isSaving ? "..." : "Salvar"}
                </HeaderButton>
              )}
            </>
          )}
        </ControlsSection>
      </HeaderContent>
    </StyledAppBar>
  );
}

export default Header;
