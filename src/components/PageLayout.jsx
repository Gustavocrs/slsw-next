"use client";

import React, {useState, useEffect} from "react";
import {Box} from "@mui/material";
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import {useAuth} from "@/hooks";
import {useCharacterStore} from "@/stores/characterStore";
import {useCharacterAPI} from "@/hooks";
import GameModal from "@/components/Table/GameModal";

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {user} = useAuth();
  const {list} = useCharacterAPI();

  // EFEITO DE CARREGAMENTO ÚNICO
  useEffect(() => {
    if (user?.uid) {
      console.log("Usuário logado, tentando buscar ficha uma única vez...");
      list().catch((err) => console.log("Erro silencioso ao listar:", err));
    }
  }, [user?.uid]); // Dependência apenas do ID do usuário

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      id="DIVV"
      style={{
        padding: "0",
        width: "100%",
        height: "100vh",
        paddingBottom: "15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Footer onToggleSidebar={handleToggleSidebar} currentView="game" /> */}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{flex: 1, overflow: "hidden"}}>
        <GameModal />
      </Box>
    </div>
  );
}
