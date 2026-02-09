/**
 * ComplicacoesList Component
 * Lista customizada para Complicações com Select e exibição detalhada
 */

"use client";

import React from "react";
import styled from "styled-components";
import {Box, Select, MenuItem, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {HINDRANCES} from "@/lib/rpgEngine";

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

function ComplicacoesList({items = [], onAdd, onRemove}) {
  const [inputName, setInputName] = React.useState("");

  const handleAdd = () => {
    if (inputName) {
      onAdd?.({name: inputName});
      setInputName("");
    }
  };

  const handleRemove = (index) => {
    onRemove?.(index);
  };

  return (
    <Box sx={{mb: 2}}>
      {/* Input Row */}
      <InputRow>
        <Select
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          displayEmpty
          size="small"
          fullWidth
          sx={{
            background: "#fff",
            borderRadius: "6px",
          }}
          MenuProps={{PaperProps: {style: {maxHeight: 300}}}}
        >
          <MenuItem value="">Selecione uma complicação</MenuItem>
          {HINDRANCES.map((hind) => (
            <MenuItem key={hind.name} value={hind.name}>
              {hind.name} ({hind.type})
            </MenuItem>
          ))}
        </Select>

        <Button onClick={handleAdd}>+ Adicionar</Button>
      </InputRow>

      {/* List */}
      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma complicação adicionada
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem key={`${item.name}-${index}`}>
            <Box sx={{fontWeight: 500}}>
              <p style={{margin: 0}}>
                {item.name} - {item.type}
              </p>
              <span style={{fontSize: "0.75rem", color: "#666"}}>
                {item.description}
              </span>
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRemove(index)}
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

export default ComplicacoesList;
