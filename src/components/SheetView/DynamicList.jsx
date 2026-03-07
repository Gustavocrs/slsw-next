/**
 * DynamicList Component
 * Componente reutilizável para gerenciar listas dinâmicas
 */

"use client";

import React from "react";
import {styled} from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const CardStyled = styled(Card)(({theme}) => ({
  marginBottom: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  background: "#fff",
}));

const CardHeaderStyled = styled(CardHeader)(({theme}) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "12px 12px 0 0",

  "& .MuiCardHeader-title": {
    fontWeight: 700,
    fontSize: "1.2rem",
  },
}));

const ItemRow = styled(Box)(({theme, columns}) => ({
  display: "grid",
  gridTemplateColumns: columns || "1fr",
  gap: "12px",
  padding: "12px 0",
  borderBottom: "1px solid #e0e0e0",
  alignItems: "center",

  "&:last-child": {
    borderBottom: "none",
  },
}));

const ActionButtons = styled(Box)(({theme}) => ({
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
}));

const AddButtonContainer = styled(Box)(({theme}) => ({
  paddingTop: "12px",
  display: "flex",
  gap: "8px",
}));

function DynamicList({
  title,
  items = [],
  fields = [],
  onAdd,
  onRemove,
  onUpdate,
  icon: Icon,
  addButtonLabel = "+ ",
}) {
  const handleAdd = () => {
    const emptyItem = {};
    fields.forEach((field) => {
      emptyItem[field.name] = field.defaultValue || "";
    });
    onAdd?.(emptyItem);
  };

  const handleRemove = (index) => {
    onRemove?.(index);
  };

  const handleUpdate = (index, fieldName, value) => {
    const updatedItem = {...items[index]};
    updatedItem[fieldName] = value;
    onUpdate?.(index, updatedItem);
  };

  const columnTemplate = fields.map(() => "1fr").join(" ") + " auto";

  return (
    <CardStyled>
      <CardHeaderStyled title={title} avatar={Icon && <Icon />} />

      <CardContent>
        {items.length === 0 ? (
          <Box sx={{textAlign: "center", py: 3, color: "#999"}}>
            Nenhum item adicionado
          </Box>
        ) : (
          <>
            {/* Header */}
            <ItemRow columns={columnTemplate} sx={{fontWeight: 700, pb: 1}}>
              {fields.map((field) => (
                <Box key={field.name}>{field.label}</Box>
              ))}
              <Box></Box>
            </ItemRow>

            {/* Items */}
            {items.map((item, index) => (
              <ItemRow key={index} columns={columnTemplate}>
                {fields.map((field) => (
                  <Box key={field.name}>
                    {field.type === "select" ? (
                      <Select
                        value={item[field.name] || ""}
                        onChange={(e) =>
                          handleUpdate(index, field.name, e.target.value)
                        }
                        size="small"
                        fullWidth
                        disabled={field.disabled}
                      >
                        {field.options?.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <TextField
                        value={item[field.name] || ""}
                        onChange={(e) =>
                          handleUpdate(index, field.name, e.target.value)
                        }
                        size="small"
                        fullWidth
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                      />
                    )}
                  </Box>
                ))}
                <ActionButtons>
                  <IconButton
                    onClick={() => handleRemove(index)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ActionButtons>
              </ItemRow>
            ))}
          </>
        )}

        {/* Add Button */}
        <AddButtonContainer>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            fullWidth
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {addButtonLabel}
          </Button>
        </AddButtonContainer>
      </CardContent>
    </CardStyled>
  );
}

export default DynamicList;
