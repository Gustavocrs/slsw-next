/**
 * KeyValueEditor Component
 * Editor para campos key-value (Campos da Ficha, Estilos de Arte, Skills)
 */

"use client";

import React, {useState} from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const FIELD_TYPES = ["string", "number", "boolean"];

export default function KeyValueEditor({
  title,
  data = {},
  onChange,
  valueType = "string",
  keyPlaceholder = "Nome do campo",
  valuePlaceholder = "Valor",
}) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const entries = Object.entries(data);

  const handleAdd = () => {
    if (!newKey.trim()) {
      alert("Nome do campo é obrigatório");
      return;
    }
    if (newKey in data) {
      alert("Este campo já existe");
      return;
    }

    onChange({
      ...data,
      [newKey.trim()]: valueType === "number" 
        ? parseInt(newValue, 10) || 0 
        : newValue,
    });
    setNewKey("");
    setNewValue("");
  };

  const handleUpdate = (key, newVal) => {
    onChange({
      ...data,
      [key]: valueType === "number" ? parseInt(newVal, 10) || 0 : newVal,
    });
  };

  const handleDelete = (key) => {
    const {[key]: _, ...rest} = data;
    onChange(rest);
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {title} ({entries.length})
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{mb: 2}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Campo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>
                  <Typography fontWeight="bold">{key}</Typography>
                </TableCell>
                <TableCell>
                  {valueType === "object" ? (
                    <TextField
                      value={JSON.stringify(value)}
                      size="small"
                      fullWidth
                      onChange={(e) => {
                        try {
                          handleUpdate(key, JSON.parse(e.target.value));
                        } catch {}
                      }}
                    />
                  ) : valueType === "number" ? (
                    <TextField
                      type="number"
                      value={value}
                      size="small"
                      onChange={(e) => handleUpdate(key, e.target.value)}
                    />
                  ) : (
                    <TextField
                      value={value}
                      size="small"
                      fullWidth
                      onChange={(e) => handleUpdate(key, e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(key)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{py: 2}}>
                  <Typography color="text.secondary">
                    Nenhum item. Adicione abaixo.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          placeholder={keyPlaceholder}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          sx={{flex: 1}}
        />
        {valueType === "object" ? (
          <TextField
            size="small"
            placeholder="JSON"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            sx={{flex: 1}}
          />
        ) : valueType === "number" ? (
          <TextField
            type="number"
            size="small"
            placeholder={valuePlaceholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            sx={{width: 100}}
          />
        ) : (
          <TextField
            size="small"
            placeholder={valuePlaceholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            sx={{flex: 1}}
          />
        )}
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={!newKey.trim()}
        >
          Adicionar
        </Button>
      </Stack>
    </Box>
  );
}

export function ExtraFieldsEditor({data, onChange}) {
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("string");

  const entries = Object.entries(data || {});

  const handleAdd = () => {
    if (!newKey.trim() || !newLabel.trim()) {
      alert("Campo e Label são obrigatórios");
      return;
    }

    onChange({
      ...(data || {}),
      [newKey.trim()]: {type: newType, label: newLabel.trim()},
    });
    setNewKey("");
    setNewLabel("");
    setNewType("string");
  };

  const handleDelete = (key) => {
    const {[key]: _, ...rest} = data || {};
    onChange(rest);
  };

  const handleUpdate = (key, field, value) => {
    onChange({
      ...(data || {}),
      [key]: {...(data || {})[key], [field]: value},
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Campos Extras da Ficha ({entries.length})
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{mb: 2}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Campo (key)</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([key, config]) => (
              <TableRow key={key}>
                <TableCell><Typography fontWeight="bold">{key}</Typography></TableCell>
                <TableCell>{config.label}</TableCell>
                <TableCell>{config.type}</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => handleDelete(key)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{py: 2}}>
                  <Typography color="text.secondary">Nenhum campo extra.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField size="small" placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} sx={{width: 120}} />
        <TextField size="small" placeholder="Label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} sx={{flex: 1}} />
        <FormControl size="small" sx={{width: 100}}>
          <Select value={newType} onChange={(e) => setNewType(e.target.value)}>
            {FIELD_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAdd} disabled={!newKey.trim() || !newLabel.trim()}>Adicionar</Button>
      </Stack>
    </Box>
  );
}