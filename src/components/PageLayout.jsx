"use client";

import React, {useState, useEffect} from "react";
import {Box} from "@mui/material";
import BookView from "@/components/BookView";
import SheetView from "@/components/SheetView";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import {useAuth} from "@/hooks";
import {useCharacterStore} from "@/stores/characterStore";
import {useCharacterAPI} from "@/hooks";

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("book");
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {user} = useAuth();
  // Pegamos o create e update, mas NÃO vamos passar o list para o Header agora
  const {update, create, list} = useCharacterAPI();
  const character = useCharacterStore((s) => s.character);
  const loadCharacter = useCharacterStore((s) => s.loadCharacter);

  // EFEITO DE CARREGAMENTO ÚNICO
  // Só carrega a ficha UMA vez quando o usuário loga, e não toda hora
  useEffect(() => {
    if (user?.uid) {
      console.log("Usuário logado, tentando buscar ficha uma única vez...");
      list().catch((err) => console.log("Erro silencioso ao listar:", err));
    }
  }, [user?.uid]); // Dependência apenas do ID do usuário

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSave = async () => {
    try {
      if (!user?.uid) return;

      if (character?._id) {
        await update(character._id, character);
      } else {
        const {_id, ...dataToCreate} = character;
        await create(dataToCreate);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <Box id="DIVV" sx={{padding: "0", width: "100%", height: "100%"}}>
      <Header
        onToggleSidebar={handleToggleSidebar}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSave={handleSave}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box>
        {currentView === "book" ? (
          <BookView onOpenSidebar={handleToggleSidebar} />
        ) : (
          <SheetView saveSuccess={saveSuccess} />
        )}
      </Box>
    </Box>
  );
}
