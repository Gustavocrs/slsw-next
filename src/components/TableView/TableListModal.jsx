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
  CircularProgress,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Launch as LaunchIcon,
  Send as SendIcon,
  Check as CheckIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";
import {ConfirmDialog} from "@/components/ConfirmDialog";

function TableListModal() {
  const {
    tableListModalOpen,
    toggleTableListModal,
    toggleTableCreateModal,
    toggleTableDetailsModal,
    setSelectedTable,
    tablesUpdated, // Gatilho de atualização
    showNotification,
  } = useUIStore();
  const {user} = useAuth();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [tableToDecline, setTableToDecline] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Carregar mesas ao abrir o modal
  useEffect(() => {
    if (tableListModalOpen && user) {
      fetchTables();
    }
  }, [tableListModalOpen, user, tablesUpdated]); // Adicionado tablesUpdated

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

  const handleTableClick = (table) => {
    setSelectedTable(table);
    toggleTableDetailsModal();
  };

  const handleResendInvite = async (e, table, email) => {
    e.stopPropagation(); // Impede abrir o modal de detalhes
    try {
      showNotification(`Reenviando para ${email}...`, "info");
      await APIService.sendTableInvite(
        table._id,
        email,
        table.gmName,
        table.name,
      );
      showNotification(`E-mail enviado para ${email}!`, "success");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao enviar e-mail.", "error");
    }
  };

  const handleAcceptInvite = async (e, table) => {
    e.stopPropagation();
    try {
      await APIService.acceptInvite(table._id, user);
      showNotification(`Você entrou na mesa "${table.name}"!`, "success");
      // Força atualização da lista
      useUIStore.getState().notifyTablesUpdated();
    } catch (error) {
      showNotification("Erro ao aceitar convite: " + error.message, "error");
    }
  };

  const handleDeclineClick = (e, table) => {
    e.stopPropagation();
    setTableToDecline(table);
    setDeclineModalOpen(true);
  };

  const handleConfirmDecline = async () => {
    if (!tableToDecline) return;
    setDeclineModalOpen(false);
    try {
      await APIService.declineInvite(tableToDecline._id, user.email);
      showNotification("Convite recusado.", "info");
      useUIStore.getState().notifyTablesUpdated();
    } catch (error) {
      showNotification("Erro ao recusar: " + error.message, "error");
    }
    setTableToDecline(null);
  };

  return (
    <Dialog
      open={tableListModalOpen}
      onClose={toggleTableListModal}
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
          🛡️ Minhas Mesas
        </Typography>
        <IconButton onClick={toggleTableListModal} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{bgcolor: "#f5f7fa"}}>
        {loading ? (
          <Box sx={{display: "flex", justifyContent: "center", p: 4}}>
            <CircularProgress />
          </Box>
        ) : tables.length === 0 ? (
          <Box sx={{textAlign: "center", py: 4, color: "#666"}}>
            <Typography>Você ainda não participa de nenhuma mesa.</Typography>
          </Box>
        ) : (
          <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
            {tables.map((table) => {
              const isGM = table.gmId === user?.uid;
              const isInvited = table.invites?.includes(user?.email);
              const isPlayer = table.playerIds?.includes(user?.uid);

              return (
                <Card
                  key={table._id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                      md: "calc(33.33% - 11px)",
                    },
                  }}
                  component={Button} // Torna o card clicável visualmente
                  onClick={() => handleTableClick(table)}
                  style={{
                    textTransform: "none",
                    textAlign: "left",
                    display: "block",
                    padding: 0,
                  }}
                >
                  <CardContent sx={{width: "100%"}}>
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
                        label={isGM ? "GM" : isInvited ? "Convite" : "Jogador"}
                        color={
                          isGM ? "secondary" : isInvited ? "warning" : "success"
                        }
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "40px",
                      }}
                    >
                      {table.description || "Sem descrição."}
                    </Typography>

                    {/* Exibir Mestre se não for o próprio */}
                    {!isGM && (
                      <Box sx={{mb: 2}}>
                        <Chip
                          icon={<SecurityIcon fontSize="small" />}
                          label={`GM: ${table.gmName}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    )}

                    {/* Ações de Convite */}
                    {isInvited && (
                      <Box sx={{mb: 2, display: "flex", gap: 1}}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={(e) => handleAcceptInvite(e, table)}
                        >
                          Aceitar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CloseIcon />}
                          onClick={(e) => handleDeclineClick(e, table)}
                        >
                          Recusar
                        </Button>
                      </Box>
                    )}

                    <Divider sx={{my: 2}} />

                    {/* Resumo de Participantes */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                        fontSize: "0.85rem",
                      }}
                    >
                      <PersonIcon fontSize="small" />
                      <span>{table.players?.length || 0} Jogadores</span>
                      {table.invites?.length > 0 && (
                        <span>• {table.invites.length} Convites</span>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenCreate}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <AddIcon />
        </Fab>
      </DialogContent>

      <ConfirmDialog
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        onConfirm={handleConfirmDecline}
        title="Recusar Convite"
      >
        <p>Tem certeza que deseja recusar este convite?</p>
      </ConfirmDialog>
    </Dialog>
  );
}

export default TableListModal;
