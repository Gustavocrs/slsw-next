/**
 * GenericItemForm Component
 * Formulário genérico para adicionar/editar Vantagens, Complicações e Poderes
 */

"use client";

import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
} from "@mui/material";

const RANKS = ["Novato", "Experiente", "Veterano", "Heroico", "Lendário"];
const HINDRANCE_SEVERITY = ["Maior", "Menor"];

export default function GenericItemForm({
  open,
  onClose,
  onSave,
  type = "edge",
  editItem = null,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editItem) {
      setFormData({...editItem});
    } else {
      setFormData({
        name: "",
        rank: "Novato",
        description: "",
        source: "SL",
        ...(type === "hindrance" && {severity: "Menor"}),
        ...(type === "power" && {pp: 1, range: "", duration: "", rank: "Novato"}),
      });
    }
  }, [editItem, type]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("Nome é obrigatório");
      return;
    }
    onSave(formData);
    onClose();
  };

  const isValid = formData.name?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editItem ? "Editar" : "Adicionar"}{" "}
        {type === "edge"
          ? "Vantagem"
          : type === "hindrance"
          ? "Complicação"
          : "Poder"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}}>
          <TextField
            label="Nome"
            value={formData.name || ""}
            onChange={handleChange("name")}
            fullWidth
            required
            helperText="Nome único do item"
          />

          {type === "power" && (
            <>
              <TextField
                label="Custo (PP)"
                type="number"
                value={formData.pp || ""}
                onChange={handleChange("pp")}
                fullWidth
                inputProps={{min: 0}}
              />
              <TextField
                label="Alcance"
                value={formData.range || ""}
                onChange={handleChange("range")}
                fullWidth
                placeholder="Ex: Toque, 10m, Pessoal"
              />
              <TextField
                label="Duração"
                value={formData.duration || ""}
                onChange={handleChange("duration")}
                fullWidth
                placeholder="Ex: Instantânea, 1 cena, Sustentada"
              />
            </>
          )}

          {type !== "power" && (
            <FormControl fullWidth>
              <InputLabel>Rank</InputLabel>
              <Select
                value={formData.rank || "Novato"}
                label="Rank"
                onChange={handleChange("rank")}
              >
                {RANKS.map((rank) => (
                  <MenuItem key={rank} value={rank}>
                    <Chip label={rank} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {type === "hindrance" && (
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.severity || "Menor"}
                label="Tipo"
                onChange={handleChange("severity")}
              >
                {HINDRANCE_SEVERITY.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {type === "power" && (
            <FormControl fullWidth>
              <InputLabel>Rank do Poder</InputLabel>
              <Select
                value={formData.rank || "Novato"}
                label="Rank do Poder"
                onChange={handleChange("rank")}
              >
                {RANKS.map((rank) => (
                  <MenuItem key={rank} value={rank}>
                    <Chip label={rank} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            label="Descrição"
            value={formData.description || ""}
            onChange={handleChange("description")}
            fullWidth
            multiline
            rows={4}
            placeholder="Descrição detalhada do item..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValid}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}