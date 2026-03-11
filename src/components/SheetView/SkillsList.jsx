/**
 * SkillsList Component
 * Lista de perícias com input no topo e lista ordenada abaixo
 */

"use client";

import React, {useState, useMemo} from "react";
import {styled} from "@mui/material/styles";
import {Box, Select, MenuItem, IconButton, Typography} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {SKILLS, DICE} from "@/lib/rpgEngine";

const InputRow = styled(Box)(({theme}) => ({
  display: "grid",
  gridTemplateColumns: "2fr 1fr auto",
  gap: "8px",
  alignItems: "center",
  padding: "12px",
  background: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  marginBottom: "16px",

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const ListItem = styled(Box)(({theme}) => ({
  display: "grid",
  gridTemplateColumns: "2fr 1fr auto",
  gap: "8px",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: "6px",
  background: "#f9f9f9",
  border: "1px solid #e0e0e0",
  marginBottom: "6px",
  fontSize: "0.95rem",

  "&:hover": {
    background: "#f5f5f5",
  },
}));

const ListContainer = styled(Box)(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0",
}));

const Button = styled("button")(({theme}) => ({
  padding: "10px 16px",
  background: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  transition: "background 0.2s ease",

  "&:hover": {
    background: "#5568d3",
  },

  "&:active": {
    background: "#445cb9",
  },

  "&:disabled": {
    background: "#bdbdbd",
    cursor: "not-allowed",
  },
}));

function SkillsList({
  items = [],
  onAdd,
  onRemove,
  addButtonLabel = "+ ",
  disabled = false,
}) {
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
      (item) => item === sortedItems[index],
    );
    onRemove?.(originalIndex);
  };

  return (
    <Box
      sx={{
        mb: 2,
        background: "#e8eaf6",
        p: 2,
        borderRadius: 1,
        borderLeft: "4px solid #3f51b5",
      }}
    >
      {/* Input Row */}
      <InputRow>
        <Select
          value={inputSkill}
          onChange={(e) => setInputSkill(e.target.value)}
          disabled={disabled}
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
          disabled={disabled}
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

        <Button onClick={handleAdd} disabled={disabled}>
          {addButtonLabel}
        </Button>
      </InputRow>

      {/* Skills List */}
      <ListContainer>
        {sortedItems.length === 0 ? (
          <Box
            sx={{textAlign: "center", py: 3, color: "#999", fontSize: "0.9rem"}}
          >
            Nenhuma perícia adicionada
          </Box>
        ) : (
          sortedItems.map((item, index) => (
            <ListItem key={`${item.name}-${index}`} sx={item.style}>
              <Box sx={{fontWeight: 500}}>
                {item.name}
                {item.attributeShort && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ml: 1, color: "#888", fontWeight: "normal"}}
                  >
                    [{item.attributeShort}]
                  </Typography>
                )}
              </Box>
              <Box sx={{fontWeight: 600, color: item.dieColor || "#667eea"}}>
                {item.die}
              </Box>
              <IconButton
                size="small"
                color="error"
                disabled={disabled}
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
