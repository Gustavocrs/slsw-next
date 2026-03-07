/**
 * VantagesList Component
 * Lista customizada para Vantagens com padding-bottom
 */

"use client";

import React from "react";
import {styled} from "@mui/material/styles";
import {Box, Select, MenuItem, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {EDGES} from "@/lib/rpgEngine";

const InputRow = styled(Box)(({theme}) => ({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "8px",
  alignItems: "center",
  padding: "12px",
  background: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  marginBottom: "16px",
}));

const ListItem = styled(Box)(({theme}) => ({
  display: "grid",
  gridTemplateColumns: "1fr auto",
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

const Button = styled("button")(({theme}) => ({
  padding: "10px 16px",
  background: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600",
  transition: "background 0.2s ease",

  "&:hover": {
    background: "#5568d3",
  },

  "&:active": {
    background: "#445cb9",
  },
}));

function VantagesList({items = [], onAdd, onRemove}) {
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
          <MenuItem value="">Selecione uma vantagem</MenuItem>
          {EDGES.map((edge) => (
            <MenuItem key={edge.name} value={edge.name}>
              {edge.name}({edge.source}) - {edge.rank}
            </MenuItem>
          ))}
        </Select>

        <Button onClick={handleAdd}>+ </Button>
      </InputRow>

      {/* List */}
      {items.length === 0 ? (
        <Box
          sx={{textAlign: "center", py: 2, color: "#999", fontSize: "0.9rem"}}
        >
          Nenhuma vantagem adicionada
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem key={`${item.name}-${index}`}>
            <Box sx={{fontWeight: 500}}>
              <p>
                {item.name} - {item.rank}
              </p>
              <span className="text-xs">{item.description}</span>
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

export default VantagesList;
