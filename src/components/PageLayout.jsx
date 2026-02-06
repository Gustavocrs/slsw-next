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
  const [currentView, setCurrentView] = useState("book"); // "book" ou "sheet"
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {user, isAuthenticated, loading} = useAuth();
  const {update, create} = useCharacterAPI();
  const character = useCharacterStore((s) => s.character);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSave = async () => {
    try {
      if (!user?.uid) {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(null), 3000);
        return;
      }

      setSaveStatus("saving");

      if (character?._id) {
        await update(character._id, character);
      } else {
        const {_id, createdAt, updatedAt, ...dataToCreate} = character;
        await create(dataToCreate);
      }

      setSaveStatus("success");
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveStatus(null);
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <Box>
      <Header
        onToggleSidebar={handleToggleSidebar}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSave={handleSave}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{p: 2, pb: 12}}>
        {currentView === "book" ? (
          <BookView onOpenSidebar={handleToggleSidebar} />
        ) : (
          <SheetView saveSuccess={saveSuccess} />
        )}
      </Box>
    </Box>
  );
}
