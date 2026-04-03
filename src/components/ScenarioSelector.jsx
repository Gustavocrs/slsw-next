/**
 * ScenarioSelector Component
 * Selector para escolher o cenário da mesa
 */

"use client";

import { AutoStories as BookIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as ScenarioService from "@/lib/scenarioService.js";

export default function ScenarioSelector({
  value = "solo-leveling",
  onChange,
  disabled = false,
  size = "medium",
  fullWidth = true,
}) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await ScenarioService.getAllScenarios();
        setScenarios(data);
      } catch (error) {
        console.error("Erro ao carregar cenários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  if (loading) {
    return (
      <FormControl fullWidth={fullWidth} disabled={disabled} size={size}>
        <InputLabel id="scenario-select-label">Cenário</InputLabel>
        <Select
          labelId="scenario-select-label"
          id="scenario-select"
          value={value}
          label="Cenário"
          onChange={handleChange}
        >
          <MenuItem value={value}>
            <CircularProgress size={20} />
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} size={size}>
      <InputLabel id="scenario-select-label">Cenário</InputLabel>
      <Select
        labelId="scenario-select-label"
        id="scenario-select"
        value={value}
        label="Cenário"
        onChange={handleChange}
      >
        {scenarios.map((scenario) => (
          <MenuItem key={scenario.id} value={scenario.id}>
            <Box>
              <Typography variant="body1">
                {scenario.metadata?.name || scenario.id}
              </Typography>
              {scenario.metadata?.description && (
                <Typography variant="caption" color="text.secondary">
                  {scenario.metadata.description}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
