/**
 * EspoliosList Component
 * Lista customizada para Espólios
 */

"use client";

import React, {useState} from "react";
import styled from "styled-components";
import {Box, TextField, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";

const InputRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
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

function EspoliosList({items = [], onAdd, onRemove}) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name) {
      onAdd?.({name});
      setName("");
    }
  };

  return (
    <Box sx={{mb: 2}}>
      <InputRow>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          placeholder="Nome do Espólio"
          fullWidth
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <Button onClick={handleAdd}>+ Adicionar</Button>
      </InputRow>

      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhum espólio adicionado
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem key={`${item.name}-${index}`}>
            <Box sx={{fontWeight: 500}}>{item.name}</Box>
            <IconButton
              size="small"
              color="error"
              onClick={() => onRemove?.(index)}
              sx={{padding: "4px"}}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))
      )}
    </Box>
  );
}

export default EspoliosList;
