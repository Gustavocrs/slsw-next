/**
 * ItemsList Component
 * Lista customizada para Itens
 */

"use client";

import React, {useState} from "react";
import {styled} from "@mui/material/styles";
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Typography,
  Button as MuiButton,
} from "@mui/material";
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

function ItemsList({
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  onUse,
  disabled = false,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleItemClick = (event, index, item) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
    setSelectedItemIndex(index);
    setSelectedItem(item);
  };

  const handleConfirmUse = () => {
    if (selectedItem && selectedItemIndex !== null) {
      onUse?.(selectedItemIndex, selectedItem);
    }
    setAnchorEl(null);
    setSelectedItemIndex(null);
    setSelectedItem(null);
  };

  return (
    <Box sx={{mb: 2}}>
      <InputRow>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
          size="small"
          placeholder="Nome do Item"
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
          Nenhum item adicionado
        </Box>
      ) : (
        items.map((item, index) => (
          <ListItem
            key={`${item.name}-${index}`}
            onClick={(e) => handleItemClick(e, index, item)}
            sx={{cursor: "pointer"}}
          >
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleConsume(index, item);
                }}
                sx={{padding: "4px", color: "#667eea"}}
              >
                <ConsumeIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(index);
                }}
                sx={{padding: "4px"}}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{p: 2}}>
          <Typography sx={{mb: 2, fontWeight: 600}}>
            Usar {selectedItem?.name}?
          </Typography>
          <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
            <MuiButton size="small" onClick={() => setAnchorEl(null)}>
              Não
            </MuiButton>
            <MuiButton
              size="small"
              variant="contained"
              onClick={handleConfirmUse}
            >
              Sim
            </MuiButton>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

export default ItemsList;
