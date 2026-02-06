/**
 * SkillsList Component
 * Lista de perícias com input no topo e lista ordenada abaixo
 */

"use client";

import React, {useState, useMemo} from "react";
import styled from "styled-components";
import {Box, Select, MenuItem, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {SKILLS, DICE} from "@/lib/rpgEngine";

const InputRow = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
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
  grid-template-columns: 2fr 1fr auto;
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

const ListContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0;
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

function SkillsList({items = [], onAdd, onRemove, addButtonLabel = "+ Adicionar Perícia"}) {
  const [inputSkill, setInputSkill] = useState("");
  const [inputDice, setInputDice] = useState("d4");

  // Ordenar perícias alfabeticamente
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const handleAdd = () => {
    if (inputSkill) {
      onAdd?.({name: inputSkill, die: inputDice});
      setInputSkill("");
      setInputDice("d4");
    }
  };

  const handleRemove = (index) => {
    const originalIndex = items.findIndex(
      (item) => item === sortedItems[index]
    );
    onRemove?.(originalIndex);
  };

  return (
    <Box>
      {/* Input Row */}
      <InputRow>
        <Select
          value={inputSkill}
          onChange={(e) => setInputSkill(e.target.value)}
          displayEmpty
          size="small"
          fullWidth
          sx={{
            background: "#fff",
            borderRadius: "6px",
          }}
        >
          <MenuItem value="">Selecione uma perícia</MenuItem>
          {Object.keys(SKILLS).map((skill) => (
            <MenuItem key={skill} value={skill}>
              {skill}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={inputDice}
          onChange={(e) => setInputDice(e.target.value)}
          size="small"
          sx={{
            background: "#fff",
            borderRadius: "6px",
          }}
        >
          {DICE.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>

        <Button onClick={handleAdd}>{addButtonLabel}</Button>
      </InputRow>

      {/* Skills List */}
      <ListContainer>
        {sortedItems.length === 0 ? (
          <Box sx={{textAlign: "center", py: 3, color: "#999", fontSize: "0.9rem"}}>
            Nenhuma perícia adicionada
          </Box>
        ) : (
          sortedItems.map((item, index) => (
            <ListItem key={`${item.name}-${index}`}>
              <Box sx={{fontWeight: 500}}>{item.name}</Box>
              <Box sx={{fontWeight: 600, color: "#667eea"}}>{item.die}</Box>
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
      </ListContainer>
    </Box>
  );
}

export default SkillsList;
