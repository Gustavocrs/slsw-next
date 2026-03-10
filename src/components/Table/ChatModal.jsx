/**
 * ChatModal Component
 * Sistema de mensagens em tempo real (Global e Privado)
 */

"use client";

import React, {useState, useEffect, useRef} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
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

export default function ChatModal() {
  // Helper para criar um ID único e consistente para conversas privadas
  const generatePrivateConversationId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  const {chatOpen, toggleChat, chatRecipient, selectedTable, showNotification} =
    useUIStore();
  const {user} = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll automático para o fim
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatOpen]);

  // Listener em tempo real do Firestore
  useEffect(() => {
    if (!chatOpen || !selectedTable?._id) return;

    // Determina o ID da conversa (global ou privada)
    let conversationId;
    if (chatRecipient) {
      conversationId = generatePrivateConversationId(
        user.uid,
        chatRecipient.uid,
      );
    } else {
      conversationId = "global";
    }

    if (!conversationId) return;

    const q = query(
      collection(
        db,
        "tables",
        selectedTable._id,
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
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      },
      (error) => {
        console.error("Erro no chat:", error);
        if (error.code === "permission-denied") {
          // Não fecha o chat para não frustrar, mas avisa
          showNotification(
            "Erro de permissão: Atualize as regras do Firestore.",
            "error",
          );
        }
      },
    );

    return () => unsubscribe();
  }, [chatOpen, selectedTable?._id, chatRecipient, user?.uid]);

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    const textToSend = message.trim();
    setMessage(""); // Limpa input imediatamente para UX rápida

    try {
      await APIService.sendMessage(selectedTable._id, {
        senderId: user.uid,
        senderName: user.displayName || "Anônimo",
        senderPhoto: user.photoURL,
        text: textToSend,
        recipientId: chatRecipient?.uid || null, // null = Global
        recipientName: chatRecipient?.name || null,
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
    <Dialog
      open={chatOpen}
      onClose={toggleChat}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          p: 2,
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <Typography variant="h6">Chat</Typography>
          {chatRecipient ? (
            <Chip
              label={`Sussurrando para ${chatRecipient.name}`}
              color="secondary"
              onDelete={() => useUIStore.getState().openChatWith(null)}
              size="small"
            />
          ) : (
            <Chip label="Global" size="small" variant="outlined" />
          )}
        </Box>
        <IconButton onClick={toggleChat} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{flex: 1, p: 2, bgcolor: "#f5f7fa", overflowY: "auto"}}
      >
        <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            const isPrivate = !!msg.recipientId;

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
                      {msg.senderName} {isPrivate && "(Sussurro)"}
                    </Typography>
                  )}
                  {isMe && isPrivate && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{mb: 0.5, textAlign: "right"}}
                    >
                      Para: {msg.recipientName}
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
      </DialogContent>

      <DialogActions sx={{p: 2, borderTop: "1px solid #eee"}}>
        <TextField
          fullWidth
          size="small"
          placeholder={
            chatRecipient
              ? `Mensagem para ${chatRecipient.name}...`
              : "Mensagem global..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!message.trim()}
        >
          <SendIcon />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
