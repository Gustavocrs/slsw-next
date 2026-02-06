/**
 * Page Layout Component
 * Componente principal que junta Header, Sidebar e Views
 */

"use client";

import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Box} from "@mui/material";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import SheetView from "./SheetView";
import BookView from "./BookView";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import {useAuth, useCharacterAPI} from "@/hooks";

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f3f4f6;
  padding-bottom: 70px;
`;

const MainContent = styled(Box)`
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const viewMode = useUIStore((state) => state.viewMode);
  const character = useCharacterStore((state) => state.character);
  const {user, isAuthenticated, loading} = useAuth();
  const {update, create, error: apiError} = useCharacterAPI();

  // Auto load sheet when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      // Você pode carregar aqui se desejar
      console.log("Usuário autenticado:", user.displayName);
    }
  }, [isAuthenticated, user]);

  const handleSave = async () => {
    try {
      if (!user?.uid) {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(null), 3000);
        return;
      }

      setSaveStatus("saving");

      // Se o personagem já tem um _id, atualiza; senão, cria um novo
      if (character?._id) {
        await update(character._id, character);
      } else {
        // Para novo personagem: limpamos campos internos e criamos
        const {_id, createdAt, updatedAt, ...dataToCreate} = character;
        await create(dataToCreate);
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header onSave={handleSave} />
        <MainContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <p>Carregando...</p>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header onSave={handleSave} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <MainContent>
        {viewMode === "book" ? (
          <BookView onOpenSidebar={() => setSidebarOpen(true)} />
        ) : (
          <SheetView />
        )}
      </MainContent>

      {/* Save Status Toast */}
      {saveStatus && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            fontWeight: 600,
            animation: "fadeInOut 0.3s ease",
            background:
              saveStatus === "success"
                ? "#10b981"
                : saveStatus === "error"
                  ? "#ef4444"
                  : "#667eea",
          }}
        >
          {saveStatus === "saving" && "💾 Salvando..."}
          {saveStatus === "success" && "✅ Salvo com sucesso!"}
          {saveStatus === "error" && "❌ Erro ao salvar"}
        </Box>
      )}
    </PageContainer>
  );
}

export default PageLayout;
