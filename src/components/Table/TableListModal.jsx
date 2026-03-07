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
  Send as SendIcon,
  Check as CheckIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";

function TableListModal() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
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

  const handleDeclineInvite = async (e, table) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja recusar este convite?")) return;
    try {
      await APIService.declineInvite(table._id, user.email);
      showNotification("Convite recusado.", "info");
      useUIStore.getState().notifyTablesUpdated();
    } catch (error) {
      showNotification("Erro ao recusar: " + error.message, "error");
    }
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
              const isInvited = table.invites?.includes(user?.email);
              const isPlayer = table.playerIds?.includes(user?.uid);

              return (
                <Card
                  key={table._id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  component={Button} // Torna o card clicável visualmente
                  onClick={() => handleTableClick(table)}
                  style={{
                    textTransform: "none",
                    textAlign: "left",
                    display: "block",
                    width: "100%",
                    padding: 0,
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
                        label={
                          isGM ? "Mestre" : isInvited ? "Convite" : "Jogador"
                        }
                        color={
                          isGM ? "secondary" : isInvited ? "warning" : "success"
                        }
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

                    {/* Exibir Mestre se não for o próprio */}
                    {!isGM && (
                      <Box sx={{mb: 2}}>
                        <Chip
                          icon={<SecurityIcon fontSize="small" />}
                          label={`Mestre: ${table.gmName}`}
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
                          onClick={(e) => handleDeclineInvite(e, table)}
                        >
                          Recusar
                        </Button>
                      </Box>
                    )}

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
                        {/* Jogadores Aceitos */}
                        {(table.players || []).map((player) => (
                          <Chip
                            key={player.uid}
                            icon={<PersonIcon fontSize="small" />}
                            label={player.name}
                            variant="filled"
                            size="small"
                            color="primary"
                          />
                        ))}

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
                            onDelete={
                              isGM
                                ? (e) => handleResendInvite(e, table, email)
                                : undefined
                            }
                            deleteIcon={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  borderRadius: "50%",
                                  p: 0.5,
                                  "&:hover": {bgcolor: "rgba(0,0,0,0.1)"},
                                }}
                                title="Reenviar E-mail"
                              >
                                <SendIcon style={{fontSize: 14}} />
                              </Box>
                            }
                          />
                        ))}

                        {!table.invites?.length && !table.players?.length && (
                          <Typography variant="caption" color="text.secondary">
                            Nenhum participante.
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
