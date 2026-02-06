/**
 * RecursosDespertarList Component
 * Lista fixada para um único Recurso do Despertar (somente editar, sem add/remove)
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Box, TextField} from "@mui/material";

const FormRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 80px 80px;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled(Box)`
  margin-bottom: 12px;
`;

function RecursosDespertarList({items = [], onAdd, onUpdate}) {
  const item = items.length > 0 ? items[0] : {};
  const [editName, setEditName] = React.useState(item.name || "");
  const [editCusto, setEditCusto] = React.useState(item.custo || "");
  const [editNivel, setEditNivel] = React.useState(item.nivel || "");
  const [editDescricao, setEditDescricao] = React.useState(item.descricao || "");
  const [editLimitacao, setEditLimitacao] = React.useState(item.limitacao || "");
  const [hasInitialized, setHasInitialized] = React.useState(items.length > 0);

  // Atualizar local state quando o prop mudar
  React.useEffect(() => {
    setEditName(item.name || "");
    setEditCusto(item.custo || "");
    setEditNivel(item.nivel || "");
    setEditDescricao(item.descricao || "");
    setEditLimitacao(item.limitacao || "");
    setHasInitialized(items.length > 0);
  }, [item, items.length]);

  const handleSave = React.useCallback(() => {
    const newItem = {
      name: editName,
      custo: editCusto,
      nivel: editNivel,
      descricao: editDescricao,
      limitacao: editLimitacao,
    };

    // Se ainda não foi inicializado e há dados, adiciona
    if (!hasInitialized && editName.trim()) {
      onAdd?.(newItem);
      setHasInitialized(true);
    }
    // Se já foi inicializado, atualiza
    else if (hasInitialized && items.length > 0) {
      onUpdate?.(0, newItem);
    }
  }, [
    editName,
    editCusto,
    editNivel,
    editDescricao,
    editLimitacao,
    hasInitialized,
    items.length,
    onAdd,
    onUpdate,
  ]);

  // Auto-save após 500ms de inatividade
  React.useEffect(() => {
    const timer = setTimeout(handleSave, 500);
    return () => clearTimeout(timer);
  }, [editName, editCusto, editNivel, editDescricao, editLimitacao, handleSave]);

  return (
    <Box sx={{mb: 2, background: "#f9f9f9", p: 2, borderRadius: 1}}>
      <Box sx={{mb: 2}}>
        <p style={{margin: "0 0 12px 0", fontSize: "0.9rem", color: "#666"}}>
          Adicione as informações do seu Recurso do Despertar:
        </p>
      </Box>

      <FormRow>
        <TextField
          label="Nome"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Custo"
          value={editCusto}
          onChange={(e) => setEditCusto(e.target.value)}
          size="small"
          type="number"
        />
        <TextField
          label="Nível"
          value={editNivel}
          onChange={(e) => setEditNivel(e.target.value)}
          size="small"
          type="number"
        />
      </FormRow>

      <FullWidthField>
        <TextField
          label="Descrição"
          value={editDescricao}
          onChange={(e) => setEditDescricao(e.target.value)}
          size="small"
          fullWidth
          multiline
          rows={2}
        />
      </FullWidthField>

      <FullWidthField>
        <TextField
          label="Limitação"
          value={editLimitacao}
          onChange={(e) => setEditLimitacao(e.target.value)}
          size="small"
          fullWidth
          multiline
          rows={2}
        />
      </FullWidthField>
    </Box>
  );
}

export default RecursosDespertarList;
