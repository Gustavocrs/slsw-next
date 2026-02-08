/**
 * Header Component
 * Barra fixa com login, toggle view, salvar
 */

"use client";

import React, {useState} from "react";
import styled from "styled-components";
import {useAuth} from "@/hooks";
import {useUIStore} from "@/stores/characterStore";
import {AppBar, Toolbar, Button, IconButton, Box} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
  MenuBook as MenuBookIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

const StyledAppBar = styled(AppBar)`
  position: fixed;
  bottom: 0;
  top: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
`;

const HeaderContent = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const UserSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: auto;
`;

const ControlsSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
`;

const HeaderButton = styled(Button)`
  && {
    color: white;
    text-transform: none;
    font-weight: 500;
    display: flex;
    gap: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

function Header({onSave, onToggleSidebar, currentView, onViewChange}) {
  const {user, isAuthenticated, loginWithGoogle, logoutUser} = useAuth();
  const {viewMode, toggleView} = useUIStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Erro no login:", error);
      alert(`Erro ao logar: ${error.message}`);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para salvar!");
      return;
    }
    setIsSaving(true);
    try {
      await onSave?.();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(
        `Erro ao salvar: ${error.message || "Verifique o console para detalhes."}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StyledAppBar>
      <HeaderContent>
        {/* Seção do Usuário */}
        {isAuthenticated && (
          <UserSection>
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
            <UserName>{user?.displayName?.split(" ")[0]}</UserName>
            <IconButton onClick={logoutUser} sx={{color: "white"}} size="small">
              <LogoutIcon />
            </IconButton>
          </UserSection>
        )}

        {/* Controles */}
        <ControlsSection>
          {isAuthenticated && (
            <>
              <HeaderButton
                startIcon={
                  (currentView || viewMode) === "book" ? (
                    <AssignmentIcon />
                  ) : (
                    <MenuBookIcon />
                  )
                }
                onClick={() => {
                  // Prefer the PageLayout local handler when provided
                  if (onViewChange) {
                    const next =
                      (currentView || viewMode) === "book" ? "sheet" : "book";
                    onViewChange(next);
                  } else {
                    toggleView();
                  }
                }}
                size="small"
              >
                {(currentView || viewMode) === "book" ? "Ficha" : "Livro"}
              </HeaderButton>

              <HeaderButton
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
                size="small"
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </HeaderButton>
            </>
          )}

          {!isAuthenticated && (
            <HeaderButton startIcon={<GoogleIcon />} onClick={handleLogin}>
              Login
            </HeaderButton>
          )}
        </ControlsSection>
      </HeaderContent>
    </StyledAppBar>
  );
}

export default Header;
