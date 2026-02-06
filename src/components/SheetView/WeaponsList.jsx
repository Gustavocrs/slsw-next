/**
 * WeaponsList Component
 * Lista customizada para armas com exibição simples
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Box, TextField, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";

const ItemRow = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
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
  grid-template-columns: 2fr 3fr auto;
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

function WeaponsList({
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  addButtonLabel = "+ Adicionar Arma",
}) {
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValues, setEditValues] = React.useState({});

  const handleAdd = () => {
    onAdd?.({name: "", damage: "", range: ""});
  };

  const handleRemove = (index) => {
    onRemove?.(index);
  };

  const startEdit = (index, item) => {
    setEditingIndex(index);
    setEditValues({...item});
  };

  const saveEdit = (index) => {
    onUpdate?.(index, editValues);
    setEditingIndex(null);
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({...prev, [field]: value}));
  };

  const formatDisplay = (weapon) => {
    const parts = [weapon.name];
    if (weapon.damage) parts.push(`Dano ${weapon.damage}`);
    if (weapon.range) parts.push(`${weapon.range}`);
    return parts.filter(Boolean).join(" • ");
  };

  return (
    <Box sx={{mb: 2}}>
      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma arma adicionada
        </Box>
      ) : (
        <>
          {items.map((item, index) =>
            editingIndex === index ? (
              <ItemRow key={index}>
                <TextField
                  value={editValues.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  size="small"
                  placeholder="Nome"
                  fullWidth
                />
                <TextField
                  value={editValues.damage || ""}
                  onChange={(e) => handleInputChange("damage", e.target.value)}
                  size="small"
                  placeholder="Dano"
                />
                <TextField
                  value={editValues.range || ""}
                  onChange={(e) => handleInputChange("range", e.target.value)}
                  size="small"
                  placeholder="Alcance"
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
                <Box></Box>
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
          {addButtonLabel}
        </button>
      </Box>
    </Box>
  );
}

export default WeaponsList;
