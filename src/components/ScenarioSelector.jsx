/**
 * ScenarioSelector Component
 * Selector para escolher o cenário da mesa
 */

"use client";

import React from "react";
import {FormControl, InputLabel, Select, MenuItem, Box, Typography} from "@mui/material";
import {AutoStories as BookIcon} from "@mui/icons-material";
import {getAvailableScenarios} from "@/scenarios/index.js";

const availableScenarios = getAvailableScenarios();

export default function ScenarioSelector({
  value = "solo-leveling",
  onChange,
  disabled = false,
  size = "medium",
  fullWidth = true,
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

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
        {availableScenarios.map((scenario) => (
          <MenuItem key={scenario.id} value={scenario.id}>
            <Box>
              <Typography variant="body1">{scenario.name}</Typography>
              {scenario.description && (
                <Typography variant="caption" color="text.secondary">
                  {scenario.description}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}