/**
 * WeaponsList Component
 * Lista customizada para armas com exibição simples
 */

"use client";

import React, {useState} from "react";
import styled from "styled-components";
import {Box, TextField, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";

const InputRow = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
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

function WeaponsList({items = [], onAdd, onRemove, addButtonLabel = "+ "}) {
  const [name, setName] = useState("");
  const [damage, setDamage] = useState("");
  const [range, setRange] = useState("");

  const handleAdd = () => {
    if (name) {
      onAdd?.({name, damage, range});
      setName("");
      setDamage("");
      setRange("");
    }
  };

  return (
    <Box sx={{mb: 2}}>
      <InputRow>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          placeholder="Nome da Arma"
          fullWidth
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <TextField
          value={damage}
          onChange={(e) => setDamage(e.target.value)}
          size="small"
          placeholder="Dano"
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <TextField
          value={range}
          onChange={(e) => setRange(e.target.value)}
          size="small"
          placeholder="Alcance"
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <Button onClick={handleAdd}>{addButtonLabel}</Button>
      </InputRow>

      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma arma adicionada
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem key={`${item.name}-${index}`}>
            <Box sx={{fontWeight: 500}}>
              {item.name}
              {(item.damage || item.range) && (
                <span
                  style={{
                    fontWeight: 400,
                    color: "#666",
                    fontSize: "0.85rem",
                    marginLeft: "8px",
                  }}
                >
                  {[
                    item.damage && `Dano: ${item.damage}`,
                    item.range && `Alcance: ${item.range}`,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </span>
              )}
            </Box>
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

export default WeaponsList;
