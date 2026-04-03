/**
 * RulesTableEditor Component
 * Editor genérico de tabelas de dadosroláveis para cenários
 * Permite criar/editarsub-seções (ex: Despertar, Combat, etc) com opções (d6, d8, etc)
 */

"use client";

import React, {useState} from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

function TableEditor({
  title,
  data = [],
  onChange,
  maxOptions = 6,
  keyField = "d",
  valueField = "value",
  placeholder = "Novo valor",
}) {
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (!newValue.trim()) return;
    
    const nextD = data.length + 1;
    if (nextD > maxOptions) {
      alert(`Máximo de ${maxOptions} itens atingido`);
      return;
    }

    const newItem = {[keyField]: nextD, [valueField]: newValue.trim()};
    onChange([...data, newItem]);
    setNewValue("");
  };

  const handleUpdate = (index, newVal) => {
    const updated = [...data];
    updated[index] = {...updated[index], [valueField]: newVal};
    onChange(updated);
  };

  const handleDelete = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated.map((item, i) => ({...item, [keyField]: i + 1})));
  };

  return (
    <Box sx={{mb: 2}}>
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1}}>
        <Typography variant="body2" fontWeight="bold">
          {title} (d{maxOptions})
        </Typography>
        <Button 
          size="small" 
          color="error" 
          onClick={() => onChange([])}
        >
          Limpar
        </Button>
      </Box>
      
      <TableContainer component={Paper} variant="outlined" sx={{mb: 1}}>
        <Table size="small">
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell width={50} align="center">
                  <Chip size="small" label={item[keyField]} />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item[valueField]}
                    onChange={(e) => handleUpdate(index, e.target.value)}
                    size="small"
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell width={40}>
                  <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{py: 1}}>
                  <Typography variant="caption" color="text.secondary">Vazio</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder={`d${data.length + 1}`}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          sx={{flex: 1}}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleAdd}
          disabled={!newValue.trim() || data.length >= maxOptions}
        >
          +
        </Button>
      </Stack>
    </Box>
  );
}

export default function RulesTableEditor({data = {}, onChange}) {
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionMax, setNewSectionMax] = useState(6);

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    if (data[newSectionName.trim()]) {
      alert("Seção já existe!");
      return;
    }

    onChange({
      ...data,
      [newSectionName.trim()]: { max: newSectionMax, options: [] },
    });
    setNewSectionName("");
    setNewSectionMax(6);
  };

  const updateSection = (sectionName, newOptions) => {
    const currentMax = data[sectionName]?.max || 6;
    onChange({
      ...data,
      [sectionName]: { max: currentMax, options: newOptions },
    });
  };

  const deleteSection = (sectionName) => {
    const {[sectionName]: _, ...rest} = data;
    onChange(rest);
  };

  const sections = Object.entries(data);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Regras do Cenário (Tabelas de Dados)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
        Crie seções com opçõesroláveis (d6, d8, d10, etc). Ex: Despertar, Combat, Magia.
      </Typography>

      {/* Adicionar nova seção */}
      <Paper sx={{p: 2, mb: 3, bgcolor: "#f5f5f5"}}>
        <Typography variant="subtitle2" gutterBottom>Adicionar Nova Seção</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            label="Nome da Seção"
            placeholder="Ex: Despertar"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            sx={{flex: 1}}
          />
          <TextField
            size="small"
            label="Dados"
            type="number"
            value={newSectionMax}
            onChange={(e) => setNewSectionMax(parseInt(e.target.value) || 6)}
            sx={{width: 80}}
            inputProps={{min: 2, max: 20}}
          />
          <Button variant="contained" onClick={handleAddSection} disabled={!newSectionName.trim()}>
            Adicionar
          </Button>
        </Stack>
      </Paper>

      {/* Seções existentes */}
      {sections.length === 0 ? (
        <Typography color="text.secondary">Nenhuma seção criada.</Typography>
      ) : (
        sections.map(([sectionName, sectionData]) => (
          <Accordion key={sectionName} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", pr: 2}}>
                <Typography fontWeight="bold">{sectionName}</Typography>
                <Box>
                  <Chip size="small" label={`d${sectionData.max || 6}`} sx={{mr: 1}} />
                  <IconButton size="small" color="error" onClick={(e) => {e.stopPropagation(); deleteSection(sectionName);}}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableEditor
                title=""
                data={sectionData.options || []}
                onChange={(newOptions) => updateSection(sectionName, newOptions)}
                maxOptions={sectionData.max || 6}
              />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}