/**
 * ArmorList Component
 * Lista customizada para armaduras com exibição simples (Def ou Aparar)
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

const HeaderRow = styled(ItemRow)`
  background: #f0f0f0;
  border-bottom: 2px solid #667eea;

  &:hover {
    background: #f0f0f0;
  }

  font-weight: 700;
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

  &:hover {
    background: #f5f5f5;
  }
`;

function ArmorList({
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  addButtonLabel = "+ Adicionar Armadura/Escudo",
}) {
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValues, setEditValues] = React.useState({});

  const handleAdd = () => {
    onAdd?.({name: "", defense: 0, ap: 0});
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

  const formatDisplay = (armor) => {
    const isShield =
      armor.name?.toLowerCase().includes("escudo") ||
      (parseInt(armor.defense) === 0 && parseInt(armor.ap) > 0);

    if (isShield && armor.ap) {
      return `${armor.name}: Aparar +${armor.ap}`;
    } else if (armor.defense) {
      return `${armor.name}: Def +${armor.defense}`;
    }
    return armor.name;
  };

  return (
    <Box sx={{mb: 2}}>
      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma armadura adicionada
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
                  value={editValues.defense || 0}
                  onChange={(e) => handleInputChange("defense", e.target.value)}
                  type="number"
                  size="small"
                  placeholder="DEF"
                />
                <TextField
                  value={editValues.ap || 0}
                  onChange={(e) => handleInputChange("ap", e.target.value)}
                  type="number"
                  size="small"
                  placeholder="Aparar"
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
              <DisplayRow
                key={index}
                onClick={() => startEdit(index, item)}
                style={{cursor: "pointer"}}
              >
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

export default ArmorList;
