/**
 * ItemsList Component
 * Lista customizada para Itens
 */

"use client";

import React, {useState} from "react";
import styled from "styled-components";
import {Box, TextField, IconButton} from "@mui/material";
import {
  Delete as DeleteIcon,
  RemoveCircleOutline as ConsumeIcon,
} from "@mui/icons-material";

const InputRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 80px auto;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;
`;

const ListItem = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  margin-bottom: 6px;
  font-size: 0.95rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: #5568d3;
  }

  &:active {
    background: #445cb9;
  }
`;

function ItemsList({items = [], onAdd, onRemove, onUpdate}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleAdd = () => {
    if (name) {
      onAdd?.({name, quantity});
      setName("");
      setQuantity("1");
    }
  };

  const handleConsume = (index, item) => {
    const currentQty = parseInt(item.quantity || 1, 10);
    if (currentQty > 1) {
      onUpdate?.(index, {...item, quantity: (currentQty - 1).toString()});
    } else {
      onRemove?.(index);
    }
  };

  return (
    <Box sx={{mb: 2}}>
      <InputRow>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          placeholder="Nome do Item"
          fullWidth
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <TextField
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          size="small"
          placeholder="Qtd"
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <Button onClick={handleAdd}>+ </Button>
      </InputRow>

      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhum item adicionado
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem key={`${item.name}-${index}`}>
            <Box sx={{fontWeight: 500}}>
              {item.name}
              {item.quantity && item.quantity !== "1" && (
                <span
                  style={{color: "#666", fontSize: "0.9em", marginLeft: "8px"}}
                >
                  (x{item.quantity})
                </span>
              )}
            </Box>
            <Box sx={{display: "flex", gap: 0.5}}>
              <IconButton
                size="small"
                title="Consumir/Usar (Reduzir Qtd)"
                onClick={() => handleConsume(index, item)}
                sx={{padding: "4px", color: "#667eea"}}
              >
                <ConsumeIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemove?.(index)}
                sx={{padding: "4px"}}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))
      )}
    </Box>
  );
}

export default ItemsList;
