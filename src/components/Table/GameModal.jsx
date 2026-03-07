/**
 * GameModal Component
 * Painel de Jogo (Dashboard da Sessão)
 */

"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";

function GameModal() {
  const {gameModalOpen, toggleGameModal, selectedTable} = useUIStore();

  if (!selectedTable) return null;

  return (
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
        <Typography variant="h6" component="span" fontWeight="bold">
          🎮 Painel de Jogo: {selectedTable.name}
        </Typography>
        <IconButton onClick={toggleGameModal} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{p: 4, textAlign: "center", color: "text.secondary"}}>
          <Typography variant="h6" gutterBottom>
            Ferramentas da Sessão
          </Typography>
          <Typography>
            Aqui serão exibidos o Chat, Rolagem de Dados e Grid de Batalha.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default GameModal;
