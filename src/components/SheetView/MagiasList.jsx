/**
 * MagiasList Component
 * Lista customizada para Magias (nome + custo)
 */

"use client";

import React, {useState} from "react";
import styled from "styled-components";
import {Box, Select, MenuItem, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {POWERS} from "@/lib/rpgEngine";

const InputRow = styled(Box)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
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

function MagiasList({items = [], onAdd, onRemove}) {
  const [powerName, setPowerName] = useState("");

  const handleAdd = () => {
    if (powerName) {
      const powerData = POWERS[powerName];
      onAdd?.({
        name: powerName,
        pp: powerData?.pp || "",
        range: powerData?.range || "",
        duration: powerData?.duration || "",
        rank: powerData?.rank || "",
      });
      setPowerName("");
    }
  };

  return (
    <Box sx={{mb: 2}}>
      <InputRow>
        <Select
          value={powerName}
          onChange={(e) => setPowerName(e.target.value)}
          displayEmpty
          size="small"
          fullWidth
          sx={{background: "#fff", borderRadius: "6px", maxWidth: "100%"}}
          MenuProps={{PaperProps: {style: {maxHeight: 300}}}}
        >
          <MenuItem value="">Selecione uma magia</MenuItem>
          {Object.keys(POWERS)
            .sort()
            .map((key) => (
              <MenuItem key={key} value={key}>
                {key} ({POWERS[key].rank})
              </MenuItem>
            ))}
        </Select>
        <Button onClick={handleAdd}>+</Button>
      </InputRow>

      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma magia adicionada
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem key={`${item.name}-${index}`}>
            <Box sx={{fontWeight: 500}}>
              {item.name}
              <div style={{fontSize: "0.75rem", color: "#666"}}>
                PP: {item.pp} | Alcance: {item.range} | Duração: {item.duration}
              </div>
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

export default MagiasList;
