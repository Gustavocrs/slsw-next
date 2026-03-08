/**
 * MagiasList Component
 * Lista customizada para Magias (nome + custo)
 */

"use client";

import React, {useState} from "react";
import {styled} from "@mui/material/styles";
import {
  Box,
  Autocomplete,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {POWERS} from "@/lib/rpgEngine";

const InputRow = styled(Box)(({theme}) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: "8px",
  alignItems: "center",
  padding: "12px",
  background: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  marginBottom: "16px",

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(2, 1fr)",
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
}));

function MagiasList({items = [], onAdd, onRemove, availableOptions}) {
  const [value, setValue] = useState(null);

  const optionsMap = availableOptions || POWERS;
  const optionsArray = React.useMemo(
    () =>
      Object.entries(optionsMap)
        .map(([name, data]) => ({
          name,
          ...data,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [optionsMap],
  );

  const handleAdd = () => {
    if (value) {
      onAdd?.({
        name: value.name,
        pp: value.pp || "",
        range: value.range || "",
        duration: value.duration || "",
        rank: value.rank || "",
        description: value.description || "",
      });
      setValue(null);
    }
  };

  return (
    <Box sx={{mb: 2}}>
      <InputRow>
        <Autocomplete
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          options={optionsArray}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Selecione uma magia" size="small" />
          )}
          renderOption={(props, option) => {
            const {key, ...optionProps} = props;
            return (
              <li key={key} {...optionProps}>
                <Box>
                  <Typography variant="body2" sx={{fontWeight: 600}}>
                    {option.name} ({option.rank})
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    PP: {option.pp} | Alcance: {option.range} | Duração:{" "}
                    {option.duration}
                  </Typography>
                </Box>
              </li>
            );
          }}
          fullWidth
          size="small"
          sx={{background: "#fff", borderRadius: "6px"}}
        />
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
              {item.description && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#555",
                    fontStyle: "italic",
                    marginTop: "2px",
                  }}
                >
                  {item.description}
                </div>
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

export default MagiasList;
