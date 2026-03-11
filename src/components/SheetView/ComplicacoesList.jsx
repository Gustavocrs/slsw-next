/**
 * ComplicacoesList Component
 * Lista customizada para Complicações com Select e exibição detalhada
 */

"use client";

import React from "react";
import {styled} from "@mui/material/styles";
import {
  Box,
  Autocomplete,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {HINDRANCES} from "@/lib/rpgEngine";

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

function ComplicacoesList({items = [], onAdd, onRemove, disabled = false}) {
  const [value, setValue] = React.useState(null);

  const handleAdd = () => {
    if (value) {
      onAdd?.({name: value.name});
      setValue(null);
    }
  };

  const handleRemove = (index) => {
    onRemove?.(index);
  };

  return (
    <Box sx={{mb: 2}}>
      {/* Input Row */}
      <InputRow>
        <Autocomplete
          value={value}
          disabled={disabled}
          onChange={(event, newValue) => setValue(newValue)}
          options={HINDRANCES}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione uma complicação"
              size="small"
            />
          )}
          renderOption={(props, option) => {
            const {key, ...optionProps} = props;
            return (
              <li key={key} {...optionProps}>
                <Box>
                  <Typography variant="body2" sx={{fontWeight: 600}}>
                    {option.name}{" "}
                    {option.name.includes(`(${option.type})`)
                      ? ""
                      : `(${option.type})`}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {option.description}
                  </Typography>
                </Box>
              </li>
            );
          }}
          fullWidth
          size="small"
          sx={{
            background: "#fff",
            borderRadius: "6px",
          }}
        />

        <Button onClick={handleAdd} disabled={disabled}>
          +{" "}
        </Button>
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
                {item.name}{" "}
                {item.name.includes(`(${item.type})`) ? "" : `- ${item.type}`}
              </p>
              <span style={{fontSize: "0.75rem", color: "#666"}}>
                {item.description}
              </span>
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
    </Box>
  );
}

export default ComplicacoesList;
