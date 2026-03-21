"use client";

import React, {useState, useEffect} from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {Google as GoogleIcon} from "@mui/icons-material";
import Sidebar from "@/components/Sidebar";
import {useAuth} from "@/hooks";
import {useUIStore, useCharacterStore} from "@/stores/characterStore";
import {useCharacterAPI} from "@/hooks";
import GameModal from "@/components/TableView/GameModal";
import APIService from "@/lib/api";
import {collection, query, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase";
import CreateTableModal from "@/components/TableView/CreateTableModal";
import TableListModal from "@/components/TableView/TableListModal";
import TableDetailsModal from "@/components/TableView/TableDetailsModal";
import InspectSheetModal from "@/components/TableView/InspectSheetModal";
import MessagesDashboard from "@/components/Messages";

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {user, loading, loginWithGoogle} = useAuth();
  const {list} = useCharacterAPI();
  const {
    selectedTable,
    setSelectedTable,
    notification,
    hideNotification,
    setNotifications,
    toggleTableListModal,
  } = useUIStore();

  // EFEITO DE CARREGAMENTO ÚNICO
  useEffect(() => {
    if (user?.uid) {
      console.log("Usuário logado, tentando buscar ficha uma única vez...");
      list().catch((err) => console.log("Erro silencioso ao listar:", err));
    }
  }, [user?.uid]); // Dependência apenas do ID do usuário

  // EFEITO: Auto-selecionar mesa ao logar
  useEffect(() => {
    const autoSelectTable = async () => {
      if (user && !selectedTable) {
        try {
          const tables = await APIService.getTables(user.email, user.uid);
          const tableToSelect =
            tables.find((t) => t.gmId === user.uid) || tables[0];

          if (tableToSelect) {
            setSelectedTable(tableToSelect);
          } else {
            // Se o usuário não possui mesa ativa, abre o gerenciador de mesas automaticamente
            toggleTableListModal();
          }
        } catch (error) {
          console.error("Erro ao carregar mesas:", error);
        }
      }
    };
    autoSelectTable();
  }, [user, selectedTable, setSelectedTable, toggleTableListModal]);

  // EFEITO: Listener de notificações e mensagens
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

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f7fa",
          gap: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          SLSW
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Faça login para acessar suas mesas e personagens
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={loginWithGoogle}
          sx={{mt: 2}}
        >
          Entrar com Google
        </Button>
      </Box>
    );
  }

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
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{flex: 1, overflow: "hidden"}}>
        <GameModal />
      </Box>

      {/* Modais Globais de Gestão (Antes ficavam no Footer) */}
      <CreateTableModal />
      <TableListModal />
      <TableDetailsModal />
      <InspectSheetModal />
      <MessagesDashboard />

      <Snackbar
        open={notification?.open || false}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      >
        <Alert
          onClose={hideNotification}
          severity={notification?.severity || "info"}
          sx={{width: "100%"}}
          variant="filled"
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
