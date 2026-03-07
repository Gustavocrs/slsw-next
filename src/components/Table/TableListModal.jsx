/**
 * TableListModal Component
 * Dashboard para listar mesas, ver convites e acessar fichas de jogadores
 */

"use client";

import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";

function TableListModal() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {tableListModalOpen, toggleTableListModal, toggleTableCreateModal} =
    useUIStore();
  const {user} = useAuth();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar mesas ao abrir o modal
  useEffect(() => {
    if (tableListModalOpen && user) {
      fetchTables();
    }
  }, [tableListModalOpen, user]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await APIService.getTables(user.email, user.uid);
      setTables(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    toggleTableListModal(); // Fecha lista
    toggleTableCreateModal(); // Abre criação
  };

  return (
    <Dialog
      open={tableListModalOpen}
      onClose={toggleTableListModal}
      fullScreen={fullScreen}
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
          🛡️ Minhas Mesas
        </Typography>
        <IconButton onClick={toggleTableListModal} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{bgcolor: "#f5f7fa"}}>
        <Box sx={{mb: 3, display: "flex", justifyContent: "flex-end"}}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Nova Mesa
          </Button>
        </Box>

        {loading ? (
          <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
            <CircularProgress />
          </Box>
        ) : tables.length === 0 ? (
          <Box sx={{textAlign: "center", py: 4, color: "#666"}}>
            <Typography>Você ainda não participa de nenhuma mesa.</Typography>
          </Box>
        ) : (
          <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            {tables.map((table) => {
              const isGM = table.gmId === user?.uid;

              return (
                <Card
                  key={table._id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        {table.name}
                      </Typography>
                      <Chip
                        label={isGM ? "Mestre" : "Jogador"}
                        color={isGM ? "secondary" : "default"}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{mb: 2}}
                    >
                      {table.description || "Sem descrição."}
                    </Typography>

                    <Divider sx={{my: 2}} />

                    {/* Seção de Jogadores / Convites */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon fontSize="small" /> Jogadores & Convites
                      </Typography>

                      <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
                        {/* Lista de Convites Pendentes */}
                        {(table.invites || []).map((email) => (
                          <Chip
                            key={email}
                            icon={<EmailIcon fontSize="small" />}
                            label={email}
                            variant="outlined"
                            size="small"
                            color="warning"
                            title="Convite Pendente"
                          />
                        ))}

                        {/* Futuro: Lista de Jogadores Aceitos */}
                        {(!table.invites || table.invites.length === 0) && (
                          <Typography variant="caption" color="text.secondary">
                            Nenhum jogador convidado.
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TableListModal;
