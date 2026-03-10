/**
 * MessagesDashboard.jsx
 * Painel de mensagens centralizado
 */
"use client";

import React, {useState, useEffect, useRef} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {Close as CloseIcon, Send as SendIcon} from "@mui/icons-material";
import {useUIStore} from "@/stores/characterStore";
import {useAuth} from "@/hooks";
import APIService from "@/lib/api";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import {db} from "@/lib/firebase";

// Helper para criar um ID único e consistente para conversas privadas
const generatePrivateConversationId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null;
  return [uid1, uid2].sort().join("_");
};

// Componente para a view de uma única conversa (lado esquerdo)
function ChatView({recipient, table, user, onBack}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const conversationId = recipient
    ? generatePrivateConversationId(user.uid, recipient.uid)
    : "global";

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  // Listener de mensagens
  useEffect(() => {
    if (!table?._id || !conversationId) {
      setMessages([]);
      return;
    }

    // Limpa as notificações para esta conversa ao abri-la
    APIService.clearConversationNotifications(user.uid, conversationId);

    const q = query(
      collection(
        db,
        "tables",
        table._id,
        "conversations",
        conversationId,
        "messages",
      ),
      orderBy("timestamp", "asc"),
      limit(100),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        setMessages(msgs);
      },
      (error) => {
        console.error("Erro ao buscar mensagens:", error);
        setMessages([]);
      },
    );

    return () => unsubscribe();
  }, [table?._id, conversationId]);

  const handleSend = async () => {
    if (!message.trim() || !user || !table?._id) return;
    const textToSend = message.trim();
    setMessage("");

    try {
      await APIService.sendMessage(table._id, {
        senderId: user.uid,
        senderName: user.displayName || "Anônimo",
        senderPhoto: user.photoURL,
        text: textToSend,
        recipientId: recipient?.uid || null,
        recipientName: recipient?.name || null,
        type: "text",
      });
    } catch (error) {
      console.error("Falha ao enviar msg", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f7fa",
      }}
    >
      {/* Header da Conversa */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {onBack && <Button onClick={onBack}>Voltar</Button>}
        <Box>
          <Typography variant="h6">
            {recipient
              ? `Conversa com ${recipient.name}`
              : "Chat Global da Mesa"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Mesa: {table?.name || "Nenhuma mesa selecionada"}
          </Typography>
        </Box>
      </Box>

      {/* Conteúdo das Mensagens */}
      <Box sx={{flex: 1, p: 2, overflowY: "auto"}}>
        <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {!isMe && (
                  <Avatar
                    src={msg.senderPhoto}
                    sx={{width: 28, height: 28, mt: 0.5}}
                  />
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: "80%",
                    bgcolor: isMe ? "#e3f2fd" : "#fff",
                    borderRadius: 2,
                    borderTopLeftRadius: !isMe ? 0 : 2,
                    borderTopRightRadius: isMe ? 0 : 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  {!isMe && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{mb: 0.5}}
                    >
                      {msg.senderName}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{whiteSpace: "pre-wrap"}}>
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input de Mensagem */}
      <Box sx={{p: 2, borderTop: "1px solid #e0e0e0", bgcolor: "white"}}>
        <TextField
          fullWidth
          size="small"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          disabled={!table}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleSend}
                disabled={!message.trim() || !table}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
}

export default function MessagesDashboard() {
  const {messagesDashboardOpen, toggleMessagesDashboard, selectedTable} =
    useUIStore();
  const {user} = useAuth();
  const [activeRecipient, setActiveRecipient] = useState(undefined); // undefined para tela inicial, null para global

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Resetar ao fechar
  useEffect(() => {
    if (!messagesDashboardOpen) {
      setActiveRecipient(undefined);
    } else {
      setActiveRecipient(null); // Começa no chat global
    }
  }, [messagesDashboardOpen]);

  if (!user) return null;

  const contacts = [];
  if (selectedTable) {
    if (selectedTable.gmId !== user.uid) {
      contacts.push({
        uid: selectedTable.gmId,
        name: selectedTable.gmName,
        photoURL: selectedTable.gmPhotoURL,
        isGM: true,
      });
    }
    (selectedTable.players || []).forEach((player) => {
      if (player.uid !== user.uid) {
        contacts.push(player);
      }
    });
  }

  const handleSelectContact = (contact) => {
    setActiveRecipient(contact);
  };

  return (
    <Dialog
      open={messagesDashboardOpen}
      onClose={toggleMessagesDashboard}
      fullScreen
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          ✉️ Mensagens
        </Typography>
        <IconButton onClick={toggleMessagesDashboard} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{p: 0, bgcolor: "#f0f2f5", display: "flex"}}>
        <Grid container sx={{height: "100%"}}>
          {/* Coluna Esquerda: Chat View */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              height: "100%",
              display:
                isMobile && activeRecipient === undefined ? "none" : "flex",
              flexDirection: "column",
            }}
          >
            {activeRecipient !== undefined && (
              <ChatView
                recipient={activeRecipient}
                table={selectedTable}
                user={user}
                onBack={isMobile ? () => setActiveRecipient(undefined) : null}
              />
            )}
          </Grid>

          {/* Coluna Direita: Contatos */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderLeft: {md: "1px solid #ddd"},
              bgcolor: "white",
              height: "100%",
              overflowY: "auto",
              display:
                isMobile && activeRecipient !== undefined ? "none" : "block",
            }}
          >
            <Box sx={{p: 2}}>
              <Typography variant="h6" gutterBottom>
                Contatos
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mesa: {selectedTable?.name || "Nenhuma"}
              </Typography>
            </Box>
            <Divider />
            <List>
              <ListItem
                button
                selected={activeRecipient === null}
                onClick={() => handleSelectContact(null)}
              >
                <ListItemAvatar>
                  <Avatar>#</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Chat Global"
                  secondary={selectedTable?.name || ""}
                />
              </ListItem>
              <Divider component="li" />
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <ListItem
                    key={contact.uid}
                    button
                    selected={activeRecipient?.uid === contact.uid}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <ListItemAvatar>
                      <Avatar src={contact.photoURL} alt={contact.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.isGM ? "Game Master" : "Jogador"}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText secondary="Nenhum contato nesta mesa." />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
