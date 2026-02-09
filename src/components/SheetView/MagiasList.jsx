/**
 * MagiasList Component
 * Lista customizada para Magias (nome + custo)
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Box, TextField, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";

const ItemRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 100px auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 80px;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

const DisplayRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const formatDisplay = (item) => {
  const parts = [];
  if (item.name) parts.push(item.name);
  if (item.custo) parts.push(`${item.custo} pts`);
  return parts.join(" • ");
};

function MagiasList({items = [], onAdd, onRemove, onUpdate}) {
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editName, setEditName] = React.useState("");
  const [editCusto, setEditCusto] = React.useState("");

  const handleAdd = () => {
    onAdd?.({name: "", custo: ""});
  };

  const handleRemove = (index) => {
    onRemove?.(index);
  };

  const startEdit = (index, item) => {
    setEditingIndex(index);
    setEditName(item.name || "");
    setEditCusto(item.custo || "");
  };

  const saveEdit = (index) => {
    onUpdate?.(index, {name: editName, custo: editCusto});
    setEditingIndex(null);
  };

  return (
    <Box sx={{mb: 2}}>
      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma magia adicionada
        </Box>
      ) : (
        <>
          {items.map((item, index) =>
            editingIndex === index ? (
              <ItemRow key={index}>
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="small"
                  placeholder="Magia"
                  fullWidth
                />
                <TextField
                  value={editCusto}
                  onChange={(e) => setEditCusto(e.target.value)}
                  size="small"
                  placeholder="Custo"
                  type="number"
                />
                <Box sx={{display: "flex", gap: 0.5}}>
                  <button
                    onClick={() => saveEdit(index)}
                    style={{
                      padding: "4px 12px",
                      background: "#4caf50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✓
                  </button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setEditingIndex(null)}
                  >
                    ✕
                  </IconButton>
                </Box>
              </ItemRow>
            ) : (
              <DisplayRow key={index} onClick={() => startEdit(index, item)}>
                <Box sx={{fontWeight: 500}}>{formatDisplay(item)}</Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </DisplayRow>
            ),
          )}
        </>
      )}

      <Box sx={{mt: 2}}>
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 16px",
            background: "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          + Magia
        </button>
      </Box>
    </Box>
  );
}

export default MagiasList;
