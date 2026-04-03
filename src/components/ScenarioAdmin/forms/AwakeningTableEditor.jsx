/**
 * AwakeningTableEditor Component
 * Editor de tabelas para regras do Despertar
 * Fluxo: Criar regra → Escolher dado → Gerar tabela com linhas em branco
 */

"use client";

import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const DICE_OPTIONS = [
  { value: 4, label: "d4" },
  { value: 6, label: "d6" },
  { value: 8, label: "d8" },
  { value: 10, label: "d10" },
  { value: 12, label: "d12" },
  { value: 20, label: "d20" },
];

function transformLegacyData(data) {
  if (!data || Array.isArray(data)) {
    if (data && data.length > 0) return data;

    return [];
  }

  if (typeof data !== "object") return [];

  const rules = [];
  const mappings = [
    { key: "origem", name: "Origem do Despertar", dice: 6 },
    { key: "sensacao", name: "Sensação do Despertar", dice: 8 },
    { key: "afinidade", name: "Afinidade de Mana", dice: 10 },
    { key: "marca", name: "Marca do Despertar", dice: 12 },
  ];

  for (const { key, name, dice } of mappings) {
    if (data[key] && Array.isArray(data[key]) && data[key].length > 0) {
      rules.push({
        name: name,
        dice: dice,
        values: data[key].map((item) => ({
          d: item.d,
          value: item.value || "",
        })),
      });
    }
  }

  return rules;
}

function RuleTableEditor({ rule, onUpdateRule, onDeleteRule }) {
  const handleUpdateValue = (index, newValue) => {
    const updated = [...rule.values];
    updated[index] = { ...updated[index], value: newValue };
    onUpdateRule({ ...rule, values: updated });
  };

  const handleDeleteRow = (index) => {
    const updated = rule.values.filter((_, i) => i !== index);
    onUpdateRule({ ...rule, values: updated });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {rule.name}{" "}
          <Typography component="span" variant="caption">
            (d{rule.dice})
          </Typography>
        </Typography>
        <IconButton size="small" color="error" onClick={onDeleteRule}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={60} align="center">
                d{rule.dice}
              </TableCell>
              <TableCell>Valor</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rule.values.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <Typography fontWeight="bold">{item.d}</Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.value || ""}
                    onChange={(e) => handleUpdateValue(index, e.target.value)}
                    size="small"
                    fullWidth
                    variant="standard"
                    placeholder="Digite o valor..."
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rule.values.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                  <Typography color="text.secondary">
                    Nenhum valor definido
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function AwakeningTableEditor({ data, onChange }) {
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDice, setNewRuleDice] = useState(6);

  const rules = transformLegacyData(data);

  const handleAddRule = () => {
    if (!newRuleName.trim()) return;

    const values = [];
    for (let i = 1; i <= newRuleDice; i++) {
      values.push({ d: i, value: "" });
    }

    const newRule = {
      name: newRuleName.trim(),
      dice: newRuleDice,
      values: values,
    };

    onChange([...rules, newRule]);
    setNewRuleName("");
  };

  const handleUpdateRule = (updatedRule) => {
    const newRules = rules.map((r) =>
      r.name === updatedRule.name ? updatedRule : r,
    );
    onChange(newRules);
  };

  const handleDeleteRule = (ruleName) => {
    onChange(rules.filter((r) => r.name !== ruleName));
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Criar Regra
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            label="Nome da Regra"
            placeholder="Ex: Origem, Tipo, Categoria"
            value={newRuleName}
            onChange={(e) => setNewRuleName(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Dado</InputLabel>
            <Select
              value={newRuleDice}
              label="Dado"
              onChange={(e) => setNewRuleDice(e.target.value)}
            >
              {DICE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddRule}
            disabled={!newRuleName.trim()}
          >
            Adicionar
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {rules.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Nenhuma regra criada. Crie uma acima para começar.
        </Typography>
      )}

      {rules.map((rule, index) => (
        <RuleTableEditor
          key={rule.name || index}
          rule={rule}
          onUpdateRule={handleUpdateRule}
          onDeleteRule={() => handleDeleteRule(rule.name)}
        />
      ))}
    </Box>
  );
}
