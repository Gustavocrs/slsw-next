/**
 * Bestiary Admin Parser
 * Rota restrita (idealmente protegida no middleware) para ingestão de monstros
 * oriundos de parsers externos (ex: Zadmar).
 */

"use client";

import React, {useState} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";

export default function BestiaryAdminPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleProcess = async () => {
    setStatus(null);
    setLoading(true);

    try {
      // Validação inicial do JSON
      const parsedData = JSON.parse(jsonInput);
      const payload = Array.isArray(parsedData)
        ? parsedData
        : parsedData.monsters;

      if (!payload || !Array.isArray(payload)) {
        throw new Error(
          "O JSON precisa ser um array ou conter uma propriedade 'monsters' com um array.",
        );
      }

      // Envio para a API Next.js que fará o Batch Write no Firestore
      const response = await fetch("/api/bestiary", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro desconhecido na API.");
      }

      setStatus({
        type: "success",
        message: `Sucesso! ${result.count} criatura(s) cadastradas no Firestore.`,
      });
      setJsonInput(""); // Limpa após o sucesso
    } catch (error) {
      setStatus({
        type: "error",
        message: `Falha no processamento: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{p: {xs: 2, md: 4}, maxWidth: 900, mx: "auto", minHeight: "100vh"}}
    >
      <Paper sx={{p: {xs: 2, md: 4}, borderRadius: 2}}>
        <Typography
          variant="h4"
          fontWeight="800"
          sx={{mb: 1, color: "#0f172a"}}
        >
          Ingestão do Bestiário (Admin)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
          Cole o Array JSON extraído do parser externo abaixo. O sistema se
          encarregará de normalizar os status (ex: Armadura, Resistência) e
          despachar para o banco de dados.
        </Typography>

        {status && (
          <Alert
            severity={status.type}
            sx={{mb: 3}}
            iconMapping={{success: <CheckIcon fontSize="inherit" />}}
          >
            {status.message}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          minRows={10}
          maxRows={20}
          placeholder={
            '[\n  {\n    "name": "Goblin",\n    "attributes": { ... }\n  }\n]'
          }
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          disabled={loading}
          sx={{mb: 3, fontFamily: "monospace"}}
          InputProps={{sx: {fontFamily: "monospace", fontSize: "0.85rem"}}}
        />

        <Button
          variant="contained"
          size="large"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <UploadIcon />
            )
          }
          onClick={handleProcess}
          disabled={loading || !jsonInput.trim()}
          sx={{py: 1.5, px: 4, fontWeight: "bold"}}
        >
          {loading ? "Processando e Enviando..." : "Processar e Sincronizar"}
        </Button>
      </Paper>
    </Box>
  );
}
