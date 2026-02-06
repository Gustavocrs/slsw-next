/**
 * VantagesList Component
 * Lista customizada para Vantagens com padding-bottom
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Box, TextField, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";

const ItemRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

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

function VantagesList({items = [], onAdd, onRemove, onUpdate}) {
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");

  const handleAdd = () => {
    onAdd?.({name: ""});
  };

  const handleRemove = (index) => {
    onRemove?.(index);
  };

  const startEdit = (index, item) => {
    setEditingIndex(index);
    setEditValue(item.name || "");
  };

  const saveEdit = (index) => {
    onUpdate?.(index, {name: editValue});
    setEditingIndex(null);
  };

  return (
    <Box sx={{mb: 2, pb: 3}}>
      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma vantagem adicionada
        </Box>
      ) : (
        <>
          {items.map((item, index) =>
            editingIndex === index ? (
              <ItemRow key={index}>
                <TextField
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  size="small"
                  placeholder="Vantagem"
                  fullWidth
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
                <Box sx={{fontWeight: 500}}>{item.name}</Box>
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
          + Adicionar Vantagem
        </button>
      </Box>
    </Box>
  );
}

export default VantagesList;
