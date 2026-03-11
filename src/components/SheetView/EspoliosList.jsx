/**
 * EspoliosList Component
 * Lista customizada para Espólios
 */

"use client";

import React, {useState} from "react";
import {styled} from "@mui/material/styles";
import {Box, TextField, IconButton} from "@mui/material";
import {
  Delete as DeleteIcon,
  RemoveCircleOutline as ConsumeIcon,
} from "@mui/icons-material";

const InputRow = styled(Box)(({theme}) => ({
  display: "grid",
  gridTemplateColumns: "1fr 80px auto",
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

function EspoliosList({
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  disabled = false,
}) {
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
          disabled={disabled}
          size="small"
          placeholder="Nome do Espólio"
          fullWidth
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <TextField
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={disabled}
          size="small"
          placeholder="Qtd"
          sx={{background: "#fff", borderRadius: "4px"}}
        />
        <Button onClick={handleAdd} disabled={disabled}>
          +{" "}
        </Button>
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
                disabled={disabled}
                onClick={() => handleConsume(index, item)}
                sx={{padding: "4px", color: "#667eea"}}
              >
                <ConsumeIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                disabled={disabled}
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

export default EspoliosList;
